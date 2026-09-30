import React from 'react';
import { useApp } from '../../context/AppContext';
import { Youtube, ShoppingBag, Shield, Landmark, X } from 'lucide-react';

export const IOSNotificationBanner: React.FC = () => {
  const { activeNotification, setActiveNotification, setCurrentPlatform } = useApp();

  if (!activeNotification) return null;

  const getPlatformIcon = () => {
    switch (activeNotification.platform) {
      case 'youtube':
        return (
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
            <Youtube className="w-4 h-4 fill-white" />
          </div>
        );
      case 'shopify':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case 'crypto':
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-md">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
        );
      case 'bank':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
            <Landmark className="w-4 h-4" />
          </div>
        );
    }
  };

  const getPlatformName = () => {
    switch (activeNotification.platform) {
      case 'youtube':
        return 'YouTube Studio';
      case 'shopify':
        return 'Shopify';
      case 'crypto':
        return 'Ledger Live';
      case 'bank':
        return 'Aura Private Reserve';
    }
  };

  return (
    <div className="fixed top-2 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        onClick={() => {
          setCurrentPlatform(activeNotification.platform);
          setActiveNotification(null);
        }}
        className="w-full rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/15 p-3.5 shadow-2xl text-slate-100 cursor-pointer hover:bg-slate-900/95 transition active:scale-[0.99] select-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {getPlatformIcon()}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white/90">
                  {getPlatformName()}
                </span>
                <span className="text-[10px] text-white/50">{activeNotification.timestamp || 'now'}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                {activeNotification.title}
              </h4>
              <p className="text-xs text-white/80 mt-0.5 line-clamp-2">
                {activeNotification.message}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {activeNotification.amount && (
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {activeNotification.amount}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveNotification(null);
              }}
              className="p-1 text-white/40 hover:text-white rounded-full transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
