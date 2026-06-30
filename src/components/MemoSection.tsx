/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Memo } from '../types';
import { Notebook, Trash2, Edit3, Check, X, FileText } from 'lucide-react';

interface MemoSectionProps {
  memos: Memo[];
  meName: string | null;
  addMemo: (text: string) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  updateMemo: (id: string, text: string) => Promise<void>;
}

export default function MemoSection({ memos, meName, addMemo, deleteMemo, updateMemo }: MemoSectionProps) {
  const [newMemo, setNewMemo] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meName) return;
    if (!newMemo.trim()) return;

    await addMemo(newMemo.trim());
    setNewMemo('');
  };

  const startEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditingText(memo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async (id: string) => {
    if (!editingText.trim()) return;
    await updateMemo(id, editingText.trim());
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Notebook className="h-5 w-5 text-indigo-500" />
          房密、訂票與備忘筆記本
        </h3>
        <span className="text-[10px] bg-slate-100 font-extrabold text-slate-500 px-2 py-0.5 rounded-full">
          多人協同編輯 📝
        </span>
      </div>

      <p className="text-slate-500 text-xs font-bold leading-normal">
        在這裡記下房號、WiFi帳號密碼、訂位代號、領隊聯絡資料或集合提醒，大家開啟同個頁面都能立即同步與紀錄！
      </p>

      {/* Memo list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {memos.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <FileText className="h-8 w-8 text-slate-300 mb-2" />
            目前筆記本空空如也，快在下方新增一筆吧！
          </div>
        ) : (
          memos.map((m) => {
            const isEditing = editingId === m.id;
            return (
              <div
                key={m.id}
                className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-between hover:shadow-sm transition-all"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none h-16 font-medium text-slate-700"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        title="取消"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => saveEdit(m.id)}
                        className="p-1 text-emerald-500 hover:text-emerald-700 rounded"
                        title="儲存"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap break-all leading-relaxed">
                      {m.text}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-200/50 pt-2 mt-3">
                      <span className="text-[10px] font-bold text-slate-400">
                        ✍️ {m.author} · {new Date(m.created).toLocaleDateString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(m)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                          title="修改"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMemo(m.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="刪除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input form */}
      {!meName ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 font-bold text-center">
          請先在下方「討論區」輸入您的暱稱，才能撰寫備忘錄筆記！
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="新增筆記...（例：領隊 LINE ID: msc_guide / 房密：11202）"
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            className="flex-1 h-11 border border-slate-200 rounded-xl px-3 bg-slate-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 rounded-xl transition-all shadow-sm"
          >
            記一筆
          </button>
        </form>
      )}
    </div>
  );
}
