import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { PlatformType } from '../../types';
import { PLATFORM_LOGOS } from '../../config/platformLogos';
import { getPathForPlatform } from '../../context/AppContext';

type IconKey = 'youtube' | 'shopify' | 'crypto' | 'bank';

/** Full-bleed 1024x1024 PNGs in /public/icons/ (iOS adds the rounded mask itself). */
const ICONS: { id: IconKey; file: string; download: string }[] = [
  { id: 'youtube', file: '/icons/youtube.png', download: 'youtube-studio-icon.png' },
  { id: 'shopify', file: '/icons/shopify.png', download: 'shopify-icon.png' },
  { id: 'crypto', file: '/icons/ledger.png', download: 'ledger-icon.png' },
  { id: 'bank', file: '/icons/bank.png', download: 'bank-icon.png' },
];

const STEPS = [
  'Tap Download on an icon. It saves to Files, or press and hold the icon to add it to Photos.',
  'Tap Copy Link on the same row.',
  'Open Shortcuts, tap +, then Add Action.',
  'Search for "Open URLs", select it, and paste the link.',
  'Tap Share (or the shortcut name) and choose Add to Home Screen.',
  'Tap the small icon, choose Choose File or Choose Photo, and pick the icon you downloaded.',
  'Name it, tap Add, and it appears on your Home Screen.',
];

/** PNG files start with the bytes 89 50 4E 47. An HTML page never does. */
const isPng = (b: Uint8Array) => b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;

const ROW =
  'relative flex items-center gap-3 px-4 py-3 after:absolute after:bottom-0 after:right-0 after:left-[84px] after:h-px after:bg-white/[0.08] last:after:hidden';

export const HomeScreenIcons: React.FC = () => {
  const [copied, setCopied] = useState<IconKey | null>(null);
  const [failed, setFailed] = useState(false);
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

  /**
   * Fetch + verify instead of a plain <a download>: a service worker or SPA rewrite can answer a
   * plain link with index.html, which would then be saved as "icon.png" (HTML in disguise).
   */
  const downloadIcon = async (file: string, filename: string) => {
    setFailed(false);
    try {
      const res = await fetch(file);
      const buffer = await res.arrayBuffer();
      if (!res.ok || !isPng(new Uint8Array(buffer))) throw new Error(`Not a PNG (status ${res.status})`);
      const url = URL.createObjectURL(new Blob([buffer], { type: 'image/png' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch (err) {
      console.error('Icon download failed:', err);
      setFailed(true);
    }
  };

  return (
    <section>
      <h2 className="px-4 pb-1.5 text-[13px] uppercase text-[#8e8e93]">Home Screen Icons</h2>

      <div className="rounded-xl bg-[#1c1c1e] overflow-hidden">
        {ICONS.map(({ id, file, download }) => (
          <div key={id} className={ROW}>
            <img
              src={file}
              alt=""
              width={56}
              height={56}
              className="w-14 h-14 shrink-0 rounded-[22.37%]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold text-white truncate">{PLATFORM_LOGOS[id].name}</p>
              <button
                type="button"
                onClick={() => copyLink(id)}
                className="mt-0.5 py-1 flex items-center gap-1 text-[14px] text-[#0a84ff] active:opacity-60 transition"
              >
                {copied === id && <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />}
                <span className="whitespace-nowrap">{copied === id ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => downloadIcon(file, download)}
              className="shrink-0 h-8 px-4 rounded-full bg-[#0a84ff]/15 text-[#0a84ff] text-[14px] font-semibold whitespace-nowrap active:opacity-60 transition"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      <p className={`px-4 pt-1.5 text-[13px] leading-snug ${failed ? 'text-[#ff453a]' : 'text-[#8e8e93]'}`}>
        {failed
          ? "Couldn't download. Press and hold an icon, then tap Add to Photos."
          : 'PNG, 1024 × 1024. Press and hold an icon to add it to Photos.'}
      </p>

      <div className="mt-4 rounded-xl bg-[#1c1c1e] overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-[16px] text-white active:bg-white/5 transition"
        >
          <span>Add to Your Home Screen</span>
          <ChevronDown className={`w-4 h-4 text-[#8e8e93] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <ol className="px-4 pb-4 pt-1 space-y-2.5 border-t border-white/[0.08]">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-3 pt-2.5 text-[14px] leading-snug text-[#ebebf5]/70">
                <span className="w-5 shrink-0 text-[#8e8e93] tabular-nums">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};
