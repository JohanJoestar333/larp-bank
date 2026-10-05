import React from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { SlidersHorizontal, Film, Lock, BellRing, ChevronRight } from 'lucide-react';
import { PlatformCardLogo, PLATFORM_LOGOS } from '../../config/platformLogos';
import { HomeScreenIcons } from './HomeScreenIcons';

const SF_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, system-ui, sans-serif';

// iOS grouped-list building blocks
const GROUP = 'rounded-xl bg-[#1c1c1e] overflow-hidden';
const ROW =
  'relative flex items-center gap-3 px-4 py-3 text-left w-full active:bg-white/5 transition after:absolute after:bottom-0 after:right-0 after:h-px after:bg-white/[0.08] last:after:hidden';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="px-4 pb-1.5 text-[13px] uppercase text-[#8e8e93]">{children}</h2>
);

export const PlatformLauncher: React.FC = () => {
  const {
    setCurrentPlatform,
    phases,
    activePhaseId,
    switchPhase,
    appMode,
    toggleAppMode,
    setIsControlCenterOpen,
    setIsLockScreenVisible,
    triggerNotification,
    activePhase,
  } = useApp();

  const platformKeys = ['youtube', 'shopify', 'crypto', 'bank'] as const;

  const platforms = platformKeys.map((id) => {
    const config = PLATFORM_LOGOS[id];
    let badge = '';
    let statSnippet = '';

    if (id === 'youtube') {
      badge = `${(activePhase.youtube.views / 1000).toFixed(0)}k views`;
      statSnippet = `${activePhase.youtube.subscribers.toLocaleString()} subs • ${activePhase.youtube.currency}${activePhase.youtube.estimatedRevenue.toLocaleString()} est.`;
    } else if (id === 'shopify') {
      badge = `${activePhase.shopify.currency}${activePhase.shopify.totalSales.toLocaleString()}`;
      statSnippet = `${activePhase.shopify.ordersCount} orders • Conv ${activePhase.shopify.conversionRate}%`;
    } else if (id === 'crypto') {
      badge = `+${activePhase.crypto.change24hPercent}%`;
      statSnippet = `${activePhase.crypto.currency}${activePhase.crypto.totalValue.toLocaleString()} • ${activePhase.crypto.assets.length} assets`;
    } else if (id === 'bank') {
      badge = `$${(activePhase.bank.totalBalance / 1000).toFixed(1)}k`;
      statSnippet = `Checking $${(activePhase.bank.checkingBalance / 1000).toFixed(1)}k • Yield 5.15%`;
    }

    return {
      id,
      name: config.name,
      sublabel: config.sublabel,
      badge,
      statSnippet,
    };
  });

  const triggers = [
    {
      label: 'Simulate Order Ping',
      icon: BellRing,
      bg: 'bg-[#30d158]',
      run: () =>
        triggerNotification({
          id: `notif-${Date.now()}`,
          platform: 'shopify',
          title: 'New order received',
          message: `${activePhase.shopify.recentOrders[0]?.customerName || 'Elena Vance'} placed order #${Math.floor(1000 + Math.random() * 9000)}`,
          amount: `+$185.00`,
          timestamp: 'now',
        }),
    },
    {
      label: 'Simulate Deposit Wire',
      icon: BellRing,
      bg: 'bg-[#ff9f0a]',
      run: () =>
        triggerNotification({
          id: `notif-${Date.now()}`,
          platform: 'bank',
          title: 'Wire Deposit Cleared',
          message: `Wire transfer of $14,200.00 from Stripe Payments has settled.`,
          amount: `+$14,200`,
          timestamp: 'now',
        }),
    },
    {
      label: 'Simulate Viral Spike',
      icon: BellRing,
      bg: 'bg-[#ff453a]',
      run: () =>
        triggerNotification({
          id: `notif-${Date.now()}`,
          platform: 'youtube',
          title: 'Trending Milestone',
          message: 'Your video just passed 50,000 views in the first 24 hours!',
          amount: '+50k',
          timestamp: 'now',
        }),
    },
    {
      label: 'Preview Lock Screen',
      icon: Lock,
      bg: 'bg-[#0a84ff]',
      run: () => setIsLockScreenVisible(true),
    },
  ];

  return (
    <div
      className="flex flex-col min-h-full bg-black text-white select-none pb-24"
      style={{ fontFamily: SF_FONT }}
    >
      <header className="px-5 pt-[max(env(safe-area-inset-top),14px)] pb-2 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between h-8">
          <div className="min-w-0">
            <PWAInstallButton compact />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAppMode}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-[14px] font-medium transition active:opacity-70 ${
                appMode === 'film' ? 'bg-[#1c1c1e] text-white' : 'bg-[#0a84ff] text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">{appMode === 'film' ? 'Film Mode' : 'Edit Mode'}</span>
            </button>
            <button
              onClick={() => setIsControlCenterOpen(true)}
              aria-label="Open Control Center"
              className="w-8 h-8 rounded-full bg-[#1c1c1e] flex items-center justify-center text-white transition active:opacity-70"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h1 className="mt-3 text-[34px] leading-[41px] font-bold tracking-tight">PropStudio</h1>
      </header>

      <main className="flex-1 px-5 pt-4 space-y-7 max-w-lg mx-auto w-full">
        {/* Phase */}
        <section>
          <SectionTitle>Phase</SectionTitle>
          <div className={GROUP}>
            <button onClick={() => setIsControlCenterOpen(true)} className={`${ROW} after:left-4`}>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold truncate">{activePhase.name}</p>
                <p className="text-[14px] text-[#8e8e93] line-clamp-2">{activePhase.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#48484a] shrink-0" strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-3 pt-1">
              {phases.map((s) => (
                <button
                  key={s.id}
                  onClick={() => switchPhase(s.id)}
                  className={`h-8 px-3.5 rounded-full text-[14px] font-medium whitespace-nowrap transition active:opacity-70 ${
                    s.id === activePhaseId ? 'bg-[#0a84ff] text-white' : 'bg-[#2c2c2e] text-[#ebebf5]/60'
                  }`}
                >
                  {s.name.split(':')[0]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section>
          <SectionTitle>Platforms</SectionTitle>
          <div className={GROUP}>
            {platforms.map((plat) => (
              <button key={plat.id} onClick={() => setCurrentPlatform(plat.id)} className={`${ROW} after:left-[76px]`}>
                <div className="shrink-0 [&>div]:rounded-[11px] [&>div]:shadow-none">
                  <PlatformCardLogo platform={plat.id} size="md" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold truncate">{plat.name}</p>
                  <p className="text-[14px] text-[#8e8e93] truncate tabular-nums">{plat.statSnippet}</p>
                </div>
                <span className="text-[15px] text-[#8e8e93] tabular-nums shrink-0">{plat.badge}</span>
                <ChevronRight className="w-4 h-4 text-[#48484a] shrink-0 -ml-1" strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </section>

        {/* Downloadable icons + how-to */}
        <HomeScreenIcons />

        {/* Triggers */}
        <section>
          <SectionTitle>Quick Triggers</SectionTitle>
          <div className={GROUP}>
            {triggers.map((t) => (
              <button key={t.label} onClick={t.run} className={`${ROW} after:left-[60px]`}>
                <span className={`w-[30px] h-[30px] rounded-[7px] flex items-center justify-center shrink-0 ${t.bg}`}>
                  <t.icon className="w-4 h-4 text-white" />
                </span>
                <span className="text-[16px] flex-1 truncate">{t.label}</span>
                <ChevronRight className="w-4 h-4 text-[#48484a] shrink-0" strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </section>

        <p className="px-6 pb-2 text-center text-[13px] leading-snug text-[#8e8e93]">
          Fictional prop and entertainment simulation only. No real bank, crypto, or platform connections.
        </p>
      </main>
    </div>
  );
};
