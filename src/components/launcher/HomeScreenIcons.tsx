import React, { useState } from 'react';
import { Download, Copy, Check, Smartphone, ChevronDown } from 'lucide-react';
import { PlatformType } from '../../types';
import { PLATFORM_LOGOS } from '../../config/platformLogos';
import { getPathForPlatform } from '../../context/AppContext';

type IconKey = 'youtube' | 'shopify' | 'crypto' | 'bank';

/** Downloadable full-bleed 1024px PNGs live in /public/icons/ (iOS adds the rounded mask itself). */
const ICONS: { id: IconKey; file: string; download: string }[] = [
  { id: 'youtube', file: '/icons/youtube.png', download: 'youtube-studio-icon.png' },
  { id: 'shopify', file: '/icons/shopify.png', download: 'shopify-icon.png' },
  { id: 'crypto', file: '/icons/ledger.png', download: 'ledger-icon.png' },
  { id: 'bank', file: '/icons/bank.png', download: 'bank-icon.png' },
];

const STEPS = [
  'Tap Download on an icon below. It saves to the Files app (Downloads). Or press and hold the icon and choose Add to Photos.',
  'Tap Copy link on the same card to copy that screen\'s web address.',
  'Open the Shortcuts app, tap + (top right) to create a new shortcut, then tap Add Action.',
  'Search for "Open URLs", select it, then paste the link into the URL field.',
  'Tap the Share button (or the shortcut name at the top) and choose Add to Home Screen.',
  'Under Home Screen Name and Icon, tap the small icon, choose Choose File (or Choose Photo), and pick the icon you downloaded.',
  'Type the name you want under the icon, tap Add, and it lands on your Home Screen.',
];

export const HomeScreenIcons: React.FC = () => {
  const [copied, setCopied] = useState<IconKey | null>(null);
  const [open, setOpen] = useState(false);

  const copyLink = async (id: IconKey) => {
    const url = `${window.location.origin}${getPathForPlatform(id as PlatformType)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
  };

  return (
    <div className="rounded-[22px] bg-[#121214] border border-white/[0.08] p-4 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          Home Screen Icons
        </span>
        <span className="text-[10px] text-[#636366]">PNG • 1024×1024</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ICONS.map(({ id, file, download }) => {
          const cfg = PLATFORM_LOGOS[id];
          return (
            <div key={id} className="rounded-2xl bg-white/[0.04] border border-white/5 p-3 flex flex-col items-center gap-2.5">
              <img
                src={file}
                alt={`${cfg.name} icon`}
                className="w-16 h-16 rounded-[22%] shadow-lg"
              />
              <span className="text-xs font-semibold text-white text-center leading-tight">{cfg.name}</span>
              <div className="flex w-full gap-1.5">
                <a
                  href={file}
                  download={download}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold active:scale-95 transition"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
                <button
                  onClick={() => copyLink(id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-semibold active:scale-95 transition"
                >
                  {copied === id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied === id ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs font-semibold text-white"
      >
        <span>How to add it to your iPhone</span>
        <ChevronDown className={`w-4 h-4 text-[#86868b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="space-y-3">
          <ol className="space-y-2.5">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-[#d1d1d6] leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-bold text-[10px] flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-[#86868b] leading-relaxed">
            Tip: a Shortcuts launcher opens the page in Safari, so the address bar can show. Scroll slightly to collapse it,
            or use Safari's Share → Add to Home Screen for the full-screen app version (that one uses the default app icon).
          </p>
        </div>
      )}
    </div>
  );
};
