import React from 'react';
import { useOnlineStatus } from './usePWAInstall';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center justify-between gap-3 rounded-2xl bg-amber-950/90 border border-amber-600/40 backdrop-blur-md px-4 py-2.5 text-xs text-amber-200 shadow-2xl animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>Offline Prop Mode active • Cached scenario data in use</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
    </div>
  );
};
