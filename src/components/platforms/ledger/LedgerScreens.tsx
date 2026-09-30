import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Send, ArrowDownLeft, ArrowUpRight, ArrowDown, Check } from 'lucide-react';
import { CryptoAsset, CryptoData } from '../../../types';
import { hash, makeRng } from '../../../lib/seed';
import { CountUp } from '../../common/CountUp';
import { CoinIcon, money } from './shared';

const GREEN = '#4ade80';
const RED = '#f87171';
const card = 'rounded-2xl bg-[#0d0d0d] border border-[#262626]';

/* ---------------------------------------------------------------- price series */
export const PERIODS = ['1H', '1D', '1W', '1M', '1Y', 'All'] as const;
export type Period = (typeof PERIODS)[number];
const FACTOR: Record<Period, number> = { '1H': 0.15, '1D': 1, '1W': 2.4, '1M': 5.5, '1Y': 28, All: 90 };

/** Deterministic fake price history that always ends at `price`. Longer periods trend up. */
export function priceSeries(symbol: string, price: number, change24: number, period: Period, n = 64): number[] {
  const r = makeRng(hash(symbol + period));
  const base = Math.max(Math.abs(change24), 0.8);
  const pct = period === '1H' ? change24 * 0.15 : period === '1D' ? change24 : base * FACTOR[period];
  const start = price / (1 + pct / 100);
  const amp = price * (0.01 + (Math.min(Math.abs(pct), 60) / 100) * 0.12);
  const raw = Array.from({ length: n + 6 }, () => r() * 2 - 1);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let sm = 0;
    for (let k = 0; k < 7; k++) sm += raw[i + k];
    sm /= 7;
    out.push(start + (price - start) * t + sm * amp * Math.sin(Math.PI * t) * 2);
  }
  out[n - 1] = price;
  return out;
}

const fmtPrice = (p: number) => (p < 1 ? p.toFixed(4) : money(p));

/* ---------------------------------------------------------------- asset detail */
export const LedgerAssetDetail: React.FC<{
  asset: CryptoAsset;
  cry: CryptoData;
  refreshKey: number;
  hidden: boolean;
  onBack: () => void;
  onSend: () => void;
  onReceive: () => void;
}> = ({ asset, cry, refreshKey, hidden, onBack, onSend, onReceive }) => {
  const [period, setPeriod] = useState<Period>('1D');
  const series = useMemo(
    () => priceSeries(asset.symbol, asset.priceUsd, asset.change24hPercent, period),
    [asset.symbol, asset.priceUsd, asset.change24hPercent, period]
  );

  const W = 360;
  const H = 150;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const d = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * W;
      const y = H - 10 - ((v - min) / span) * (H - 30);
      return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const area = `${d} L ${W} ${H} L 0 ${H} Z`;

  const diff = series[series.length - 1] - series[0];
  const pct = (diff / series[0]) * 100;
  const up = diff >= 0;
  const color = asset.color || '#f59e0b';
  const gid = `ad-${asset.symbol}`;
  const ops = cry.transactions.filter((t) => t.assetSymbol === asset.symbol);

  return (
    <div className="px-5 flex-1">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="-ml-2 p-2 text-white active:opacity-60" aria-label="Back">
          <ChevronLeft className="w-7 h-7" strokeWidth={1.8} />
        </button>
        <div className="flex items-center gap-2.5">
          <CoinIcon asset={asset} className="w-7 h-7" />
          <span className="text-[17px] font-semibold">{asset.name}</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="mt-4">
        <div className="text-[15px] text-[#9a9a9e]">{asset.symbol} price</div>
        <div className="text-[36px] leading-[1.15] font-bold tracking-tight tabular-nums mt-0.5">
          <CountUp value={asset.priceUsd} decimals={asset.priceUsd < 1 ? 4 : 2} prefix={cry.currency} replayKey={refreshKey} />
        </div>
        <div className="text-[15px] font-medium mt-1 tabular-nums" style={{ color: up ? GREEN : RED }}>
          {up ? '+' : '-'}
          {cry.currency}
          {fmtPrice(Math.abs(diff))} ({up ? '+' : ''}
          {pct.toFixed(2)}%)
        </div>
      </div>

      <div className="mt-5">
        <svg key={`${asset.symbol}-${period}-${refreshKey}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-[150px] overflow-visible">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${gid}-rv`}>
              <rect x="-4" y="-6" height={H + 12} width="0">
                <animate attributeName="width" from="0" to={W + 8} dur="0.9s" begin="0s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.22 0.61 0.36 1" />
              </rect>
            </clipPath>
          </defs>
          <g clipPath={`url(#${gid}-rv)`}>
            <path d={area} fill={`url(#${gid})`} />
            <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
        <div className="flex items-center justify-between mt-4 bg-[#0d0d0d] border border-[#262626] rounded-full p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition ${
                p === period ? 'bg-white text-black' : 'text-[#8e8e93]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className={`${card} p-4 mt-5`}>
        <div className="text-[14px] text-[#9a9a9e]">Your balance</div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-[24px] font-bold tabular-nums">
            {hidden ? '••••••' : <CountUp value={asset.valueUsd} decimals={2} prefix={cry.currency} replayKey={refreshKey} />}
          </span>
          <span className="text-[14px] text-[#8e8e93] tabular-nums">
            {asset.quantity} {asset.symbol}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <button onClick={onSend} className="h-12 rounded-xl border border-[#333] text-[16px] font-semibold flex items-center justify-center gap-2 active:bg-[#151515]">
          <Send className="w-[18px] h-[18px]" strokeWidth={1.7} /> Send
        </button>
        <button onClick={onReceive} className="h-12 rounded-xl bg-white text-black text-[16px] font-semibold flex items-center justify-center gap-2 active:bg-[#e6e6e6]">
          <ArrowDownLeft className="w-[18px] h-[18px]" strokeWidth={2} /> Receive
        </button>
      </div>

      <h2 className="text-[19px] font-semibold mt-7">Operations</h2>
      <div className="mt-3 space-y-2.5">
        {ops.length === 0 && <div className="text-[14px] text-[#8e8e93] py-4">No operations yet.</div>}
        {ops.map((tx) => (
          <div key={tx.id} className={`${card} px-4 py-3.5 flex items-center justify-between`}>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: tx.type === 'receive' ? 'rgba(74,222,128,.14)' : 'rgba(248,113,113,.14)', color: tx.type === 'receive' ? GREEN : RED }}
              >
                {tx.type === 'receive' ? <ArrowDownLeft className="w-[18px] h-[18px]" /> : <ArrowUpRight className="w-[18px] h-[18px]" />}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold">{tx.type === 'receive' ? 'Received' : 'Sent'}</div>
                <div className="text-[12px] text-[#8e8e93] truncate">
                  {tx.timestamp} · {tx.txHash}
                </div>
              </div>
            </div>
            <div className="text-right tabular-nums shrink-0 pl-2">
              <div className="text-[15px] font-semibold" style={{ color: tx.type === 'receive' ? GREEN : '#fff' }}>
                {tx.type === 'receive' ? '+' : '-'}
                {tx.amount} {tx.assetSymbol}
              </div>
              <div className="text-[12px] text-[#8e8e93]">
                {cry.currency}
                {money(tx.fiatValue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- market */
// Placeholder prices for coins you don't hold – edit freely.
const EXTRA_COINS = [
  { symbol: 'USDT', name: 'Tether', price: 1.0, chg: 0.01, color: '#26A17B' },
  { symbol: 'BNB', name: 'BNB', price: 612.4, chg: 1.2, color: '#F3BA2F' },
  { symbol: 'XRP', name: 'XRP', price: 2.35, chg: -0.8, color: '#23292F' },
  { symbol: 'ADA', name: 'Cardano', price: 0.78, chg: 2.4, color: '#0033AD' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.21, chg: -1.6, color: '#C2A633' },
  { symbol: 'AVAX', name: 'Avalanche', price: 34.2, chg: 3.1, color: '#E84142' },
  { symbol: 'LINK', name: 'Chainlink', price: 18.6, chg: 0.9, color: '#2A5ADA' },
  { symbol: 'DOT', name: 'Polkadot', price: 6.9, chg: -0.4, color: '#E6007A' },
];

const Spark: React.FC<{ symbol: string; price: number; chg: number }> = ({ symbol, price, chg }) => {
  const s = useMemo(() => priceSeries(symbol + 'spark', price, chg, '1D', 20), [symbol, price, chg]);
  const mn = Math.min(...s);
  const mx = Math.max(...s);
  const sp = mx - mn || 1;
  const d = s.map((v, i) => `${i ? 'L' : 'M'} ${(i / (s.length - 1)) * 56} ${22 - ((v - mn) / sp) * 20 - 1}`).join(' ');
  return (
    <svg viewBox="0 0 56 22" className="w-14 h-[22px] shrink-0">
      <path d={d} fill="none" stroke={chg >= 0 ? GREEN : RED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const MarketScreen: React.FC<{ cry: CryptoData; onSelect: (a: CryptoAsset) => void }> = ({ cry, onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');
  const rows = useMemo(() => {
    const owned = cry.assets.map((a) => ({ key: a.id, symbol: a.symbol, name: a.name, price: a.priceUsd, chg: a.change24hPercent, color: a.color, asset: a as CryptoAsset | undefined }));
    const extras = EXTRA_COINS.filter((c) => !cry.assets.some((a) => a.symbol === c.symbol)).map((c) => ({
      key: c.symbol, symbol: c.symbol, name: c.name, price: c.price, chg: c.chg, color: c.color, asset: undefined as CryptoAsset | undefined,
    }));
    return [...owned, ...extras];
  }, [cry.assets]);
  const shown = rows.filter((r) => filter === 'all' || (filter === 'gainers' ? r.chg >= 0 : r.chg < 0));

  return (
    <div className="px-5 flex-1">
      <h1 className="text-[28px] font-bold tracking-tight">Market</h1>
      <div className="flex gap-2 mt-4">
        {(['all', 'gainers', 'losers'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 h-9 rounded-full text-[14px] font-medium capitalize border transition ${
              filter === f ? 'bg-white text-black border-white' : 'border-[#333] text-[#b0b0b5]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2.5">
        {shown.map((r, i) => (
          <div
            key={r.key}
            onClick={() => r.asset && onSelect(r.asset)}
            className={`${card} px-4 py-3.5 flex items-center gap-3 ${r.asset ? 'cursor-pointer active:bg-[#151515]' : ''}`}
          >
            <span className="text-[12px] text-[#6b6b70] w-4 tabular-nums">{i + 1}</span>
            <CoinIcon asset={r} className="w-9 h-9" />
            <div className="flex-1 min-w-0 leading-tight">
              <div className="text-[16px] font-semibold truncate">{r.name}</div>
              <div className="text-[13px] text-[#8e8e93]">{r.symbol}</div>
            </div>
            <Spark symbol={r.symbol} price={r.price} chg={r.chg} />
            <div className="text-right tabular-nums w-[92px] shrink-0">
              <div className="text-[15px] font-semibold">
                {cry.currency}
                {fmtPrice(r.price)}
              </div>
              <div className="text-[13px] font-medium" style={{ color: r.chg >= 0 ? GREEN : RED }}>
                {r.chg >= 0 ? '+' : ''}
                {r.chg}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- earn */
const EARN = [
  { symbol: 'ETH', name: 'Ethereum', apy: '3.2%', color: '#627EEA', note: 'Liquid staking' },
  { symbol: 'SOL', name: 'Solana', apy: '6.9%', color: '#14b8a6', note: 'Native staking' },
  { symbol: 'ATOM', name: 'Cosmos', apy: '14.1%', color: '#2E3148', note: 'Native staking' },
  { symbol: 'DOT', name: 'Polkadot', apy: '11.6%', color: '#E6007A', note: 'Nomination pool' },
];

export const EarnScreen: React.FC = () => (
  <div className="px-5 flex-1">
    <h1 className="text-[28px] font-bold tracking-tight">Earn</h1>
    <div className={`${card} p-5 mt-4`}>
      <div className="text-[18px] font-semibold">Put your crypto to work</div>
      <p className="text-[14px] text-[#9a9a9e] mt-1.5 leading-snug">
        Stake assets straight from your wallet and earn rewards. Rates shown are estimates and can change.
      </p>
    </div>
    <h2 className="text-[19px] font-semibold mt-7">Opportunities</h2>
    <div className="mt-3 space-y-2.5">
      {EARN.map((e) => (
        <div key={e.symbol} className={`${card} px-4 py-3.5 flex items-center gap-3`}>
          <CoinIcon asset={e} className="w-10 h-10" />
          <div className="flex-1 leading-tight">
            <div className="text-[16px] font-semibold">{e.name}</div>
            <div className="text-[13px] text-[#8e8e93]">{e.note}</div>
          </div>
          <div className="text-right">
            <div className="text-[16px] font-semibold" style={{ color: GREEN }}>
              {e.apy}
            </div>
            <div className="text-[12px] text-[#8e8e93]">est. APY</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#555]" />
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------- discover */
const APPS = [
  { name: 'Swap', desc: 'Trade one asset for another', hue: '#3b82f6' },
  { name: 'Stake', desc: 'Earn rewards on holdings', hue: '#22c55e' },
  { name: 'Borrow', desc: 'Loans against your crypto', hue: '#a855f7' },
  { name: 'Collectibles', desc: 'Browse and manage NFTs', hue: '#f97316' },
  { name: 'Bridge', desc: 'Move assets across chains', hue: '#06b6d4' },
  { name: 'Games', desc: 'Play with your wallet', hue: '#ec4899' },
];

export const DiscoverScreen: React.FC = () => (
  <div className="px-5 flex-1">
    <h1 className="text-[28px] font-bold tracking-tight">Discover</h1>
    <p className="text-[14px] text-[#9a9a9e] mt-1">Apps that work with your wallet</p>
    <div className="grid grid-cols-2 gap-3 mt-5">
      {APPS.map((a) => (
        <div key={a.name} className={`${card} p-4`}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[16px]" style={{ backgroundColor: a.hue }}>
            {a.name[0]}
          </div>
          <div className="text-[16px] font-semibold mt-3">{a.name}</div>
          <div className="text-[13px] text-[#8e8e93] mt-0.5 leading-snug">{a.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------- swap */
export const SwapScreen: React.FC<{ cry: CryptoData }> = ({ cry }) => {
  const [flip, setFlip] = useState(false);
  const [amount, setAmount] = useState('');
  const [done, setDone] = useState(false);

  const a0 = cry.assets[0];
  const a1 = cry.assets[1] ?? cry.assets[0];
  if (!a0) return <div className="px-5 text-[#8e8e93]">No accounts to swap.</div>;
  const A = flip ? a1 : a0;
  const B = flip ? a0 : a1;
  const n = parseFloat(amount);
  const valid = !isNaN(n) && n > 0;
  const out = valid ? (n * A.priceUsd * 0.995) / B.priceUsd : 0;

  const submit = () => {
    if (!valid) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setAmount('');
    }, 1700);
  };

  return (
    <div className="px-5 flex-1">
      <h1 className="text-[28px] font-bold tracking-tight">Swap</h1>

      <div className={`${card} p-4 mt-4`}>
        <div className="flex items-center justify-between text-[13px] text-[#8e8e93]">
          <span>You send</span>
          <span>
            Balance: {A.quantity} {A.symbol}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2 gap-3">
          <input
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className="bg-transparent outline-none text-[30px] font-bold w-full min-w-0 tabular-nums placeholder:text-[#3a3a3c]"
          />
          <div className="flex items-center gap-2 shrink-0 bg-[#1a1a1a] rounded-full pl-1.5 pr-3 py-1.5">
            <CoinIcon asset={A} className="w-6 h-6" />
            <span className="text-[15px] font-semibold">{A.symbol}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center -my-3 relative z-10">
        <button onClick={() => setFlip((f) => !f)} className="w-10 h-10 rounded-full bg-black border border-[#333] flex items-center justify-center active:scale-95 transition" aria-label="Flip">
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      <div className={`${card} p-4`}>
        <div className="text-[13px] text-[#8e8e93]">You receive (estimated)</div>
        <div className="flex items-center justify-between mt-2 gap-3">
          <div className={`text-[30px] font-bold tabular-nums truncate ${valid ? '' : 'text-[#3a3a3c]'}`}>
            {valid ? out.toFixed(out < 1 ? 6 : 4) : '0.00'}
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-[#1a1a1a] rounded-full pl-1.5 pr-3 py-1.5">
            <CoinIcon asset={B} className="w-6 h-6" />
            <span className="text-[15px] font-semibold">{B.symbol}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[13px] text-[#8e8e93] mt-4 px-1 tabular-nums">
        <span>Rate</span>
        <span>
          1 {A.symbol} ≈ {((A.priceUsd * 0.995) / B.priceUsd).toFixed(4)} {B.symbol}
        </span>
      </div>
      <div className="flex justify-between text-[13px] text-[#8e8e93] mt-1.5 px-1">
        <span>Network fee</span>
        <span>
          ≈ {cry.currency}
          {money(2.4)}
        </span>
      </div>

      <button
        onClick={submit}
        disabled={!valid || done}
        className={`w-full h-[52px] rounded-xl mt-6 text-[17px] font-semibold flex items-center justify-center gap-2 transition ${
          valid ? 'bg-white text-black active:bg-[#e6e6e6]' : 'bg-[#1a1a1a] text-[#555]'
        }`}
      >
        {done ? (
          <>
            <Check className="w-5 h-5" /> Swap submitted
          </>
        ) : (
          'Continue'
        )}
      </button>
    </div>
  );
};
