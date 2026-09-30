import React from 'react';
import { CryptoAsset } from '../../../types';

export const FONT = '[font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif]';

export const money = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Ledger Live bracket-L mark */
export const LedgerMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.9" strokeLinecap="square">
    <path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" />
    <path d="M9.5 8v8h5" />
  </svg>
);

/** Round coin badges (BTC / ETH / SOL, generic fallback uses the asset colour) */
export const CoinIcon: React.FC<{ asset: Pick<CryptoAsset, 'symbol' | 'color'>; className?: string }> = ({
  asset,
  className = 'w-10 h-10',
}) => {
  const sym = asset.symbol.toUpperCase();
  if (sym === 'BTC') {
    return (
      <div className={`${className} rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold shrink-0 leading-none text-[1.35em]`}>
        ₿
      </div>
    );
  }
  if (sym === 'ETH') {
    return (
      <svg viewBox="0 0 40 40" className={`${className} shrink-0`}>
        <circle cx="20" cy="20" r="20" fill="#627EEA" />
        <path d="M20 7.5 12.6 20.2 20 24.5 27.4 20.2Z" fill="#fff" />
        <path d="M20 26 12.6 21.7 20 32.5 27.4 21.7Z" fill="#fff" opacity=".8" />
      </svg>
    );
  }
  if (sym === 'SOL') {
    return (
      <svg viewBox="0 0 40 40" className={`${className} shrink-0`}>
        <defs>
          <linearGradient id="solGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#9945FF" />
            <stop offset="1" stopColor="#19FB9B" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="#000" stroke="#2a2a2a" />
        <g fill="url(#solGrad)">
          <path d="M14 13h15.5l-3 3.6H11z" />
          <path d="M11 18.2h15.5l3 3.6H14z" />
          <path d="M14 23.4h15.5l-3 3.6H11z" />
        </g>
      </svg>
    );
  }
  return (
    <div
      className={`${className} rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0`}
      style={{ backgroundColor: asset.color }}
    >
      {sym.slice(0, 4)}
    </div>
  );
};
