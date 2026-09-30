import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  Eye,
  EyeOff,
  LayoutGrid,
  Wallet,
  Compass,
  Cpu,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { CryptoAsset } from '../../types';
import { FONT, LedgerMark, CoinIcon } from './ledger/shared';
import { LedgerAssetDetail, MarketScreen, EarnScreen, DiscoverScreen, SwapScreen } from './ledger/LedgerScreens';
import { CountUp } from '../common/CountUp';
import { PullSpinner } from '../common/PullSpinner';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

type Tab = 'portfolio' | 'market' | 'earn' | 'discover' | 'swap';

export const LedgerDashboard: React.FC = () => {
  const {
    activePhase,
    setCurrentPlatform,
    appMode,
    setAppMode,
    openInlineEdit,
    updateCrypto,
    setIsControlCenterOpen,
  } = useApp();

  const [tab, setTab] = useState<Tab>('portfolio');
  const [activeModal, setActiveModal] = useState<'send' | 'receive' | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddr, setRecipientAddr] = useState('');
  const [hidden, setHidden] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const ptr = usePullToRefresh(rootRef, () => setRefreshKey((k) => k + 1), !activeModal);

  const cry = activePhase.crypto;
  const isEditing = appMode === 'edit';
  const up = cry.change24hPercent >= 0;
  const editRing = isEditing ? 'cursor-pointer ring-1 ring-emerald-500/50 rounded-lg' : '';

  const goTab = (t: Tab) => {
    setTab(t);
    setSelectedAsset(null);
    window.scrollTo?.({ top: 0 });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendAmount) return;
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setActiveModal(null);
      setSendAmount('');
      setRecipientAddr('');
    }, 1600);
  };

  const actions: { label: string; icon: React.ReactNode; onClick: () => void }[] = [
    { label: 'Send', icon: <Send className="w-[22px] h-[22px]" strokeWidth={1.5} />, onClick: () => setActiveModal('send') },
    { label: 'Receive', icon: <ArrowDownLeft className="w-[22px] h-[22px]" strokeWidth={1.5} />, onClick: () => setActiveModal('receive') },
    { label: 'Swap', icon: <ArrowLeftRight className="w-[22px] h-[22px]" strokeWidth={1.5} />, onClick: () => goTab('swap') },
    { label: 'Buy', icon: <Plus className="w-[22px] h-[22px]" strokeWidth={1.5} />, onClick: () => setActiveModal('receive') },
  ];

  const tabs: { id: Tab; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'portfolio', label: 'Portfolio', Icon: LayoutGrid },
    { id: 'market', label: 'Market', Icon: Wallet },
    { id: 'earn', label: 'Earn', Icon: ArrowLeftRight },
    { id: 'discover', label: 'Discover', Icon: Compass },
    { id: 'swap', label: 'Swap', Icon: Cpu },
  ];

  const portfolio = (
    <>
      <header className="flex items-center justify-between px-5 pb-1">
        <div className="flex items-center gap-3 min-w-0">
          <LedgerMark className="w-[30px] h-[30px] text-white shrink-0" />
          <div className="leading-tight min-w-0">
            <div className="text-[13px] text-[#8e8e93]">Ledger Live</div>
            <div
              onClick={() => {
                if (!isEditing) return;
                openInlineEdit({
                  label: 'Wallet Name',
                  value: cry.walletName,
                  onSave: (val) => updateCrypto({ walletName: val }),
                });
              }}
              className={`text-[17px] font-semibold text-white truncate ${editRing}`}
            >
              {cry.walletName}
            </div>
          </div>
        </div>
        <button onClick={() => setHidden((h) => !h)} className="p-1 text-[#9a9a9e] active:text-white" aria-label="Toggle balance">
          {hidden ? <EyeOff className="w-6 h-6" strokeWidth={1.6} /> : <Eye className="w-6 h-6" strokeWidth={1.6} />}
        </button>
      </header>

      <main className="flex-1 px-5">
        <div className="mt-4">
          <div className="text-[15px] text-[#9a9a9e]">Portfolio balance</div>
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Total Portfolio Balance',
                value: cry.totalValue,
                type: 'number',
                prefix: cry.currency,
                onSave: (val) => updateCrypto({ totalValue: val }),
              });
            }}
            className={`text-[38px] leading-[1.15] font-bold tracking-tight tabular-nums mt-1 inline-block ${editRing}`}
          >
            {hidden ? '••••••••' : <CountUp value={cry.totalValue} decimals={2} prefix={cry.currency} replayKey={refreshKey} />}
          </div>
          <div className={`flex items-center gap-3 text-[15px] font-medium mt-1 tabular-nums ${up ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
            <span>
              {hidden ? (
                '•••••'
              ) : (
                <CountUp value={Math.abs(cry.change24h)} decimals={2} prefix={`${up ? '' : '-'}${cry.currency}`} replayKey={refreshKey} />
              )}
            </span>
            <span>
              {up ? '+' : ''}
              {cry.change24hPercent}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 mt-7">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="flex flex-col items-center justify-center gap-2.5 h-[84px] rounded-2xl bg-[#0d0d0d] border border-[#262626] text-white active:bg-[#1a1a1a] transition"
            >
              {a.icon}
              <span className="text-[14px] text-white/90">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <h2 className="text-[19px] font-semibold">Accounts</h2>
          <span className="text-[15px] text-[#9a9a9e]">See all</span>
        </div>

        <div className="mt-3 space-y-3">
          {cry.assets.map((asset) => {
            const pos = asset.change24hPercent >= 0;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="flex items-center justify-between rounded-2xl bg-[#0d0d0d] border border-[#262626] px-4 py-[18px] active:bg-[#151515] transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <CoinIcon asset={asset} />
                  <div className="leading-tight min-w-0">
                    <div className="text-[17px] font-semibold text-white">{asset.name}</div>
                    <div className="text-[14px] text-[#8e8e93] mt-0.5">
                      {asset.quantity} {asset.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline text-right tabular-nums whitespace-nowrap">
                  <span className="text-[17px] font-semibold text-white">
                    {hidden ? '••••••' : <CountUp value={asset.valueUsd} decimals={2} prefix={cry.currency} replayKey={refreshKey} />}
                  </span>
                  <span className={`text-[14px] font-medium ${pos ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {pos ? '+' : ''}
                    {asset.change24hPercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );

  return (
    <div ref={rootRef} className={`flex flex-col min-h-full bg-black text-white select-none ${FONT} ${selectedAsset ? 'pb-10' : 'pb-32'}`}>
      {/* Edit Mode Top Banner */}
      {isEditing && (
        <div className="bg-teal-600 px-4 py-1.5 flex items-center justify-between text-xs text-white">
          <span className="font-semibold">Edit Mode: Tap any stat to customize</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPlatform('launcher')} className="underline font-medium hover:text-white/80">
              Launcher
            </button>
            <button onClick={() => setIsControlCenterOpen(true)} className="underline font-medium hover:text-white/80">
              Control Center
            </button>
            <button
              onClick={() => setAppMode('film')}
              className="bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      <div className="pt-[max(env(safe-area-inset-top),14px)]" />
      <PullSpinner offset={ptr.offset} refreshing={ptr.refreshing} dragging={ptr.dragging} />

      <div key={selectedAsset ? `asset-${selectedAsset.id}` : tab} className="screen-fade flex-1 flex flex-col">
        {selectedAsset ? (
          <LedgerAssetDetail
            asset={selectedAsset}
            cry={cry}
            refreshKey={refreshKey}
            hidden={hidden}
            onBack={() => setSelectedAsset(null)}
            onSend={() => setActiveModal('send')}
            onReceive={() => setActiveModal('receive')}
          />
        ) : tab === 'portfolio' ? (
          portfolio
        ) : tab === 'market' ? (
          <MarketScreen cry={cry} onSelect={setSelectedAsset} />
        ) : tab === 'earn' ? (
          <EarnScreen />
        ) : tab === 'discover' ? (
          <DiscoverScreen />
        ) : (
          <SwapScreen cry={cry} />
        )}
      </div>

      {/* Bottom tab bar */}
      {!selectedAsset && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-black border-t border-[#1c1c1e] pt-3 pb-[max(env(safe-area-inset-bottom),14px)]">
          <div className="grid grid-cols-5">
            {tabs.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => goTab(id)} className={`flex flex-col items-center gap-1.5 transition-colors ${tab === id ? 'text-white' : 'text-[#4a4a4f]'}`}>
                <Icon className="w-[22px] h-[22px]" strokeWidth={1.6} />
                <span className="text-[12px]">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Prop Modal: Receive */}
      {activeModal === 'receive' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-[#161618] border border-white/10 p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Receive Props
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated QR Code SVG */}
            <div className="mx-auto w-44 h-44 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-8 h-8 bg-black" />
                </div>
                <div className="grid grid-cols-4 gap-1 p-1">
                  <div className="h-2 bg-black" />
                  <div className="h-2 bg-black" />
                  <div className="h-2 bg-black" />
                  <div className="h-2 bg-black" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-6 h-6 bg-black" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Simulated Fictional Wallet Address:
            </p>
            <div className="flex items-center justify-center gap-2 mt-1.5 p-2 rounded-xl bg-black/60 border border-white/10">
              <span className="text-xs font-mono text-emerald-400">
                bc1q9x40...prop_fictional_71
              </span>
              <button
                onClick={() => copyToClipboard('bc1q9x40prop_fictional_71')}
                className="p-1 text-slate-300 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Prop Modal: Send */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-[#161618] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Send Transaction Prop
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sendSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Broadcasted to Ledger</h3>
                <p className="text-xs text-slate-400 mt-1">Transaction verified</p>
              </div>
            ) : (
              <form onSubmit={handleSendSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Recipient Address</label>
                  <input
                    type="text"
                    required
                    placeholder="0x... or bc1q..."
                    value={recipientAddr}
                    onChange={(e) => setRecipientAddr(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      BTC
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400 py-1">
                  <span>Network Fee:</span>
                  <span className="font-mono text-emerald-400">0.00004 BTC (Fast)</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm text-white shadow-md transition mt-2 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Sign & Transmit</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
