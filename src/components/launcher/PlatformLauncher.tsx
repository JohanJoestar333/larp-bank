import React from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  SlidersHorizontal,
  Film,
  Lock,
  BellRing,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { PlatformType } from '../../types';
import { PlatformCardLogo, PLATFORM_LOGOS } from '../../config/platformLogos';
import { HomeScreenIcons } from './HomeScreenIcons';

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

  return (
    <div className="flex flex-col min-h-full bg-black text-[#f5f5f7] select-none pb-24">
      {/* Top Bar - Clean Apple minimalism */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] backdrop-blur-xl sticky top-0 z-30 bg-black/90">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-black text-xs text-white">
            P
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight text-white block">
              PropStudio
            </span>
            <span className="text-[10px] text-[#86868b]">Filmmaking Suite</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PWA Install */}
          <PWAInstallButton compact />

          {/* Film Mode vs Edit Mode Toggle */}
          <button
            onClick={toggleAppMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
              appMode === 'film'
                ? 'bg-white/10 text-white hover:bg-white/15'
                : 'bg-blue-600 text-white shadow-sm'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>{appMode === 'film' ? 'Film Mode' : 'Edit Mode'}</span>
          </button>

          {/* Control Center Drawer Button */}
          <button
            onClick={() => setIsControlCenterOpen(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition"
            title="Open Control Center"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-5 space-y-6 max-w-lg mx-auto w-full">
        {/* Active Phase Banner */}
        <div className="rounded-[22px] bg-[#121214] border border-white/[0.08] p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-blue-400" />
              <span>Current Phase</span>
            </span>
            <button
              onClick={() => setIsControlCenterOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
            >
              <span>Manage Phases</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            {activePhase.name}
          </h3>
          <p className="text-xs text-[#86868b] line-clamp-2 mt-0.5">
            {activePhase.description}
          </p>

          {/* Quick Phase Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 no-scrollbar text-xs">
            {phases.map((s) => (
              <button
                key={s.id}
                onClick={() => switchPhase(s.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-semibold ${
                  s.id === activePhaseId
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/[0.06] text-[#86868b] hover:bg-white/10 hover:text-white'
                }`}
              >
                {s.name.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Fictional Platform Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
              Select Fictional Platform
            </span>
            <span className="text-[10px] text-[#636366]">4 Simulated Props</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {platforms.map((plat) => (
              <div
                key={plat.id}
                onClick={() => setCurrentPlatform(plat.id)}
                className="group relative rounded-[22px] bg-[#121214] hover:bg-[#18181b] border border-white/[0.08] p-4 shadow-xl cursor-pointer transition-all active:scale-[0.98] overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <PlatformCardLogo platform={plat.id} size="md" />
                  {plat.badge && (
                    <span className="text-xs font-bold text-white/90 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full font-mono">
                      {plat.badge}
                    </span>
                  )}
                </div>

                <div className="mt-3.5">
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                    {plat.name}
                  </h4>
                  <p className="text-xs text-[#86868b] font-medium">{plat.sublabel}</p>
                  <p className="text-[11px] text-[#636366] mt-2 font-mono truncate">
                    {plat.statSnippet}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Home Screen Icons + iPhone tutorial */}
        <HomeScreenIcons />

        {/* Filmmaker Quick Notification Triggers */}
        <div className="rounded-[22px] bg-[#121214] border border-white/[0.08] p-4 shadow-xl space-y-3">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider block">
            Filmmaking Quick Triggers
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                triggerNotification({
                  id: `notif-${Date.now()}`,
                  platform: 'shopify',
                  title: 'New order received',
                  message: `${activePhase.shopify.recentOrders[0]?.customerName || 'Elena Vance'} placed order #${Math.floor(1000 + Math.random() * 9000)}`,
                  amount: `+$185.00`,
                  timestamp: 'now',
                });
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-200 transition text-left"
            >
              <BellRing className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Simulate Order Ping</span>
            </button>

            <button
              onClick={() => {
                triggerNotification({
                  id: `notif-${Date.now()}`,
                  platform: 'bank',
                  title: 'Wire Deposit Cleared',
                  message: `Wire transfer of $14,200.00 from Stripe Payments has settled.`,
                  amount: `+$14,200`,
                  timestamp: 'now',
                });
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-200 transition text-left"
            >
              <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Simulate Deposit Wire</span>
            </button>

            <button
              onClick={() => {
                triggerNotification({
                  id: `notif-${Date.now()}`,
                  platform: 'youtube',
                  title: 'Trending Milestone',
                  message: 'Your video just passed 50,000 views in the first 24 hours!',
                  amount: '+50k',
                  timestamp: 'now',
                });
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-200 transition text-left"
            >
              <BellRing className="w-4 h-4 text-red-400 shrink-0" />
              <span>Simulate Viral Spike</span>
            </button>

            <button
              onClick={() => setIsLockScreenVisible(true)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-200 transition text-left"
            >
              <Lock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Preview Lock Screen</span>
            </button>
          </div>
        </div>

        {/* Small Notice / Disclaimer */}
        <div className="text-center py-2">
          <p className="text-[11px] text-[#636366]">
            Fictional Prop & Entertainment Simulation Only • No Real Bank, Crypto, or Platform Connections
          </p>
        </div>
      </main>
    </div>
  );
};
