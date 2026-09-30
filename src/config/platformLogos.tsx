import React from 'react';
import { Youtube, ShoppingBag, Shield, Landmark } from 'lucide-react';
import { PlatformType } from '../types';

/**
 * ==============================================================================
 * APP LOGOS & BRAND ICONS CONFIGURATION FILE
 * Location: /src/config/platformLogos.tsx
 * ==============================================================================
 * 
 * You can customize the logos for all platforms here without needing any environment variables!
 * 
 * CHANGING LOGOS:
 * 1. For HOMEPAGE CARDS:
 *    Update `logoUrl` for each platform below.
 *    - You can use local files in `/public/logos/` (e.g. '/logos/youtube.svg', '/logos/shopify.svg')
 *    - You can put any image in `/public/` (e.g. '/my-custom-logo.png')
 *    - You can paste any image URL from the web (e.g. 'https://example.com/logo.png')
 *    - You can paste base64 data URLs
 * 
 * 2. For TOP HEADER BARS:
 *    Update `headerLogoUrl` for each platform below.
 *    - If left empty `""`, it will use `logoUrl` or the default sleek vector mark.
 * 
 * 3. READY-MADE LOCAL LOGO FILES (in /public/logos/):
 *    - /public/logos/youtube.svg
 *    - /public/logos/shopify.svg
 *    - /public/logos/ledger.svg
 *    - /public/logos/bank.svg
 *    You can also simply replace or overwrite those files in /public/logos/ directly!
 */

export interface PlatformBrandConfig {
  /** Full brand name (e.g., 'YouTube Studio') */
  name: string;
  /** Short brand name used in compact headers */
  shortName: string;
  /** Sub-headline displayed on the launcher card */
  sublabel: string;
  /**
   * Logo image path/URL for the Homepage launcher card.
   * Examples:
   *  - '/logos/youtube.svg' (local public file)
   *  - '/my-custom-icon.png' (local file placed in /public/)
   *  - 'https://upload.wikimedia.org/wikipedia/commons/...png' (web URL)
   *  - '' (leave empty to use default SVG mark)
   */
  logoUrl?: string;
  /**
   * Optional custom logo for the top navigation bar of the dashboard page.
   * If omitted or empty, will use `logoUrl` or default vector badge.
   */
  headerLogoUrl?: string;
  /** Brand primary accent color */
  accentColor: string;
  /** Tailwind classes for the homepage card icon background */
  cardBgClass: string;
}

export const PLATFORM_LOGOS: Record<'youtube' | 'shopify' | 'crypto' | 'bank', PlatformBrandConfig> = {
  // ---------------------------------------------------------------------------
  // 1. YOUTUBE STUDIO
  // ---------------------------------------------------------------------------
  youtube: {
    name: 'YouTube Studio',
    shortName: 'Studio',
    sublabel: 'Creator Analytics',
    // Default points to /logos/youtube.svg. Change to any file or URL:
    logoUrl: '/logos/youtube.svg',
    // Top header bar logo:
    headerLogoUrl: '',
    accentColor: '#ff0000',
    cardBgClass: 'bg-[#ff0000]',
  },

  // ---------------------------------------------------------------------------
  // 2. SHOPIFY STORE
  // ---------------------------------------------------------------------------
  shopify: {
    name: 'Shopify Store',
    shortName: 'Shopify',
    sublabel: 'Merchant Analytics',
    // Default points to /logos/shopify.svg. Change to any file or URL:
    logoUrl: '/logos/shopify.svg',
    // Top header bar logo:
    headerLogoUrl: '',
    accentColor: '#008060',
    cardBgClass: 'bg-[#008060]',
  },

  // ---------------------------------------------------------------------------
  // 3. LEDGER CRYPTO WALLET
  // ---------------------------------------------------------------------------
  crypto: {
    name: 'Ledger Live',
    shortName: 'Ledger',
    sublabel: 'Hardware Companion',
    // Default points to /logos/ledger.svg. Change to any file or URL:
    logoUrl: '/logos/ledger.svg',
    // Top header bar logo:
    headerLogoUrl: '',
    accentColor: '#10b981',
    cardBgClass: 'bg-[#18181b] border border-white/10',
  },

  // ---------------------------------------------------------------------------
  // 4. PRIVATE BANK
  // ---------------------------------------------------------------------------
  bank: {
    name: 'Private Reserve',
    shortName: 'Reserve',
    sublabel: 'FinTech & Treasury',
    // Default points to /logos/bank.svg. Change to any file or URL:
    logoUrl: '/logos/bank.svg',
    // Top header bar logo:
    headerLogoUrl: '',
    accentColor: '#eab308',
    cardBgClass: 'bg-gradient-to-tr from-[#1c1c1e] to-[#2c2c2e] border border-white/10',
  },
};

/**
 * Reusable component to render the Platform Card Logo on the Homepage Launcher
 */
export const PlatformCardLogo: React.FC<{
  platform: 'youtube' | 'shopify' | 'crypto' | 'bank';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ platform, className = '', size = 'md' }) => {
  const config = PLATFORM_LOGOS[platform];

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  // If a custom logo image URL is configured, render the image
  if (config.logoUrl && config.logoUrl.trim().length > 0) {
    return (
      <div className={`${sizeClasses[size]} overflow-hidden flex items-center justify-center ${config.cardBgClass} ${className} shadow-md`}>
        <img
          src={config.logoUrl}
          alt={config.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Graceful fallback to vector icon if image fails to load
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Built-in vector icon fallback
  return (
    <div className={`${sizeClasses[size]} ${config.cardBgClass} flex items-center justify-center shadow-md ${className}`}>
      {platform === 'youtube' && <Youtube className={`${iconSizes[size]} text-white fill-white`} />}
      {platform === 'shopify' && <ShoppingBag className={`${iconSizes[size]} text-white`} />}
      {platform === 'crypto' && <Shield className={`${iconSizes[size]} text-emerald-400`} />}
      {platform === 'bank' && <Landmark className={`${iconSizes[size]} text-white`} />}
    </div>
  );
};

/**
 * Reusable component to render the Platform Top Bar Header Logo
 */
export const PlatformHeaderLogo: React.FC<{
  platform: 'youtube' | 'shopify' | 'crypto' | 'bank';
  className?: string;
}> = ({ platform, className = '' }) => {
  const config = PLATFORM_LOGOS[platform];
  const url = config.headerLogoUrl && config.headerLogoUrl.trim().length > 0
    ? config.headerLogoUrl
    : (config.logoUrl && config.logoUrl.trim().length > 0 ? config.logoUrl : null);

  // If an image URL is configured for header or logo, render it
  if (url) {
    return (
      <div className={`w-6 h-6 rounded-md overflow-hidden shrink-0 flex items-center justify-center shadow-sm ${className}`}>
        <img
          src={url}
          alt={config.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Authentic header vector marks
  if (platform === 'youtube') {
    return (
      <div className={`w-6 h-6 rounded-md bg-[#ff0000] flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0 ${className}`}>
        ▶
      </div>
    );
  }

  if (platform === 'shopify') {
    return (
      <div className={`w-6 h-6 rounded-md bg-[#008060] flex items-center justify-center text-white shadow-sm shrink-0 ${className}`}>
        <ShoppingBag className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }

  if (platform === 'crypto') {
    return (
      <div className={`w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 ${className}`}>
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
      </div>
    );
  }

  // Bank
  return (
    <div className={`w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white shrink-0 ${className}`}>
      <Landmark className="w-3.5 h-3.5 text-white" />
    </div>
  );
};
