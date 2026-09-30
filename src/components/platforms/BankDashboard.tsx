import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Send,
  PieChart,
  Check,
  X,
} from 'lucide-react';
import { PlatformHeaderLogo } from '../../config/platformLogos';

export const BankDashboard: React.FC = () => {
  const {
    activePhase,
    setCurrentPlatform,
    appMode,
    setAppMode,
    openInlineEdit,
    updateBank,
    setIsControlCenterOpen,
  } = useApp();

  const [hideBalance, setHideBalance] = useState(false);
  const [activeModal, setActiveModal] = useState<'transfer' | 'deposit' | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState<'savings' | 'external'>('savings');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const bank = activePhase.bank;
  const isEditing = appMode === 'edit';

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(transferAmount);
    if (!amt || isNaN(amt)) return;

    setTransferSuccess(true);
    setTimeout(() => {
      if (transferTarget === 'savings') {
        updateBank({
          checkingBalance: Math.max(0, bank.checkingBalance - amt),
          savingsBalance: bank.savingsBalance + amt,
        });
      }
      setTransferSuccess(false);
      setActiveModal(null);
      setTransferAmount('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-full bg-black text-[#f5f5f7] select-none pb-24">
      {/* Edit Mode Top Banner */}
      {isEditing && (
        <div className="bg-amber-600 px-4 py-1.5 flex items-center justify-between text-xs text-black font-semibold">
          <span>Edit Mode: Tap any balance or card info to customize</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsControlCenterOpen(true)}
              className="underline text-black font-bold hover:opacity-80"
            >
              Control Center
            </button>
            <button
              onClick={() => setAppMode('film')}
              className="bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPlatform('launcher')}
            className="p-1 -ml-1 text-white/70 hover:text-white rounded-full active:bg-white/10 transition"
            title="Return to Launcher"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <PlatformHeaderLogo platform="bank" />
            <div>
              <span
                onClick={() => {
                  if (!isEditing) return;
                  openInlineEdit({
                    label: 'Bank Institution Name',
                    value: bank.institutionName,
                    onSave: (val) => updateBank({ institutionName: val }),
                  });
                }}
                className={`text-xs font-bold tracking-wider text-white/90 uppercase block ${
                  isEditing ? 'cursor-pointer hover:underline' : 'cursor-default'
                }`}
              >
                {bank.institutionName}
              </span>
              <span
                onClick={() => {
                  if (!isEditing) return;
                  openInlineEdit({
                    label: 'Account Holder Name',
                    value: bank.accountHolder,
                    onSave: (val) => updateBank({ accountHolder: val }),
                  });
                }}
                className={`text-[11px] text-[#86868b] ${
                  isEditing ? 'cursor-pointer hover:underline' : 'cursor-default'
                }`}
              >
                {bank.accountHolder}
              </span>
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-sm">
          AS
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-5 max-w-lg mx-auto w-full">
        {/* Total Net Balance Card */}
        <div className="rounded-[24px] bg-[#121214] border border-white/[0.08] p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#86868b]">
            <span className="font-semibold tracking-wider uppercase text-[11px]">Net Liquid Assets</span>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-1 rounded-full text-[#86868b] hover:text-white transition"
            >
              {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Total Net Liquid Balance',
                value: bank.totalBalance,
                type: 'number',
                prefix: '$',
                onSave: (val) => updateBank({ totalBalance: val }),
              });
            }}
            className={`text-3xl font-extrabold text-white tracking-tight mt-1 tabular-nums ${
              isEditing ? 'cursor-pointer hover:underline ring-1 ring-amber-500/40 rounded-lg p-1 inline-block' : 'cursor-default'
            }`}
          >
            {hideBalance
              ? '••••••••'
              : `$${bank.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>

          {/* Quick Cash Flow Summary */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.06] text-xs">
            <div>
              <span className="text-[#86868b]">Monthly Inflow</span>
              <div className="text-sm font-bold text-emerald-400 tabular-nums mt-0.5">
                +{hideBalance ? '••••' : `$${bank.monthlyIncome.toLocaleString()}`}
              </div>
            </div>
            <div>
              <span className="text-[#86868b]">Monthly Spending</span>
              <div className="text-sm font-bold text-slate-300 tabular-nums mt-0.5">
                -{hideBalance ? '••••' : `$${bank.monthlySpending.toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Prop Actions: Transfer, Deposit, Pay, Analytics */}
        <div className="grid grid-cols-4 gap-2.5 text-center">
          <button
            onClick={() => setActiveModal('transfer')}
            className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#161618] hover:bg-[#1f1f23] border border-white/[0.06] active:scale-95 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.08] text-white flex items-center justify-center mb-1.5">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Transfer</span>
          </button>

          <button
            onClick={() => setActiveModal('deposit')}
            className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#161618] hover:bg-[#1f1f23] border border-white/[0.06] active:scale-95 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.08] text-emerald-400 flex items-center justify-center mb-1.5">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Deposit</span>
          </button>

          <button
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#161618] hover:bg-[#1f1f23] border border-white/[0.06] active:scale-95 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.08] text-blue-400 flex items-center justify-center mb-1.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Card</span>
          </button>

          <button
            onClick={() => setIsControlCenterOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-[20px] bg-[#161618] hover:bg-[#1f1f23] border border-white/[0.06] active:scale-95 transition"
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.08] text-purple-400 flex items-center justify-center mb-1.5">
              <PieChart className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Analytics</span>
          </button>
        </div>

        {/* Realistic Apple Titanium Card Prop */}
        <div
          onClick={() => setIsCardFlipped(!isCardFlipped)}
          className="relative w-full aspect-[1.586/1] rounded-[24px] p-6 bg-gradient-to-tr from-[#1c1c1e] via-[#2c2c2e] to-[#1a1a1c] border border-white/[0.12] shadow-2xl cursor-pointer hover:scale-[1.01] transition-transform overflow-hidden"
        >
          {!isCardFlipped ? (
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-white/90 uppercase">
                  {bank.creditCard.cardType}
                </span>
                <span className="text-xs font-mono text-white/40 tracking-wider">RESERVE</span>
              </div>

              {/* EMV Chip & Contactless */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-[#d1d5db]/80 border border-white/40 flex items-center justify-center">
                  <div className="w-full h-2 border-y border-black/20" />
                </div>
                <div className="text-white/50">
                  <svg className="w-5 h-5 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 6a6 6 0 0 1 6 6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Card Number & Holder */}
              <div>
                <div className="font-mono text-lg font-medium tracking-[0.25em] text-white/90">
                  {bank.creditCard.cardNumber}
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div>
                    <span className="text-[9px] text-white/40 block">CARDHOLDER</span>
                    <span className="font-semibold text-white/80">{bank.creditCard.cardHolder}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 block">EXPIRES</span>
                    <span className="font-mono text-white/80">{bank.creditCard.expiry}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full flex flex-col justify-between pt-2">
              <div className="w-full h-10 bg-black/90 -mx-6 mb-2" />
              <div className="flex items-center justify-between px-2 bg-white/10 rounded-lg p-2">
                <span className="text-[10px] text-white/50">AUTHORIZED SIGNATURE</span>
                <span className="font-mono font-bold text-sm text-black bg-white px-2 py-0.5 rounded">
                  {bank.creditCard.cvv}
                </span>
              </div>
              <p className="text-[9px] text-white/40 leading-tight">
                This card is a prop representation for entertainment and filmmaking. Not valid for actual transactions.
              </p>
            </div>
          )}
        </div>

        {/* Accounts Breakdown */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider block px-1">
            Accounts & Credit
          </span>

          {/* Primary Checking */}
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Checking Account Balance',
                value: bank.checkingBalance,
                type: 'number',
                prefix: '$',
                onSave: (val) => updateBank({ checkingBalance: val }, true),
              });
            }}
            className={`flex items-center justify-between p-4 rounded-[20px] bg-[#121214] border border-white/[0.08] transition ${
              isEditing ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'
            }`}
          >
            <div>
              <h4 className="text-sm font-bold text-white">Private Reserve Checking</h4>
              <p className="text-xs text-[#86868b] font-mono mt-0.5">{bank.checkingNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white tabular-nums tracking-tight">
                {hideBalance ? '••••' : `$${bank.checkingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Available</span>
            </div>
          </div>

          {/* High-Yield Savings */}
          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'High-Yield Savings Balance',
                value: bank.savingsBalance,
                type: 'number',
                prefix: '$',
                onSave: (val) => updateBank({ savingsBalance: val }, true),
              });
            }}
            className={`flex items-center justify-between p-4 rounded-[20px] bg-[#121214] border border-white/[0.08] transition ${
              isEditing ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'
            }`}
          >
            <div>
              <h4 className="text-sm font-bold text-white">Treasury Reserve</h4>
              <p className="text-xs text-[#86868b] font-mono mt-0.5">{bank.savingsNumber} · 5.15% APY</p>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white tabular-nums tracking-tight">
                {hideBalance ? '••••' : `$${bank.savingsBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </div>
              <span className="text-[11px] text-blue-400 font-medium">Yield Active</span>
            </div>
          </div>

          {/* Credit Card Line */}
          <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#121214] border border-white/[0.08]">
            <div>
              <h4 className="text-sm font-bold text-white">Obsidian Card Line</h4>
              <p className="text-xs text-[#86868b] font-mono mt-0.5">Limit ${bank.creditCard.creditLimit.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-slate-200 tabular-nums tracking-tight">
                {hideBalance ? '••••' : `$${bank.creditCard.availableCredit.toLocaleString()}`}
              </div>
              <span className="text-[11px] text-[#86868b] font-medium">Available Credit</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="rounded-[22px] bg-[#121214] border border-white/[0.08] p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider">
              Recent Transactions
            </span>
            <span className="text-xs text-blue-400 cursor-pointer">Filter</span>
          </div>

          <div className="space-y-3">
            {bank.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.08] text-slate-300'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tx.name}</h4>
                    <p className="text-[10px] text-[#86868b]">{tx.date} · {tx.category}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-bold tabular-nums ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-[#86868b] capitalize">{tx.account}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Transfer Prop Modal */}
      {activeModal === 'transfer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-[#161618] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Instant Transfer Prop
              </span>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {transferSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Transfer Completed</h3>
                <p className="text-xs text-slate-400 mt-1">Funds transferred successfully</p>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">From Account</label>
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-medium text-white">
                    Private Checking (Avail: ${bank.checkingBalance.toLocaleString()})
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">To Destination</label>
                  <select
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value as any)}
                    className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="savings">Treasury Savings (Yield 5.15%)</option>
                    <option value="external">External Wire Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Transfer Amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full rounded-xl bg-black/50 border border-white/10 pl-8 pr-3 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-md transition mt-2 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute Transfer</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Deposit Prop Modal */}
      {activeModal === 'deposit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-[24px] bg-[#161618] border border-white/10 p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Deposit Instructions
              </span>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-left text-xs bg-black/50 p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-[#86868b] block text-[10px]">BANK NAME</span>
                <span className="font-bold text-white">{bank.institutionName}</span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[10px]">ROUTING (ABA)</span>
                <span className="font-mono text-emerald-400 font-bold">021000089</span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[10px]">ACCOUNT NUMBER</span>
                <span className="font-mono text-emerald-400 font-bold">98204918241</span>
              </div>
              <div>
                <span className="text-[#86868b] block text-[10px]">BENEFICIARY</span>
                <span className="font-bold text-white">{bank.accountHolder}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
