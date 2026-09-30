import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X } from 'lucide-react';

export const QuickInlineEditor: React.FC = () => {
  const { inlineEditTarget, closeInlineEdit } = useApp();
  const [val, setVal] = useState<string | number>('');

  useEffect(() => {
    if (inlineEditTarget) {
      setVal(inlineEditTarget.value);
    }
  }, [inlineEditTarget]);

  if (!inlineEditTarget) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVal = inlineEditTarget.type === 'number' ? Number(val) : val;
    inlineEditTarget.onSave(finalVal);
    closeInlineEdit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-700/80 p-5 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Edit Metric
          </span>
          <button
            onClick={closeInlineEdit}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <label className="block text-sm font-medium text-slate-200 mb-1.5">
            {inlineEditTarget.label}
          </label>

          <div className="relative mb-4">
            {inlineEditTarget.prefix && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                {inlineEditTarget.prefix}
              </span>
            )}
            <input
              type={inlineEditTarget.type || 'text'}
              step={inlineEditTarget.step || 'any'}
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className={`w-full rounded-xl bg-slate-800/90 border border-slate-600 px-3.5 py-2.5 text-base font-semibold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                inlineEditTarget.prefix ? 'pl-8' : ''
              } ${inlineEditTarget.suffix ? 'pr-8' : ''}`}
            />
            {inlineEditTarget.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                {inlineEditTarget.suffix}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeInlineEdit}
              className="flex-1 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
