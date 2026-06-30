/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Spot } from '../types';
import { Calendar, Clock, AlertTriangle, ArrowRight, Compass, ShieldAlert, CheckSquare, Square } from 'lucide-react';

interface ItineraryBuilderProps {
  spotsSaseho: Spot[];
  spotsBusan: Spot[];
  updateSpot: (port: 'saseho' | 'busan', spotId: string, updates: Partial<Spot>) => Promise<void>;
}

export default function ItineraryBuilder({ spotsSaseho, spotsBusan, updateSpot }: ItineraryBuilderProps) {
  const [activePort, setActivePort] = useState<'saseho' | 'busan'>('saseho');
  const [dwellTime, setDwellTime] = useState<number>(90); // default 90 mins per spot
  const [transitTime, setTransitTime] = useState<number>(30); // default 30 mins transit

  const currentSpots = activePort === 'saseho' ? spotsSaseho : spotsBusan;
  const selectedSpots = currentSpots.filter(s => s.selectedInItinerary);

  // Port config
  const portConfig = {
    saseho: {
      name: '佐世保',
      disembark: '10:00',
      disembarkMins: 600, // 10 * 60
      mustReturn: '18:30',
      mustReturnMins: 1110, // 18.5 * 60
      maxHours: 8.5
    },
    busan: {
      name: '釜山',
      disembark: '07:30',
      disembarkMins: 450, // 7.5 * 60
      mustReturn: '15:30',
      mustReturnMins: 930, // 15.5 * 60
      maxHours: 8.0
    }
  };

  const activePortConfig = portConfig[activePort];

  // Toggle selection
  const handleToggleSelect = async (spot: Spot) => {
    await updateSpot(activePort, spot.id, {
      selectedInItinerary: !spot.selectedInItinerary
    });
  };

  // Build timeline
  let timelineItems: Array<{
    type: 'spot' | 'transit' | 'return';
    timeString: string;
    label: string;
    duration?: number;
    spot?: Spot;
  }> = [];

  let totalMinsUsed = 0;
  let hasExceeded = false;

  if (selectedSpots.length > 0) {
    let currentMins = activePortConfig.disembarkMins;

    selectedSpots.forEach((spot, index) => {
      // 1. Add Spot
      const startHour = Math.floor(currentMins / 60);
      const startMin = currentMins % 60;
      const endMins = currentMins + dwellTime;
      const endHour = Math.floor(endMins / 60);
      const endMin = endMins % 60;

      const timeString = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      timelineItems.push({
        type: 'spot',
        timeString,
        label: spot.name,
        duration: dwellTime,
        spot
      });

      currentMins = endMins;
      totalMinsUsed += dwellTime;

      // 2. Add Transit if not the last item
      if (index < selectedSpots.length - 1) {
        const transitEnd = currentMins + transitTime;
        const transStartH = Math.floor(currentMins / 60);
        const transStartM = currentMins % 60;
        const transEndH = Math.floor(transitEnd / 60);
        const transEndM = transitEnd % 60;

        const transTimeString = `${String(transStartH).padStart(2, '0')}:${String(transStartM).padStart(2, '0')} ➔ ${String(transEndH).padStart(2, '0')}:${String(transEndM).padStart(2, '0')}`;

        timelineItems.push({
          type: 'transit',
          timeString: transTimeString,
          label: `交通接駁／搭車中 (約 ${transitTime} 分鐘)`,
          duration: transitTime
        });

        currentMins = transitEnd;
        totalMinsUsed += transitTime;
      }
    });

    // 3. Add Final Return to Ship
    const returnStartH = Math.floor(currentMins / 60);
    const returnStartM = currentMins % 60;
    const finalReturnString = `${String(returnStartH).padStart(2, '0')}:${String(returnStartM).padStart(2, '0')} ➔ ${activePortConfig.mustReturn}`;

    timelineItems.push({
      type: 'return',
      timeString: finalReturnString,
      label: '返回郵輪準備登船'
    });

    // Check if exceeded limit
    hasExceeded = currentMins > activePortConfig.mustReturnMins;
  }

  const hoursUsed = Math.round((totalMinsUsed / 60) * 10) / 10;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          我們的自由行「終極排程計畫」
        </h3>
        <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="h-3 w-3" /> 避開上下船前後
        </span>
      </div>

      <p className="text-slate-500 text-xs font-bold leading-relaxed">
        從大家在下方新增的討論景點中，<b>勾選想排進當日行程的選項</b>。系統會排除排隊上下船所需的前後安全緩衝時間，自動為您估算出每站建議停留時間、交通轉乘與時間總長警告！
      </p>

      {/* Port Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs gap-1">
        <button
          onClick={() => setActivePort('saseho')}
          className={`flex-1 text-xs py-2 rounded-lg font-extrabold transition-all ${
            activePort === 'saseho' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ⛩️ 佐世保排程
        </button>
        <button
          onClick={() => setActivePort('busan')}
          className={`flex-1 text-xs py-2 rounded-lg font-extrabold transition-all ${
            activePort === 'busan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🏯 釜山排程
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: checkboxes to select spots */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col h-[380px]">
          <span className="text-xs font-extrabold text-slate-500 mb-3 block">
            選擇想排入【{activePortConfig.name}】的景點
          </span>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
            {currentSpots.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-medium">
                目前討論區尚無景點，請先在下方新增想去的景點喔！
              </div>
            ) : (
              currentSpots.map(s => {
                const isSelected = !!s.selectedInItinerary;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleToggleSelect(s)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                        : 'bg-white border-slate-200/60 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isSelected ? (
                        <CheckSquare className="h-4.5 w-4.5 text-indigo-600 flex-none" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300 flex-none" />
                      )}
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs truncate">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">推薦者：{s.author}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                      👍 {s.voters?.length || 0}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: timeline output and warnings */}
        <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Safe buffer and timeline summary */}
            <div className="flex items-center justify-between flex-wrap gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/30 text-xs">
              <span className="font-extrabold text-indigo-950">
                🚀 上岸出發時間：<span className="font-mono text-indigo-600">{activePortConfig.disembark}</span>
              </span>
              <span className="font-extrabold text-indigo-950">
                ⚓ 回到港口時限：<span className="font-mono text-indigo-600">{activePortConfig.mustReturn}</span>
              </span>
              <span className="font-extrabold text-indigo-950 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                安全可玩 {activePortConfig.maxHours} 小時
              </span>
            </div>

            {/* Dwell time sliders */}
            {selectedSpots.length > 0 && (
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1">
                    景點停留時長 ({dwellTime} 分鐘)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="15"
                    value={dwellTime}
                    onChange={e => setDwellTime(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1">
                    景點間平均車程 ({transitTime} 分鐘)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={transitTime}
                    onChange={e => setTransitTime(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Warning banner */}
            {hasExceeded && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-700 flex items-start gap-2.5 shadow-sm animate-pulse">
                <ShieldAlert className="h-5 w-5 text-rose-600 flex-none mt-0.5" />
                <div className="font-bold leading-normal">
                  <b>⚠️ 注意：行程總時長已超過港口時限！</b>
                  <br />
                  估算已用時長為 {hoursUsed} 小時 (加乘交通與停留時間)，已超過可玩的 {activePortConfig.maxHours} 小時！建議刪減一些勾選景點，或者縮短停留時間，以免錯過郵輪離港 (船是不等人的喔！)。
                </div>
              </div>
            )}

            {/* Timeline sequence display */}
            <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
              {selectedSpots.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center">
                  <Compass className="h-10 w-10 text-slate-200 mb-2" />
                  請勾選左側想去的景點，自動生成推薦行程表！
                </div>
              ) : (
                <div className="relative border-l border-indigo-100 pl-4 ml-2.5 py-1 space-y-4">
                  {/* Port start */}
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-indigo-600" />
                  
                  {timelineItems.map((item, idx) => {
                    if (item.type === 'spot') {
                      return (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                          <div className="text-[10px] font-bold font-mono text-indigo-600">{item.timeString}</div>
                          <div className="text-xs font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                            📍 {item.label}
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1 py-0.5 rounded">
                              待 {item.duration} 分鐘
                            </span>
                          </div>
                        </div>
                      );
                    } else if (item.type === 'transit') {
                      return (
                        <div key={idx} className="relative pl-2.5 py-1 border-l border-dashed border-slate-300 -ml-4">
                          <div className="text-[10px] font-bold text-slate-400 font-mono">{item.timeString}</div>
                          <div className="text-[10px] font-bold text-slate-500 mt-0.5 flex items-center gap-1">
                            🚗 {item.label}
                          </div>
                        </div>
                      );
                    } else {
                      // return
                      return (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white animate-ping" />
                          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white" />
                          <div className="text-[10px] font-bold font-mono text-amber-600">{item.timeString}</div>
                          <div className="text-xs font-extrabold text-amber-800 mt-0.5">
                            ⚓ {item.label}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
