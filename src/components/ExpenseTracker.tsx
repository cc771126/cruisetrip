/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Expense } from '../types';
import { Coins, Trash2, HelpCircle, Calculator, ChevronRight, CornerDownRight } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
  meName: string | null;
  addExpense: (description: string, amount: number, currency: 'TWD' | 'JPY' | 'KRW') => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export default function ExpenseTracker({ expenses, meName, addExpense, deleteExpense }: ExpenseTrackerProps) {
  const [desc, setDesc] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'TWD' | 'JPY' | 'KRW'>('JPY');

  // Calculator State
  const [calcInput, setCalcInput] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meName) return;
    const num = parseFloat(amount);
    if (!desc.trim()) return alert('請填寫消費項目敘述！');
    if (isNaN(num) || num <= 0) return alert('請填寫正確金額！');

    await addExpense(desc.trim(), num, currency);
    setDesc('');
    setAmount('');
  };

  // Calculator logic
  const handleCalcBtn = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '←') {
      setCalcInput(prev => prev.slice(0, -1));
    } else if (val === '=') {
      try {
        // Safe evaluation of standard math characters
        const sanitized = calcInput.replace(/[^-+*/.0-9]/g, '');
        // eslint-disable-next-line no-eval
        const result = eval(sanitized);
        if (result !== undefined && !isNaN(result)) {
          setCalcResult(String(Math.round(result * 100) / 100));
        }
      } catch (e) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  // Balance logic
  const totalTWD = expenses.reduce((acc, e) => acc + e.amountTWD, 0);
  const uniquePayers = Array.from(new Set(expenses.map(e => e.payer)));
  const payerTotals = uniquePayers.reduce((acc, payer) => {
    acc[payer] = expenses.filter(e => e.payer === payer).reduce((sum, e) => sum + e.amountTWD, 0);
    return acc;
  }, {} as Record<string, number>);

  const perPersonShare = uniquePayers.length > 0 ? Math.round(totalTWD / uniquePayers.length) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input and calculator panel */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-500" />
          新增團體記帳資訊
        </h3>

        {!meName ? (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 font-bold text-center">
            請先在下方「討論區」輸入您的暱稱，才能參與記帳喔！
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">消費描述</label>
                <input
                  type="text"
                  placeholder="例：佐世保漢堡 / 交通車資"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="w-full h-11 border border-slate-200 rounded-xl px-3 bg-slate-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">金額</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="金額"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-3 bg-slate-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-right font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">幣別</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as any)}
                    className="w-full h-11 border border-slate-200 rounded-xl px-2 bg-slate-50 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white font-bold text-slate-800"
                  >
                    <option value="JPY">JPY (¥)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="TWD">TWD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                依即時匯率概估：1 TWD ≈ 4.76 JPY / 41.6 KRW
              </span>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-6 h-11 rounded-xl transition-all shadow-sm"
              >
                + 加進記帳本
              </button>
            </div>
          </form>
        )}

        {/* Small calculator widget */}
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-extrabold text-slate-400 tracking-wider flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4 text-indigo-500" />
            隨身小計算機 (計算後可手動填入金額)
          </h4>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 max-w-sm">
            <div className="bg-white border border-slate-200 rounded-xl p-3 mb-3 text-right font-mono min-h-[72px] flex flex-col justify-between">
              <div className="text-slate-400 text-xs tracking-wider break-all">{calcInput || '0'}</div>
              <div className="text-slate-800 text-lg font-extrabold break-all">{calcResult ? `= ${calcResult}` : ''}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['C', '←', '/', '*'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className="h-10 rounded-xl font-extrabold text-sm flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all active:scale-95"
                >
                  {btn}
                </button>
              ))}
              {['7', '8', '9', '-'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className="h-10 rounded-xl font-bold text-sm flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95"
                >
                  {btn}
                </button>
              ))}
              {['4', '5', '6', '+'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleCalcBtn(btn)}
                  className="h-10 rounded-xl font-bold text-sm flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95"
                >
                  {btn}
                </button>
              ))}
              <div className="grid grid-cols-3 col-span-3 gap-2">
                {['1', '2', '3'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalcBtn(btn)}
                    className="h-10 rounded-xl font-bold text-sm flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95"
                  >
                    {btn}
                  </button>
                ))}
                {['0', '.', '='].map((btn, i) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcBtn(btn)}
                    className={`h-10 rounded-xl font-extrabold text-sm flex items-center justify-center transition-all active:scale-95 ${
                      btn === '=' ? 'col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense list & summary panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-indigo-300">團體消費總計</span>
            <div className="text-3xl font-extrabold font-mono mt-1 text-amber-300">
              NT$ {totalTWD.toLocaleString()}
            </div>
          </div>

          <div className="border-t border-indigo-800/60 pt-3 space-y-2">
            <div className="flex justify-between text-xs font-bold text-indigo-200">
              <span>參與記帳人數</span>
              <span>{uniquePayers.length} 人</span>
            </div>
            {uniquePayers.length > 0 && (
              <div className="flex justify-between text-xs font-bold text-indigo-200">
                <span>每人平均分攤</span>
                <span className="text-amber-300 font-mono">NT$ {perPersonShare.toLocaleString()}</span>
              </div>
            )}
          </div>

          {uniquePayers.length > 0 && (
            <div className="border-t border-indigo-800/60 pt-3">
              <span className="text-xs font-bold text-indigo-300 block mb-2">個別付款統計</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
                {Object.entries(payerTotals).map(([payer, total]) => {
                  const diff = total - perPersonShare;
                  return (
                    <div key={payer} className="flex justify-between items-center text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {payer}
                      </span>
                      <span className="font-mono">
                        已付 NT$ {total.toLocaleString()}{' '}
                        <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          ({diff >= 0 ? `+${diff}` : diff})
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Expense List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col max-h-[380px]">
          <h4 className="text-xs font-extrabold text-slate-400 tracking-wider mb-3">消費明細</h4>
          {expenses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs flex-1 flex flex-col items-center justify-center">
              🧮 目前尚無記帳紀錄。
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between items-start bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-100 transition-all text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="font-extrabold text-slate-800">{e.description}</div>
                    <div className="text-slate-400 font-bold flex items-center gap-1 flex-wrap">
                      <span>付清者：{e.payer}</span>
                      <span className="text-slate-300">|</span>
                      <span>原幣別：{e.amount} {e.currency}</span>
                    </div>
                  </div>
                  <div className="text-right ml-2 flex flex-col items-end gap-1.5">
                    <span className="font-mono font-extrabold text-indigo-950">NT$ {e.amountTWD}</span>
                    {(e.payer === meName || !meName) && (
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title="刪除"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
