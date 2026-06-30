/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LOCAL_TIPS } from '../data';
import { AlertCircle, HelpCircle, ArrowRight, CornerDownRight, Compass } from 'lucide-react';

export default function LocalTipsSection() {
  const [activeTab, setActiveTab] = useState<'saseho' | 'busan'>('saseho');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-indigo-500" />
          自由行當地避坑小叮嚀 💡
        </h3>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">
          交通、防詐騙、熱門預約
        </span>
      </div>

      <p className="text-slate-500 text-xs font-bold leading-relaxed">
        由本航線靠港經驗整理的日韓自由行必看避坑貼士，出發前一定要先看熟、下載好推薦的手機 App 喔！
      </p>

      {/* Tab select */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs gap-1">
        <button
          onClick={() => setActiveTab('saseho')}
          className={`flex-1 text-xs py-2 rounded-lg font-extrabold transition-all ${
            activeTab === 'saseho' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ⛩️ 日本佐世保
        </button>
        <button
          onClick={() => setActiveTab('busan')}
          className={`flex-1 text-xs py-2 rounded-lg font-extrabold transition-all ${
            activeTab === 'busan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🏯 韓國釜山
        </button>
      </div>

      {/* Grid of Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCAL_TIPS[activeTab].map((tip, idx) => (
          <div
            key={idx}
            className="bg-slate-50 hover:bg-indigo-50/20 border border-slate-100 rounded-xl p-4 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-sm">📌</span>
                <h4 className="text-sm font-extrabold text-slate-800">{tip.title}</h4>
              </div>
              <p
                className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-wrap pl-5"
                dangerouslySetInnerHTML={{ __html: tip.desc }}
              />
            </div>
            {activeTab === 'busan' && tip.title.includes('防止') && (
              <div className="mt-3 pl-5 flex items-center gap-1.5 text-[10px] bg-rose-50 text-rose-700 border border-rose-100 p-1.5 rounded-lg font-extrabold">
                <Compass className="h-3.5 w-3.5 text-rose-600 animate-spin" />
                防詐重點：認明橘色計程車，看好跳錶 (Meter) 再出發！
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
