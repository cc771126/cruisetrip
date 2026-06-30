/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Memo } from '../types';
import { Notebook, Trash2, Edit3, Check, X, FileText, Camera, Plus, Image as ImageIcon } from 'lucide-react';

interface MemoSectionProps {
  memos: Memo[];
  meName: string | null;
  addMemo: (text: string, images?: string[]) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  updateMemo: (id: string, text: string, images?: string[]) => Promise<void>;
}

export default function MemoSection({ memos, meName, addMemo, deleteMemo, updateMemo }: MemoSectionProps) {
  const [newMemo, setNewMemo] = useState<string>('');
  const [newMemoImages, setNewMemoImages] = useState<string[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [editingImages, setEditingImages] = useState<string[]>([]);
  
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert images to Base64 (max width 400, max height 300)
  const handleImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (!files) return;

    const base64Promises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            resolve(dataUrl);
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
      });
    });

    try {
      const results = await Promise.all(base64Promises);
      if (isEdit) {
        setEditingImages(prev => [...prev, ...results]);
      } else {
        setNewMemoImages(prev => [...prev, ...results]);
      }
    } catch (err) {
      alert('圖片上傳失敗，請重試！');
    }
  };

  const removeImage = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewMemoImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meName) return;
    if (!newMemo.trim()) return;

    await addMemo(newMemo.trim(), newMemoImages);
    setNewMemo('');
    setNewMemoImages([]);
  };

  const startEdit = (memo: Memo) => {
    setEditingId(memo.id);
    setEditingText(memo.text);
    setEditingImages(memo.images || []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingImages([]);
  };

  const saveEdit = async (id: string) => {
    if (!editingText.trim()) return;
    await updateMemo(id, editingText.trim(), editingImages);
    setEditingId(null);
    setEditingText('');
    setEditingImages([]);
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
        在這裡記下房號、WiFi帳號密碼、訂位代號、領隊聯絡資料或集合提醒，支援上傳車票、景點票根相片，所有人開啟同個網頁都能立即同步與紀錄！
      </p>

      {/* Memo list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin">
        {memos.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <FileText className="h-8 w-8 text-slate-300 mb-2" />
            目前筆記本空空如也，快在下方新增一筆吧！
          </div>
        ) : (
          memos.map((m) => {
            const isEditing = editingId === m.id;
            return (
              <div
                key={m.id}
                className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition-all"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-y h-36 font-bold !text-slate-800 !bg-white placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500"
                      placeholder="修改您的備忘筆記..."
                    />
                    
                    {/* Editing Images Section */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold text-slate-500 flex items-center gap-1">
                        <Camera className="h-3.5 w-3.5 text-indigo-500" />
                        修改/搭配票根、相片
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="h-8 border border-dashed border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-500 font-extrabold text-[10px] px-3 rounded-lg flex items-center gap-1 transition-all bg-white"
                        >
                          <Plus className="h-3 w-3" /> 新增相片
                        </button>
                        <input
                          type="file"
                          ref={editFileInputRef}
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUploadChange(e, true)}
                          className="hidden"
                        />
                      </div>

                      {editingImages.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                          {editingImages.map((img, idx) => (
                            <div key={idx} className="relative h-24 w-32 flex-none rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                              <img src={img} alt="Editing" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx, true)}
                                className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 h-6 w-6 rounded-full flex items-center justify-center text-xs text-white"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1 border-t border-slate-200/50">
                      <button
                        onClick={cancelEdit}
                        className="p-1 px-2.5 text-slate-500 hover:text-slate-700 rounded bg-slate-200/60 hover:bg-slate-200 text-[10px] font-black flex items-center gap-1 transition-all"
                        title="取消"
                      >
                        <X className="h-3 w-3" /> 取消
                      </button>
                      <button
                        onClick={() => saveEdit(m.id)}
                        className="p-1 px-3 text-white bg-emerald-500 hover:bg-emerald-600 rounded text-[10px] font-black flex items-center gap-1 transition-all shadow-sm"
                        title="儲存"
                      >
                        <Check className="h-3 w-3" /> 儲存修改
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold text-slate-800 whitespace-pre-wrap break-all leading-relaxed">
                      {m.text}
                    </p>

                    {/* Render uploaded image thumbnails */}
                    {m.images && m.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2 mt-2 scrollbar-thin">
                        {m.images.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedLightboxImage(img)}
                            className="relative h-24 w-32 flex-none rounded-xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer hover:border-indigo-400 hover:scale-[1.02] transition-all"
                            title="點擊放大檢視"
                          >
                            <img src={img} alt="Ticket stub" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/10 hover:bg-transparent transition-all" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-200/50 pt-2 mt-3">
                      <span className="text-[10px] font-bold text-slate-400">
                        ✍️ {m.author} · {new Date(m.created).toLocaleDateString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(m)}
                          className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition-colors"
                          title="修改"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMemo(m.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
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

      {/* Input form with expanded layout */}
      {!meName ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 font-bold text-center">
          請先在下方「討論區」輸入您的暱稱，才能撰寫備忘錄筆記！
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 border border-slate-100/50 rounded-2xl p-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-slate-500 block">📝 備忘與筆記內容（無字數限制）</span>
            <textarea
              placeholder="在此輸入備忘、房間號碼、WiFi 帳密、訂位代號、交通票券、或領隊與集合重要資訊... ✍️"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              className="w-full h-36 border border-slate-200 rounded-xl p-3 bg-white text-xs font-bold !text-slate-800 !bg-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-y focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Ticket/Image upload area */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-slate-500 block flex items-center gap-1">
              <Camera className="h-3.5 w-3.5 text-indigo-500" />
              搭配票根/憑證/相片（可選，適合拍照備份以防萬一）
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 border border-dashed border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-500 font-extrabold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-all bg-white"
              >
                <Plus className="h-4 w-4" /> 選擇相片/票根
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={(e) => handleImageUploadChange(e, false)}
                className="hidden"
              />
            </div>

            {newMemoImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2 pr-1 mt-2 scrollbar-thin">
                {newMemoImages.map((img, idx) => (
                  <div key={idx} className="relative h-24 w-32 flex-none rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                    <img src={img} alt="Uploaded stub" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx, false)}
                      className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 h-6 w-6 rounded-full flex items-center justify-center text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!newMemo.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 px-6 rounded-xl transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> 新增至備忘錄
            </button>
          </div>
        </form>
      )}

      {/* Lightbox Modal for Fullscreen Reference Images */}
      {selectedLightboxImage && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <img src={selectedLightboxImage} alt="Reference ticket stub" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <button 
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute top-4 right-4 bg-slate-900/80 hover:bg-rose-600 text-white p-2 rounded-full transition-all"
              title="關閉"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-3 text-center text-xs font-black text-slate-500">
              📌 點擊任何地方或右上角關閉
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
