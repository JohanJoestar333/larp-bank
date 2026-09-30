import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Flashlight, Camera, Lock, ArrowUp, X, ShoppingBag, Youtube, Landmark, Shield } from 'lucide-react';

export const IOSLockScreenOverlay: React.FC = () => {
  const { isLockScreenVisible, setIsLockScreenVisible, activePhase, setCurrentPlatform } = useApp();
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isLockScreenVisible) return null;

  const todayDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const sampleNotifications: Array<{
    id: string;
    platform: 'youtube' | 'shopify' | 'crypto' | 'bank';
    name: string;
    title: string;
    message: string;
    amount: string;
    time: string;
  }> = [
    {
      id: 'n1',
      platform: 'shopify',
      name: 'Shopify',
      title: 'New order received',
      message: `${activePhase.shopify.recentOrders[0]?.customerName || 'Customer'} placed order ${activePhase.shopify.recentOrders[0]?.orderNumber || '#1026'}`,
      amount: `+${activePhase.shopify.currency}${activePhase.shopify.recentOrders[0]?.amount || 151}`,
      time: '3m ago',
    },
    {
      id: 'n2',
      platform: 'bank',
      name: 'Aura Private Reserve',
      title: 'Direct Deposit Confirmed',
      message: `Wire transfer of ${activePhase.bank.transactions[0]?.name || 'Payout'} has cleared`,
      amount: `+${activePhase.shopify.currency}${activePhase.bank.transactions[0]?.amount?.toLocaleString() || '18,450'}`,
      time: '12m ago',
    },
    {
      id: 'n3',
      platform: 'crypto',
      name: 'Ledger Live',
      title: 'Inbound Transaction Confirmed',
      message: `Received ${activePhase.crypto.transactions[0]?.amount || 0.12} ${activePhase.crypto.transactions[0]?.assetSymbol || 'BTC'} to vault`,
      amount: `+${activePhase.crypto.currency}${activePhase.crypto.transactions[0]?.fiatValue?.toLocaleString() || '10,620'}`,
      time: '28m ago',
    },
    {
      id: 'n4',
      platform: 'youtube',
      name: 'YouTube Studio',
      title: 'Trending Video Alert',
      message: `"${activePhase.youtube.topVideos[0]?.title?.slice(0, 38) || 'Video'}..." is performing above average`,
      amount: `+${(activePhase.youtube.views / 1000).toFixed(1)}k views`,
      time: '45m ago',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl text-white p-6 select-none animate-in fade-in duration-200">
      {/* Top Lock & Dismiss */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsLockScreenVisible(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 transition"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Lock</span>
        </button>

        <div className="flex items-center justify-center">
          <Lock className="w-5 h-5 text-white/80" />
        </div>

        <div className="w-20" />
      </div>

      {/* Date & Time */}
      <div className="text-center mt-2">
        <p className="text-base font-medium text-white/70 tracking-wide">
          {todayDateStr}
        </p>
        <h1 className="text-7xl font-extrabold tracking-tighter text-white/95 mt-1 font-sans">
          {currentTime}
        </h1>
      </div>

      {/* Notifications Stack */}
      <div className="max-w-md mx-auto w-full space-y-2.5 my-auto">
        <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest px-1">
          Notification Center
        </div>

        {sampleNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              setCurrentPlatform(notif.platform);
              setIsLockScreenVisible(false);
            }}
            className="w-full rounded-[22px] bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/10 p-3.5 shadow-lg transition active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                  notif.platform === 'shopify' ? 'bg-[#008060]' :
                  notif.platform === 'bank' ? 'bg-[#1c1c1e] border border-white/20' :
                  notif.platform === 'youtube' ? 'bg-[#ff0000]' : 'bg-slate-800'
                }`}>
                  {notif.platform === 'shopify' && <ShoppingBag className="w-3.5 h-3.5" />}
                  {notif.platform === 'bank' && <Landmark className="w-3.5 h-3.5" />}
                  {notif.platform === 'youtube' && <Youtube className="w-3.5 h-3.5" />}
                  {notif.platform === 'crypto' && <Shield className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold text-white/80">{notif.name}</span>
                <span className="text-[10px] text-white/40">• {notif.time}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {notif.amount}
              </span>
            </div>
            <div className="mt-2 text-left pl-8">
              <h4 className="text-sm font-semibold text-white">{notif.title}</h4>
              <p className="text-xs text-white/70 line-clamp-1 mt-0.5">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Flashlight, Camera & Unlock Bar */}
      <div className="space-y-6 pb-2">
        <div className="flex items-center justify-between max-w-sm mx-auto px-4">
          <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white/25 active:scale-95 transition">
            <Flashlight className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white/25 active:scale-95 transition">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setIsLockScreenVisible(false)}
          className="w-full flex flex-col items-center justify-center gap-1 text-white/50 hover:text-white transition group py-2"
        >
          <div className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold">
            <span>Swipe up to open</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
          </div>
          <div className="w-36 h-1 rounded-full bg-white/40 mt-1" />
        </button>
      </div>
    </div>
  );
};
