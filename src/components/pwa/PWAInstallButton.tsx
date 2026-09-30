import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone on home screen, hide
  if (isInstalled) {
    return null;
  }

  // Desktop Chrome / Android native prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
        }`}
      >
        <Download className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>Install PWA</span>
      </button>
    );
  }

  // iOS Safari instruction modal
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 font-medium text-slate-200 hover:bg-slate-700/80 active:scale-95 transition-all ${
            compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
          }`}
        >
          <Share2 className={compact ? 'w-3.5 h-3.5 text-blue-400' : 'w-4 h-4 text-blue-400'} />
          <span>Add to iPhone Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Install on iPhone</h3>
                  <p className="text-xs text-slate-400">Run fullscreen like a native app</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> icon in the bottom Safari toolbar.</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Scroll down and select</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-white bg-slate-700 px-2 py-0.5 rounded">
                      <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Launch from Home Screen for authentic borderless prop filming!</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium text-sm text-slate-200 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for standard browsers
  return null;
};
