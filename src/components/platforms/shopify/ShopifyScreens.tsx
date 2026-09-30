import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Megaphone,
  Percent,
  BarChart3,
  LayoutGrid,
  Settings,
  Store,
  Landmark,
} from 'lucide-react';
import { ShopifyData, ShopifyOrder } from '../../../types';
import { hash, makeRng } from '../../../lib/seed';

export type ShopTab = 'home' | 'search' | 'orders' | 'products' | 'menu';

const FIRST = ['Marcus', 'Elena', 'Sofia', 'Liam', 'Noah', 'Ava', 'Mia', 'Lucas', 'Isabella', 'Ethan', 'Olivia', 'Mateo', 'Chloe', 'Daniel', 'Grace', 'Henry', 'Zoe', 'Julian', 'Nina', 'Owen'];
const LAST = ['Vance', 'Rostova', 'Martins', 'Carter', 'Nguyen', 'Silva', 'Brooks', 'Ortiz', 'Kim', 'Hughes', 'Patel', 'Duarte', 'Reed', 'Costa', 'Bennett', 'Moreau', 'Lindgren', 'Okafor', 'Fischer', 'Santos'];
const CITIES = ['Austin, TX', 'Denver, CO', 'Seattle, WA', 'Miami, FL', 'Portland, OR', 'Chicago, IL', 'Brooklyn, NY', 'San Diego, CA', 'Nashville, TN', 'Toronto, ON'];

const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------ order history */
/** Your recent orders first, then a stable generated history. Unfulfilled / authorized counts follow the Home cards. */
export function buildOrders(shop: ShopifyData, toFulfill: number, toCapture: number): ShopifyOrder[] {
  const r = makeRng(hash(`${shop.storeName}|${shop.ordersCount}`));
  const rows: ShopifyOrder[] = shop.recentOrders.map((o) => ({ ...o }));
  const last = rows[rows.length - 1];
  let num = last ? parseInt(last.orderNumber.replace(/\D/g, ''), 10) - 1 : 1000 + shop.ordersCount;
  if (isNaN(num)) num = 1000 + shop.ordersCount;

  for (let i = rows.length; i < 24; i++) {
    const hoursAgo = 26 + (i - rows.length) * (3 + r() * 9);
    const dateAgo =
      hoursAgo < 48 ? `${Math.round(hoursAgo)} hours ago` : `${Math.round(hoursAgo / 24)} days ago`;
    const items = 1 + Math.floor(r() * 3);
    const amount = Math.round(shop.aov * (0.6 + r() * 0.9) * 100) / 100;
    rows.push({
      id: `gen-${num}`,
      orderNumber: `#${num}`,
      customerName: `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`,
      itemsSummary: `${items} item${items > 1 ? 's' : ''}`,
      amount,
      status: 'Fulfilled',
      dateAgo,
    });
    num -= 1;
  }
  return rows.map((o, i) => {
    if (i < toFulfill) return { ...o, status: 'Paid' as const };
    if (i < toFulfill + toCapture) return { ...o, status: 'Authorized' as const };
    return o.status === 'Paid' || o.status === 'Authorized' || o.status === 'Unfulfilled' ? { ...o, status: 'Fulfilled' as const } : o;
  });
}

/* ------------------------------------------------------------ bits */
const Badge: React.FC<{ tone: 'gray' | 'amber'; children: React.ReactNode }> = ({ tone, children }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-md text-[12px] font-medium ${
      tone === 'amber' ? 'bg-[#ffd6a4] text-[#5e4200]' : 'bg-[#e3e3e3] text-[#303030]'
    }`}
  >
    {children}
  </span>
);

const OrderBadges: React.FC<{ o: ShopifyOrder }> = ({ o }) => (
  <div className="flex gap-1.5 flex-wrap">
    <Badge tone={o.status === 'Authorized' ? 'amber' : 'gray'}>{o.status === 'Authorized' ? 'Payment pending' : 'Paid'}</Badge>
    <Badge tone={o.status === 'Fulfilled' ? 'gray' : 'amber'}>{o.status === 'Fulfilled' ? 'Fulfilled' : 'Unfulfilled'}</Badge>
  </div>
);

const OrderRow: React.FC<{ o: ShopifyOrder; cur: string; onOpen: (o: ShopifyOrder) => void }> = ({ o, cur, onOpen }) => (
  <button onClick={() => onOpen(o)} className="w-full text-left py-3.5 flex items-start justify-between gap-3 active:bg-[#f7f7f7]">
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-[16px]">
        <span className="font-semibold text-[#1a1a1a]">{o.orderNumber}</span>
        <span className="text-[#303030] truncate">{o.customerName}</span>
      </div>
      <div className="text-[13px] text-[#616161] mt-0.5 mb-1.5">
        {o.itemsSummary} · {o.dateAgo}
      </div>
      <OrderBadges o={o} />
    </div>
    <div className="text-[16px] font-semibold text-[#1a1a1a] tabular-nums shrink-0">
      {cur}
      {money(o.amount)}
    </div>
  </button>
);

/* ------------------------------------------------------------ orders */
export const OrdersScreen: React.FC<{ orders: ShopifyOrder[]; shop: ShopifyData; onOpen: (o: ShopifyOrder) => void }> = ({ orders, shop, onOpen }) => {
  const [filter, setFilter] = useState<'all' | 'unfulfilled' | 'paid'>('all');
  const shown = orders.filter((o) =>
    filter === 'all' ? true : filter === 'unfulfilled' ? o.status !== 'Fulfilled' : o.status !== 'Authorized'
  );
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight">Orders</h1>
        <span className="text-[14px] text-[#616161]">{shop.ordersCount.toLocaleString('en-US')} in 30 days</span>
      </div>
      <div className="flex gap-2 mt-3">
        {([['all', 'All'], ['unfulfilled', 'Unfulfilled'], ['paid', 'Paid']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`h-9 px-3.5 rounded-xl text-[15px] font-medium transition ${
              filter === id ? 'bg-[#1a1a1a] text-white' : 'bg-[#f1f1f1] text-[#303030]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-2 divide-y divide-[#ebebeb]">
        {shown.map((o) => (
          <OrderRow key={o.id} o={o} cur={shop.currency} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ order detail */
export const OrderDetail: React.FC<{ order: ShopifyOrder; shop: ShopifyData; onBack: () => void }> = ({ order, shop, onBack }) => {
  const cur = shop.currency;
  const data = useMemo(() => {
    const r = makeRng(hash(order.id));
    const n = Math.max(1, parseInt(order.itemsSummary, 10) || 1);
    const shipping = order.amount > 75 ? 0 : 6.95;
    const subtotal = Math.round(((order.amount - shipping) / 1.07) * 100) / 100;
    const tax = Math.round((order.amount - shipping - subtotal) * 100) / 100;
    const each = Math.round((subtotal / n) * 100) / 100;
    const names = shop.topProducts.length ? shop.topProducts.map((p) => p.name) : ['Custom item'];
    const lines = Array.from({ length: n }, (_, i) => ({
      name: names[Math.floor(r() * names.length)],
      price: i === n - 1 ? Math.round((subtotal - each * (n - 1)) * 100) / 100 : each,
    }));
    const [first, ...rest] = order.customerName.split(' ');
    const email = `${first.toLowerCase()}${rest.length ? '.' + rest.join('').toLowerCase() : ''}@example.com`;
    const city = CITIES[hash(order.customerName) % CITIES.length];
    return { lines, subtotal, shipping, tax, email, city };
  }, [order, shop.topProducts]);

  const card = 'rounded-2xl border border-[#e3e3e3] p-4 mt-3';
  return (
    <div>
      <div className="flex items-center gap-1 -ml-2">
        <button onClick={onBack} className="p-2 text-[#1a1a1a] active:opacity-60" aria-label="Back">
          <ChevronLeft className="w-7 h-7" strokeWidth={1.8} />
        </button>
        <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">{order.orderNumber}</h1>
      </div>
      <div className="mt-1">
        <OrderBadges o={order} />
        <div className="text-[14px] text-[#616161] mt-2">
          Placed {order.dateAgo} from Online Store
        </div>
      </div>

      <div className={card}>
        <div className="text-[15px] font-semibold text-[#1a1a1a] mb-2">Items</div>
        <div className="divide-y divide-[#ebebeb]">
          {data.lines.map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 gap-3">
              <div className="text-[15px] text-[#303030]">
                {l.name} <span className="text-[#8a8a8a]">× 1</span>
              </div>
              <div className="text-[15px] text-[#1a1a1a] tabular-nums">
                {cur}
                {money(l.price)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <div className="text-[15px] font-semibold text-[#1a1a1a] mb-2">Payment</div>
        {[
          ['Subtotal', data.subtotal],
          ['Shipping', data.shipping],
          ['Taxes', data.tax],
        ].map(([label, v]) => (
          <div key={label as string} className="flex justify-between text-[15px] text-[#616161] py-1 tabular-nums">
            <span>{label}</span>
            <span>
              {v === 0 ? 'Free' : `${cur}${money(v as number)}`}
            </span>
          </div>
        ))}
        <div className="flex justify-between text-[16px] font-semibold text-[#1a1a1a] pt-2 mt-1 border-t border-[#ebebeb] tabular-nums">
          <span>Total</span>
          <span>
            {cur}
            {money(order.amount)}
          </span>
        </div>
      </div>

      <div className={card}>
        <div className="text-[15px] font-semibold text-[#1a1a1a] mb-2">Customer</div>
        <div className="text-[15px] text-[#303030]">{order.customerName}</div>
        <div className="text-[14px] text-[#2c6ecb] mt-0.5">{data.email}</div>
        <div className="text-[14px] text-[#616161] mt-0.5">{data.city}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ products */
export const ProductsScreen: React.FC<{ shop: ShopifyData }> = ({ shop }) => (
  <div>
    <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight">Products</h1>
    <div className="mt-2 divide-y divide-[#ebebeb]">
      {shop.topProducts.length === 0 && <div className="py-6 text-[15px] text-[#616161]">No products yet.</div>}
      {shop.topProducts.map((p) => {
        const stock = 12 + (hash(p.id) % 140);
        return (
          <div key={p.id} className="flex items-center gap-3 py-3.5">
            <div className="w-14 h-14 rounded-xl bg-[#f1f1f1] overflow-hidden border border-[#e3e3e3] shrink-0">
              <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-medium text-[#1a1a1a] truncate">{p.name}</div>
              <div className="text-[13px] text-[#616161] mt-0.5">{stock} in stock</div>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 rounded-md text-[12px] font-medium bg-[#cdfee1] text-[#0c5132]">Active</span>
              </div>
            </div>
            <div className="text-[16px] font-semibold text-[#1a1a1a] tabular-nums">
              {shop.currency}
              {money(p.price)}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------ search */
export const SearchScreen: React.FC<{ shop: ShopifyData; orders: ShopifyOrder[]; onOpenOrder: (o: ShopifyOrder) => void }> = ({ shop, orders, onOpenOrder }) => {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const matchedOrders = term ? orders.filter((o) => o.orderNumber.toLowerCase().includes(term) || o.customerName.toLowerCase().includes(term)).slice(0, 6) : [];
  const matchedProducts = term ? shop.topProducts.filter((p) => p.name.toLowerCase().includes(term)) : [];

  return (
    <div>
      <div className="h-11 rounded-xl bg-[#f1f1f1] flex items-center gap-2 px-3.5">
        <Search className="w-5 h-5 text-[#616161]" strokeWidth={1.8} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search orders, products, customers"
          className="flex-1 bg-transparent outline-none text-[16px] text-[#1a1a1a] placeholder:text-[#8a8a8a]"
        />
      </div>

      {!term && (
        <>
          <div className="text-[15px] font-semibold text-[#1a1a1a] mt-6 mb-2">Recent searches</div>
          <div className="flex flex-wrap gap-2">
            {[...shop.topProducts.map((p) => p.name), 'Unfulfilled orders', 'Discounts'].map((s) => (
              <button key={s} onClick={() => setQ(s)} className="h-9 px-3.5 rounded-xl bg-[#f1f1f1] text-[15px] text-[#303030]">
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {term && matchedOrders.length === 0 && matchedProducts.length === 0 && (
        <div className="text-[15px] text-[#616161] mt-8 text-center">No results for “{q}”</div>
      )}

      {matchedOrders.length > 0 && (
        <>
          <div className="text-[15px] font-semibold text-[#1a1a1a] mt-6">Orders</div>
          <div className="divide-y divide-[#ebebeb]">
            {matchedOrders.map((o) => (
              <OrderRow key={o.id} o={o} cur={shop.currency} onOpen={onOpenOrder} />
            ))}
          </div>
        </>
      )}
      {matchedProducts.length > 0 && (
        <>
          <div className="text-[15px] font-semibold text-[#1a1a1a] mt-6 mb-1">Products</div>
          {matchedProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover border border-[#e3e3e3]" />
              <span className="text-[15px] text-[#1a1a1a]">{p.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ menu */
export const MenuScreen: React.FC<{ shop: ShopifyData }> = ({ shop }) => {
  const items = [
    { label: 'Customers', Icon: Users },
    { label: 'Marketing', Icon: Megaphone },
    { label: 'Discounts', Icon: Percent },
    { label: 'Analytics', Icon: BarChart3 },
    { label: 'Finances', Icon: Landmark },
    { label: 'Apps', Icon: LayoutGrid },
    { label: 'Settings', Icon: Settings },
  ];
  return (
    <div>
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#f4f4f4]">
        <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] text-white flex items-center justify-center">
          <Store className="w-5 h-5" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[17px] font-semibold text-[#1a1a1a] truncate">{shop.storeName}</div>
          <div className="text-[13px] text-[#616161]">Online Store</div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#8a8a8a]" />
      </div>
      <div className="mt-3 divide-y divide-[#ebebeb]">
        {items.map(({ label, Icon }) => (
          <div key={label} className="flex items-center gap-3.5 py-4">
            <Icon className="w-[22px] h-[22px] text-[#303030]" strokeWidth={1.7} />
            <span className="flex-1 text-[16px] text-[#1a1a1a]">{label}</span>
            <ChevronRight className="w-5 h-5 text-[#b5b5b5]" />
          </div>
        ))}
      </div>
    </div>
  );
};
