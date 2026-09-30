import React, { useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  ChevronDown,
  FileText,
  Package,
  CreditCard,
  MoreHorizontal,
  Search,
  Home,
  Tag,
  Camera,
  Check,
} from 'lucide-react';
import { PlatformHeaderLogo } from '../../config/platformLogos';
import { ShopifyOrder } from '../../types';
import { CountUp, decimalsOf } from '../common/CountUp';
import { PullSpinner } from '../common/PullSpinner';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import {
  ShopTab,
  buildOrders,
  OrdersScreen,
  OrderDetail,
  ProductsScreen,
  SearchScreen,
  MenuScreen,
} from './shopify/ShopifyScreens';

const FONT = '[font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif]';
const DAYS = 30;

const money = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Smallest "nice" axis ceiling (1 / 2 / 2.5 / 5 / 10 × 10^n) that fits v */
const niceCeil = (v: number) => {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= v) return m * mag;
  return 10 * mag;
};

const compact = (n: number) => (n >= 1000 ? `${Number((n / 1000).toFixed(1))}K` : `${n}`);

/** Stretch the phase's chart points into a 30-day series (deterministic wobble, mean = total/30) */
const buildSeries = (shape: number[], total: number): number[] => {
  const src = shape.length > 1 ? shape : [1, 1];
  const raw = Array.from({ length: DAYS }, (_, i) => {
    const t = (i / (DAYS - 1)) * (src.length - 1);
    const a = Math.floor(t);
    const b = Math.min(a + 1, src.length - 1);
    const base = src[a] + (src[b] - src[a]) * (t - a);
    const wobble = 1 + 0.06 * Math.sin(i * 2.3) + 0.04 * Math.sin(i * 5.1 + 1);
    return Math.max(base, 0.05) * wobble;
  });
  const mean = raw.reduce((x, y) => x + y, 0) / raw.length || 1;
  const target = total / DAYS;
  return raw.map((v) => (v / mean) * target);
};

export const ShopifyDashboard: React.FC = () => {
  const {
    activePhase,
    setCurrentPlatform,
    appMode,
    setAppMode,
    openInlineEdit,
    openImagePicker,
    updateShopify,
    setIsControlCenterOpen,
  } = useApp();

  const shop = activePhase.shopify;
  const isEditing = appMode === 'edit';
  const editRing = isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50 rounded-lg' : '';

  const visitors = shop.visitorsOnline ?? shop.sessions;
  const toFulfill = shop.ordersToFulfill ?? 2;
  const toCapture = shop.paymentsToCapture ?? 1;

  const [tab, setTab] = useState<ShopTab>('home');
  const [openOrder, setOpenOrder] = useState<ShopifyOrder | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const ptr = usePullToRefresh(rootRef, () => setRefreshKey((k) => k + 1));
  const orders = useMemo(() => buildOrders(shop, toFulfill, toCapture), [shop, toFulfill, toCapture]);
  const goTab = (t: ShopTab) => {
    setTab(t);
    setOpenOrder(null);
    window.scrollTo?.({ top: 0 });
  };

  // ---- Chart ----
  const W = 360;
  const H = 120;
  const chart = useMemo(() => {
    const shape = (shop.chartPoints.length ? shop.chartPoints : [{ sales: 1 }, { sales: 1.2 }, { sales: 1.4 }]).map(
      (p) => p.sales
    );
    const cur = buildSeries(shape, shop.totalSales);
    const ratio = 1 / (1 + Math.max(shop.salesChange, -90) / 100);
    const prev = cur.map((v, i) => v * ratio * (1 + 0.07 * Math.sin(i * 1.7 + 2)));
    const top = niceCeil(Math.max(...cur, ...prev) * 1.02);
    const toPath = (arr: number[]) =>
      arr
        .map((v, i) => `${i === 0 ? 'M' : 'L'} ${((i / (arr.length - 1)) * W).toFixed(1)} ${(H - (v / top) * (H - 4) - 2).toFixed(1)}`)
        .join(' ');
    return { top, curD: toPath(cur), prevD: toPath(prev) };
  }, [shop.chartPoints, shop.totalSales, shop.salesChange]);

  const fmtDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const initial = (shop.storeName || 'M').trim().charAt(0).toUpperCase();

  return (
    <div ref={rootRef} className={`flex flex-col min-h-full bg-black text-[#303030] select-none ${FONT}`}>
      {/* Edit Mode Top Banner */}
      {isEditing && (
        <div className="bg-emerald-600 px-4 py-1.5 flex items-center justify-between text-xs text-white">
          <span className="font-semibold">Edit Mode: Tap any stat or product to customize</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPlatform('launcher')} className="underline font-medium hover:text-white/80">
              Launcher
            </button>
            <button onClick={() => setIsControlCenterOpen(true)} className="underline font-medium hover:text-white/80">
              Control Center
            </button>
            <button
              onClick={() => setAppMode('film')}
              className="bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Black app bar */}
      <header className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),14px)] pb-3.5 text-white">
        <button onClick={() => goTab('menu')} className="active:opacity-60" aria-label="Menu">
          <Menu className="w-[26px] h-[26px]" strokeWidth={2} />
        </button>
        <div
          onClick={() => {
            if (!isEditing) {
              goTab('home');
              return;
            }
            openInlineEdit({
              label: 'Shopify Store Name',
              value: shop.storeName,
              onSave: (val) => updateShopify({ storeName: val }),
            });
          }}
          className={`flex items-center gap-2.5 ${isEditing ? 'cursor-pointer ring-1 ring-emerald-500/60 rounded-lg px-1' : ''}`}
        >
          <PlatformHeaderLogo platform="shopify" className="w-[30px]! h-[30px]! rounded-lg!" />
          <span className="text-[19px] font-semibold tracking-tight">{shop.storeName}</span>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-[22px] h-[22px]" strokeWidth={1.8} />
          <div className="w-[34px] h-[34px] rounded-full bg-[#6c71c9] flex items-center justify-center text-[16px] font-medium">
            {initial}
          </div>
        </div>
      </header>

      <PullSpinner offset={ptr.offset} refreshing={ptr.refreshing} dragging={ptr.dragging} />

      {/* White sheet */}
      <main key={tab + (openOrder?.id ?? '')} className="flex-1 bg-white rounded-t-[28px] px-4 pt-4 pb-36 screen-fade">
        {tab === 'home' && (
          <>
        {/* Pills */}
        <div className="flex items-center gap-2">
          <div className="h-9 px-3.5 rounded-xl bg-[#f1f1f1] flex items-center gap-1.5 text-[15px] font-medium text-[#303030]">
            <span>Last 30 days</span>
            <ChevronDown className="w-4 h-4 text-[#616161]" strokeWidth={2.2} />
          </div>
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Visitors Online',
                value: visitors,
                type: 'number',
                onSave: (val) => updateShopify({ visitorsOnline: val }),
              });
            }}
            className={`h-9 px-3.5 rounded-xl bg-[#f1f1f1] flex items-center gap-2 text-[15px] font-medium text-[#303030] ${
              isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50' : ''
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2f8f6b]" />
            <span className="tabular-nums"><CountUp value={visitors} replayKey={refreshKey} /></span>
          </div>
          <div className="h-9 px-3.5 rounded-xl bg-[#f1f1f1] flex items-center gap-1.5 text-[15px] font-medium text-[#303030]">
            <FileText className="w-[18px] h-[18px] text-[#616161]" strokeWidth={1.8} />
            <span>Reports</span>
          </div>
        </div>

        {/* Total sales */}
        <div className="mt-5">
          <div className="text-[15px] text-[#616161]">Total sales</div>
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Total Sales',
                value: shop.totalSales,
                type: 'number',
                prefix: shop.currency,
                onSave: (val) => updateShopify({ totalSales: val, netSales: val }),
              });
            }}
            className={`text-[40px] leading-[1.15] font-bold tracking-tight tabular-nums text-[#1a1a1a] inline-block ${editRing}`}
          >
            <CountUp value={shop.totalSales} decimals={2} prefix={shop.currency} replayKey={refreshKey} />
          </div>
        </div>

        {/* Orders + conversion */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Total Orders',
                value: shop.ordersCount,
                type: 'number',
                onSave: (val) => updateShopify({ ordersCount: val }, true),
              });
            }}
            className={isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50 rounded-lg' : ''}
          >
            <div className="text-[15px] text-[#616161]">Total orders</div>
            <div className="text-[26px] font-bold text-[#1a1a1a] tabular-nums leading-tight mt-0.5">
              <CountUp value={shop.ordersCount} replayKey={refreshKey} />
            </div>
          </div>
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Conversion Rate %',
                value: shop.conversionRate,
                type: 'number',
                suffix: '%',
                onSave: (val) => updateShopify({ conversionRate: val }),
              });
            }}
            className={isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50 rounded-lg' : ''}
          >
            <div className="text-[15px] text-[#616161]">Conversion rate</div>
            <div className="text-[26px] font-bold text-[#1a1a1a] tabular-nums leading-tight mt-0.5">
              <CountUp value={shop.conversionRate} decimals={decimalsOf(shop.conversionRate)} suffix="%" replayKey={refreshKey} />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6">
          <div className="flex justify-between text-[12px] text-[#8a8a8a] mb-1">
            <span>{shop.currency}0.0</span>
            <span>
              {shop.currency}
              {compact(chart.top)}
            </span>
          </div>
          <svg key={`chart-${refreshKey}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-[120px] overflow-visible">
            <defs>
              <clipPath id="shopReveal">
                <rect x="-4" y="-6" height={H + 12} width="0">
                  <animate attributeName="width" from="0" to={W + 8} dur="1.1s" begin="0s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.22 0.61 0.36 1" />
                </rect>
              </clipPath>
            </defs>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2={W} y1={(i / 3) * (H - 1) + 0.5} y2={(i / 3) * (H - 1) + 0.5} stroke="#e3e3e3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            <path clipPath="url(#shopReveal)" d={chart.prevD} fill="none" stroke="#b5b5b5" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path clipPath="url(#shopReveal)" d={chart.curD} fill="none" stroke="#3d6fd9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="flex justify-between text-[12px] text-[#8a8a8a] mt-2.5">
            <span>{fmtDate(DAYS - 1)}</span>
            <span>{fmtDate(14)}</span>
            <span>{fmtDate(0)}</span>
          </div>
        </div>

        {/* To-do cards */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Orders to Fulfill',
                value: toFulfill,
                type: 'number',
                onSave: (val) => updateShopify({ ordersToFulfill: val }),
              });
            }}
            className={`relative h-[104px] rounded-2xl bg-[#f4f4f4] p-4 flex flex-col justify-between ${isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50' : ''}`}
          >
            <Package className="absolute top-4 right-4 w-[18px] h-[18px] text-[#616161]" strokeWidth={1.8} />
            <div className="text-[32px] leading-none font-semibold text-[#1a1a1a] tabular-nums"><CountUp value={toFulfill} duration={700} replayKey={refreshKey} /></div>
            <div className="text-[15px] text-[#616161]">Orders to fulfill</div>
          </div>
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Payments to Capture',
                value: toCapture,
                type: 'number',
                onSave: (val) => updateShopify({ paymentsToCapture: val }),
              });
            }}
            className={`relative h-[104px] rounded-2xl bg-[#f4f4f4] p-4 flex flex-col justify-between ${isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50' : ''}`}
          >
            <CreditCard className="absolute top-4 right-4 w-[18px] h-[18px] text-[#616161]" strokeWidth={1.8} />
            <div className="text-[32px] leading-none font-semibold text-[#1a1a1a] tabular-nums"><CountUp value={toCapture} duration={700} replayKey={refreshKey} /></div>
            <div className="text-[15px] text-[#616161]">Payment to capture</div>
          </div>
        </div>

        {/* Credit banner */}
        <div className="mt-4 rounded-2xl border border-[#e3e3e3] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-[17px] font-semibold text-[#1a1a1a] leading-snug">Get up to $2,000 in Shopify Credit</div>
            <MoreHorizontal className="w-5 h-5 text-[#616161] shrink-0 mt-0.5" />
          </div>
          <p className="text-[15px] text-[#616161] mt-2 leading-snug">
            Spend on apps, themes, and other Shopify services. Terms apply.
          </p>
        </div>

        {/* Top products */}
        {shop.topProducts.length > 0 && (
          <div className="mt-6">
            <div className="text-[17px] font-semibold text-[#1a1a1a] mb-3">Top products by units sold</div>
            <div className="space-y-3">
              {shop.topProducts.map((prod, idx) => (
                <div key={prod.id} className="flex items-center gap-3">
                  <div
                    onClick={() => {
                      if (!isEditing) return;
                      openImagePicker({
                        title: `Change Photo: ${prod.name}`,
                        currentImage: prod.image,
                        onSaveImage: (newUrl) => {
                          const updated = [...shop.topProducts];
                          updated[idx] = { ...updated[idx], image: newUrl };
                          updateShopify({ topProducts: updated });
                        },
                      });
                    }}
                    className={`relative w-12 h-12 rounded-lg bg-[#f1f1f1] overflow-hidden shrink-0 border border-[#e3e3e3] ${
                      isEditing ? 'cursor-pointer ring-2 ring-emerald-500' : ''
                    }`}
                  >
                    <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Camera className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => {
                        if (!isEditing) return;
                        openInlineEdit({
                          label: 'Product Name',
                          value: prod.name,
                          onSave: (val) => {
                            const updated = [...shop.topProducts];
                            updated[idx] = { ...updated[idx], name: val };
                            updateShopify({ topProducts: updated });
                          },
                        });
                      }}
                      className={`text-[15px] font-medium text-[#1a1a1a] truncate ${isEditing ? 'cursor-pointer underline' : ''}`}
                    >
                      {prod.name}
                    </div>
                    <div className="text-[13px] text-[#616161] mt-0.5">{prod.unitsSold} units</div>
                  </div>
                  <div className="text-[15px] font-semibold text-[#1a1a1a] tabular-nums">
                    {shop.currency}
                    {prod.sales.toLocaleString('en-US')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent orders */}
        {shop.recentOrders.length > 0 && (
          <div className="mt-6">
            <div className="text-[17px] font-semibold text-[#1a1a1a] mb-2">Recent orders</div>
            <div className="divide-y divide-[#ebebeb]">
              {shop.recentOrders.map((ord, idx) => (
                <div key={ord.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="flex items-center gap-2 text-[15px]">
                      <span className="font-semibold text-[#1a1a1a]">{ord.orderNumber}</span>
                      <span
                        onClick={() => {
                          if (!isEditing) return;
                          openInlineEdit({
                            label: 'Customer Name',
                            value: ord.customerName,
                            onSave: (val) => {
                              const updated = [...shop.recentOrders];
                              updated[idx] = { ...updated[idx], customerName: val };
                              updateShopify({ recentOrders: updated });
                            },
                          });
                        }}
                        className={`text-[#303030] ${isEditing ? 'cursor-pointer underline' : ''}`}
                      >
                        {ord.customerName}
                      </span>
                    </div>
                    <div className="text-[13px] text-[#616161] mt-0.5">
                      {ord.itemsSummary} · {ord.dateAgo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      onClick={() => {
                        if (!isEditing) return;
                        openInlineEdit({
                          label: 'Order Amount',
                          value: ord.amount,
                          type: 'number',
                          prefix: shop.currency,
                          onSave: (val) => {
                            const updated = [...shop.recentOrders];
                            updated[idx] = { ...updated[idx], amount: val };
                            updateShopify({ recentOrders: updated });
                          },
                        });
                      }}
                      className={`text-[15px] font-semibold text-[#1a1a1a] tabular-nums ${isEditing ? 'cursor-pointer underline' : ''}`}
                    >
                      {shop.currency}
                      {ord.amount.toFixed(2)}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[12px] font-medium mt-1 ${
                        ord.status === 'Paid'
                          ? 'bg-[#cdfee1] text-[#0c5132]'
                          : ord.status === 'Fulfilled'
                          ? 'bg-[#e3e3e3] text-[#303030]'
                          : 'bg-[#ffd6a4] text-[#5e4200]'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}

        {tab === 'orders' && !openOrder && <OrdersScreen orders={orders} shop={shop} onOpen={setOpenOrder} />}
        {tab === 'orders' && openOrder && <OrderDetail order={openOrder} shop={shop} onBack={() => setOpenOrder(null)} />}
        {tab === 'products' && <ProductsScreen shop={shop} />}
        {tab === 'search' && (
          <SearchScreen
            shop={shop}
            orders={orders}
            onOpenOrder={(o) => {
              setTab('orders');
              setOpenOrder(o);
            }}
          />
        )}
        {tab === 'menu' && <MenuScreen shop={shop} />}
      </main>

      {/* Floating pill nav */}
      <nav className="fixed left-1/2 -translate-x-1/2 bottom-[max(env(safe-area-inset-bottom),14px)] z-40 w-[calc(100%-32px)] max-w-[23rem]">
        <div className="h-[66px] rounded-full bg-white border border-[#dcdcdc] shadow-[0_4px_18px_rgba(0,0,0,0.14)] flex items-center justify-between px-3.5 text-[#303030]">
          {(
            [
              ['search', Search],
              ['home', Home],
              ['orders', Package],
              ['products', Tag],
              ['menu', Menu],
            ] as const
          ).map(([id, Icon]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => goTab(id)}
                aria-label={id}
                className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${
                  active ? 'bg-[#1a1a1a] text-white' : 'text-[#303030]'
                }`}
              >
                <Icon className={`w-6 h-6 ${active && id === 'home' ? 'fill-white' : ''}`} strokeWidth={1.8} />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
