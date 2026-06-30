/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WishlistItem } from '../types';
import { RECOMMENDATIONS } from '../data';
import { ShoppingCart, Check, Trash2, Plus, CornerDownRight, Tag } from 'lucide-react';

interface ShoppingSectionProps {
  wishlist: WishlistItem[];
  meName: string | null;
  addWishlistItem: (name: string, category: WishlistItem['category']) => Promise<void>;
  toggleWishlistItem: (id: string) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
}

export default function ShoppingSection({
  wishlist,
  meName,
  addWishlistItem,
  toggleWishlistItem,
  deleteWishlistItem
}: ShoppingSectionProps) {
  const [customItem, setCustomItem] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'japan' | 'korea_oy' | 'korea_rx'>('japan');

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meName) return alert('請先填寫暱稱！');
    if (!customItem.trim()) return;

    await addWishlistItem(customItem.trim(), 'custom');
    setCustomItem('');
  };

  const handleQuickAdd = async (name: string) => {
    if (!meName) return alert('請先在下方討論區填寫您的暱稱，才能加進購買清單！');
    // Check if already exists in wishlist to avoid duplicates
    const exists = wishlist.some(item => item.name.toLowerCase() === name.toLowerCase() && !item.completed);
    if (exists) {
      alert(`「${name}」已存在於大家的待買清單中囉！`);
      return;
    }
    await addWishlistItem(name, activeTab);
  };

  // Group wishlist items
  const erinItems = wishlist.filter(i => i.addedBy === 'Erin');
  const rebeccaItems = wishlist.filter(i => i.addedBy === 'Rebecca');
  const otherItems = wishlist.filter(i => i.addedBy !== 'Erin' && i.addedBy !== 'Rebecca');

  const renderWishlistItem = (item: WishlistItem) => (
    <div
      key={item.id}
      className={`flex items-center justify-between p-2 rounded-xl border transition-all text-xs ${
        item.completed
          ? 'bg-slate-100/60 border-slate-200 text-slate-400 line-through'
          : 'bg-white border-slate-200/80 text-slate-800 shadow-sm hover:border-slate-300'
      }`}
    >
      <div
        onClick={() => toggleWishlistItem(item.id)}
        className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
      >
        <div
          className={`h-4 w-4 rounded-md border flex items-center justify-center text-white text-[9px] flex-shrink-0 transition-all ${
            item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
          }`}
        >
          {item.completed && '✓'}
        </div>
        <span className="font-extrabold truncate text-slate-800">{item.name}</span>
      </div>
      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
        {item.addedBy !== 'Erin' && item.addedBy !== 'Rebecca' && (
          <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-1.5 py-0.5 rounded">
            {item.addedBy}
          </span>
        )}
        <button
          onClick={() => deleteWishlistItem(item.id)}
          className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-slate-100 transition-colors"
          title="刪除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-indigo-500" />
          藥妝、美妝與藥局代購待買清單 🛍️
        </h3>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">
          隨手一按＋即刻代購
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: recommendations (Japan/Korea tabs) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col h-[400px]">
          <span className="text-xs font-extrabold text-slate-500 mb-3 block">🇯🇵 🇰🇷 日韓熱門推薦（點擊 ＋ 號直接加入清單）</span>
          
          {/* Recommendation tabs */}
          <div className="flex bg-slate-200/60 p-1 rounded-xl mb-3 gap-1">
            <button
              onClick={() => setActiveTab('japan')}
              className={`flex-1 text-[11px] py-1.5 rounded-lg font-extrabold transition-all ${
                activeTab === 'japan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🇯🇵 日本 Top 10
            </button>
            <button
              onClick={() => setActiveTab('korea_oy')}
              className={`flex-1 text-[11px] py-1.5 rounded-lg font-extrabold transition-all ${
                activeTab === 'korea_oy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🇰🇷 韓國 Olive Young
            </button>
            <button
              onClick={() => setActiveTab('korea_rx')}
              className={`flex-1 text-[11px] py-1.5 rounded-lg font-extrabold transition-all ${
                activeTab === 'korea_rx' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🇰🇷 韓國藥局
            </button>
          </div>

          {/* Recommended Items Grid */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {RECOMMENDATIONS[activeTab].map((item) => {
              const inWishlist = wishlist.some(w => w.name === item && !w.completed);
              return (
                <div
                  key={item}
                  onClick={() => handleQuickAdd(item)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    inWishlist
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                      : 'bg-white border-slate-200/60 text-slate-700 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Tag className="h-3.5 w-3.5 opacity-60" />
                    {item}
                  </span>
                  <span className="flex items-center gap-1">
                    {inWishlist ? (
                      <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-extrabold flex items-center gap-0.5">
                        <Check className="h-2.5 w-2.5" /> 已在清單
                      </span>
                    ) : (
                      <span className="h-5 w-5 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-black text-sm">
                        +
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: our separated wishlist */}
        <div className="lg:col-span-7 flex flex-col justify-between h-[400px] gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
            {/* Column 1: Erin's List */}
            <div className="flex flex-col bg-[#fef8fa]/80 border border-rose-100 rounded-2xl p-3.5 h-full">
              <div className="flex items-center justify-between border-b border-rose-100/50 pb-2 mb-2">
                <span className="text-xs font-black text-rose-700 flex items-center gap-1">
                  🌸 Erin 的採購清單
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded-full">
                  {erinItems.length} 筆
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {erinItems.length === 0 ? (
                  <div className="text-center py-12 text-rose-300 text-xs flex flex-col items-center justify-center h-full">
                    <span>目前清單空空的。</span>
                    <span className="text-[10px] opacity-75 mt-0.5">登入 Erin 後新增即可！</span>
                  </div>
                ) : (
                  erinItems.map(renderWishlistItem)
                )}
              </div>
            </div>

            {/* Column 2: Rebecca's List */}
            <div className="flex flex-col bg-[#f0f9ff]/80 border border-sky-100 rounded-2xl p-3.5 h-full">
              <div className="flex items-center justify-between border-b border-sky-100/50 pb-2 mb-2">
                <span className="text-xs font-black text-sky-700 flex items-center gap-1">
                  🎀 Rebecca 的採購清單
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-1.5 py-0.5 rounded-full">
                  {rebeccaItems.length} 筆
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {rebeccaItems.length === 0 ? (
                  <div className="text-center py-12 text-sky-300 text-xs flex flex-col items-center justify-center h-full">
                    <span>目前清單空空的。</span>
                    <span className="text-[10px] opacity-75 mt-0.5">登入 Rebecca 後新增即可！</span>
                  </div>
                ) : (
                  rebeccaItems.map(renderWishlistItem)
                )}
              </div>
            </div>
          </div>

          {/* Other list if any items are not by Erin/Rebecca */}
          {otherItems.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 max-h-[100px] overflow-y-auto scrollbar-thin">
              <span className="text-[10px] font-extrabold text-slate-500 mb-1.5 block">👥 其他人的採購清單：</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {otherItems.map(renderWishlistItem)}
              </div>
            </div>
          )}

          {/* Add custom custom item form */}
          <form onSubmit={handleAddCustom} className="flex gap-1.5">
            <input
              type="text"
              placeholder={meName ? `新增代購商品至 ${meName} 的清單...` : "請先在下方「討論區」填寫您的暱稱..."}
              value={customItem}
              onChange={e => setCustomItem(e.target.value)}
              disabled={!meName}
              className="flex-1 h-10 border border-slate-200 rounded-xl px-3 bg-white text-xs font-bold !text-slate-800 !bg-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!meName}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 rounded-xl transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> 新增商品
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
