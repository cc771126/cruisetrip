/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { database, dbMode, checkLocalStorageUsable } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { Spot, Expense, Memo, WishlistItem } from '../types';

export function colorFor(name: string): string {
  const colors = [
    "#ef6b3f", "#1597a5", "#c0567f", "#7c63d8", "#2bb673",
    "#e0a72e", "#5a7385", "#d8556e", "#3a86c8", "#e2622f"
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  return colors[Math.abs(h) % colors.length];
}

export const DEFAULT_SASEHO_SPOTS: Spot[] = [
  {
    id: "saseho_spot_1",
    name: "YAMADA DENKI",
    cat: "sight",
    note: "最後一站去買百慕達烤箱 (BALMUDA the toaster pro)",
    cost: "",
    map: "https://maps.google.com/?q=Yamada+Denki+Saseho",
    author: "Rebecca",
    color: colorFor("Rebecca"),
    voters: ["Rebecca"],
    created: 1719700000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_2",
    name: "返船捷徑",
    cat: "other",
    note: "四町街盡頭「尼米茲公園」有直達碼頭的公車，比步行快 10 分鐘（車資 200 日圓）。",
    cost: "",
    map: "",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719701000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_3",
    name: "【購物避坑指南】",
    cat: "shop",
    note: "⚠️ 藥妝店比價：四町街「ダイコクドラッグ」比松本清便宜，但注意！郵輪旅客買滿 5000 日圓可免稅，結帳時出示護照影本。\n\n⚠️ 電器店陷阱：四町街電器店標價不含稅，需另加10%，建議使用支付寶即時匯率結算，會比較透明。",
    cost: "",
    map: "",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719702000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_4",
    name: "【10 元吃垮佐世保】",
    cat: "food",
    note: "■ Bigman 漢堡邊角料：五番街本店每天 17:00 後半價販售「肉餅邊角料漢堡」，起司加倍！（人潮太多可pass）\n\n■ 松月堂海軍咖哩麵包：四町街老店隱藏款，加入長崎和牛油渣提香，8元一個，搭配咖哩香腸超絕。\n\n■ 大庄水產生魚片拼盤：四町街海鮮居酒屋，生魚片拼盤非常新鮮，高CP值且分量十足！",
    cost: "",
    map: "",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719703000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_5",
    name: "【0 元拍出好照片玄學】",
    cat: "other",
    note: "✅ 五番街頂樓停車場：搭商場電梯到頂樓，解鎖俯瞰佐世保港的絕佳機位！郵輪＋彩色屋頂同框，濾鏡用「昭和復古」，秒變日劇截圖。\n\n✅ 四町街拱廊光影：中午陽光透過玻璃屋頂灑下來，站在「四町街」燈牌下仰拍，搭配文案「穿越昭和商店街」，超容易出片。",
    cost: "",
    map: "",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719704000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_6",
    name: "【下船必知！超省時路線】",
    cat: "shop",
    note: "1️⃣ 碼頭 ➔ 五番街：下船後直走 500 公尺（約 10 分鐘），導航搜尋「五番街塩浜通り商店会」，沿途有彩色壁畫可以拍照。\n\n2️⃣ 五番街 ➔ 四町街：兩個商圈相距僅 500 公尺，步行穿過拱廊街即可抵達，全程有遮陽，不怕曬。",
    cost: "",
    map: "",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719705000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_7",
    name: "四ヶ町商店街/佐世保五番街",
    cat: "shop",
    note: "超市、松本清、Muji、Uniqlo、倉式咖啡☕、岩石屋甜點🍮",
    cost: "",
    map: "https://maps.google.com/?q=Saseho+Yomachi+Shopping+Street",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719706000000,
    selectedInItinerary: false
  },
  {
    id: "saseho_spot_8",
    name: "白岳神社⛩️",
    cat: "sight",
    note: "可以🚕從五番街前往（約3公里），看看風景、蒐集御朱印、祈求好運🙏",
    cost: "",
    map: "https://maps.google.com/?q=Shiradake+Shrine+Saseho",
    author: "Erin",
    color: colorFor("Erin"),
    voters: ["Erin"],
    created: 1719707000000,
    selectedInItinerary: false
  }
];

function mergeDefaultSpots(currentSpots: Spot[], defaultSpots: Spot[]): { merged: Spot[], changed: boolean } {
  let changed = false;
  const merged = [...currentSpots];
  
  defaultSpots.forEach(defSpot => {
    const exists = merged.some(s => s.name.trim().toLowerCase() === defSpot.name.trim().toLowerCase());
    if (!exists) {
      merged.push(defSpot);
      changed = true;
    }
  });
  
  // Sort by created time
  merged.sort((a, b) => a.created - b.created);
  
  return { merged, changed };
}

export function useCollaborativeState() {
  // Current user nickname & color
  const [me, setMe] = useState<{ name: string | null; color: string | null }>({
    name: null,
    color: null
  });

  // Collaborative Lists
  const [spotsSaseho, setSpotsSaseho] = useState<Spot[]>([]);
  const [spotsBusan, setSpotsBusan] = useState<Spot[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});

  // Load Nickname from LocalStorage on mount
  useEffect(() => {
    if (checkLocalStorageUsable()) {
      const savedName = localStorage.getItem('cruise:me-name');
      const savedColor = localStorage.getItem('cruise:me-color');
      if (savedName) {
        setMe({
          name: savedName,
          color: savedColor || colorFor(savedName)
        });
      }
    }
  }, []);

  // Syncing with Realtime Database (or LocalStorage as fallback)
  useEffect(() => {
    if (dbMode === 'cloud' && database) {
      // 1. Listen to Saseho Spots (Auto-merges user's yesterday's itinerary discussion data)
      const sasehoRef = ref(database, 'cruise-115/spots-saseho');
      const unsubSaseho = onValue(sasehoRef, (snapshot) => {
        const val = snapshot.val();
        const currentList: Spot[] = val ? (Array.isArray(val) ? val : Object.values(val)) : [];
        const { merged, changed } = mergeDefaultSpots(currentList, DEFAULT_SASEHO_SPOTS);
        
        if (changed) {
          set(sasehoRef, merged);
        }
        setSpotsSaseho(merged);
      });

      // 2. Listen to Busan Spots
      const busanRef = ref(database, 'cruise-115/spots-busan');
      const unsubBusan = onValue(busanRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setSpotsBusan(Array.isArray(val) ? val : Object.values(val));
        } else {
          setSpotsBusan([]);
        }
      });

      // 3. Listen to Expenses
      const expensesRef = ref(database, 'cruise-115/expenses');
      const unsubExpenses = onValue(expensesRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setExpenses(Array.isArray(val) ? val : Object.values(val));
        } else {
          setExpenses([]);
        }
      });

      // 4. Listen to Memos
      const memosRef = ref(database, 'cruise-115/memos');
      const unsubMemos = onValue(memosRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setMemos(Array.isArray(val) ? val : Object.values(val));
        } else {
          setMemos([]);
        }
      });

      // 5. Listen to Wishlist
      const wishlistRef = ref(database, 'cruise-115/wishlist');
      const unsubWishlist = onValue(wishlistRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setWishlist(Array.isArray(val) ? val : Object.values(val));
        } else {
          setWishlist([]);
        }
      });

      // 6. Listen to Packing Checklist
      const checklistRef = ref(database, 'cruise-115/checklist');
      const unsubChecklist = onValue(checklistRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setChecklist(val);
        } else {
          setChecklist({});
        }
      });

      return () => {
        unsubSaseho();
        unsubBusan();
        unsubExpenses();
        unsubMemos();
        unsubWishlist();
        unsubChecklist();
      };
    } else {
      // Offline fallback: load from LocalStorage with auto-merging of default Saseho spots
      if (checkLocalStorageUsable()) {
        try {
          const rawSaseho = localStorage.getItem('cruise:spots-saseho');
          const rawBusan = localStorage.getItem('cruise:spots-busan');
          const rawExpenses = localStorage.getItem('cruise:expenses');
          const rawMemos = localStorage.getItem('cruise:memos');
          const rawWishlist = localStorage.getItem('cruise:wishlist');
          const rawChecklist = localStorage.getItem('cruise:prep-checklist');

          let sasehoList: Spot[] = [];
          if (rawSaseho) {
            try {
              sasehoList = JSON.parse(rawSaseho);
            } catch (e) {
              sasehoList = [];
            }
          }
          const { merged, changed } = mergeDefaultSpots(sasehoList, DEFAULT_SASEHO_SPOTS);
          if (changed) {
            localStorage.setItem('cruise:spots-saseho', JSON.stringify(merged));
          }
          setSpotsSaseho(merged);

          if (rawBusan) setSpotsBusan(JSON.parse(rawBusan));
          if (rawExpenses) setExpenses(JSON.parse(rawExpenses));
          if (rawMemos) setMemos(JSON.parse(rawMemos));
          if (rawWishlist) setWishlist(JSON.parse(rawWishlist));
          if (rawChecklist) setChecklist(JSON.parse(rawChecklist));
        } catch (e) {
          console.error('Error loading fallback states', e);
        }
      }
    }
  }, []);

  // Helper helper to write state to cloud/local
  const saveState = async (key: string, value: any) => {
    if (dbMode === 'cloud' && database) {
      try {
        await set(ref(database, `cruise-115/${key}`), value);
      } catch (e) {
        console.error(`Error saving ${key} to Firebase`, e);
      }
    } else {
      if (checkLocalStorageUsable()) {
        localStorage.setItem(`cruise:${key}`, JSON.stringify(value));
      }
    }
  };

  // ----- USER ACTION IMPLEMENTATIONS -----

  const saveName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = colorFor(trimmed);
    setMe({ name: trimmed, color });
    if (checkLocalStorageUsable()) {
      localStorage.setItem('cruise:me-name', trimmed);
      localStorage.setItem('cruise:me-color', color);
    }
  };

  const changeName = () => {
    setMe({ name: null, color: null });
    if (checkLocalStorageUsable()) {
      localStorage.removeItem('cruise:me-name');
      localStorage.removeItem('cruise:me-color');
    }
  };

  // 1. SPOTS Actions
  const addSpot = async (
    port: 'saseho' | 'busan',
    spot: { name: string; cat: string; note: string; cost: string; map: string; images?: string[] }
  ) => {
    if (!me.name) return;
    const currentSpots = port === 'saseho' ? spotsSaseho : spotsBusan;
    const newSpot: Spot = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: spot.name,
      cat: spot.cat,
      note: spot.note,
      cost: spot.cost,
      map: spot.map,
      author: me.name,
      color: me.color || '#1597a5',
      voters: [me.name],
      created: Date.now(),
      images: spot.images || [],
      selectedInItinerary: false
    };

    const updated = [...currentSpots, newSpot];
    if (port === 'saseho') {
      setSpotsSaseho(updated);
      await saveState('spots-saseho', updated);
    } else {
      setSpotsBusan(updated);
      await saveState('spots-busan', updated);
    }
  };

  const updateSpot = async (port: 'saseho' | 'busan', spotId: string, updates: Partial<Spot>) => {
    const currentSpots = port === 'saseho' ? spotsSaseho : spotsBusan;
    const updated = currentSpots.map((s) => {
      if (s.id === spotId) {
        return { ...s, ...updates };
      }
      return s;
    });

    if (port === 'saseho') {
      setSpotsSaseho(updated);
      await saveState('spots-saseho', updated);
    } else {
      setSpotsBusan(updated);
      await saveState('spots-busan', updated);
    }
  };

  const deleteSpot = async (port: 'saseho' | 'busan', spotId: string) => {
    const currentSpots = port === 'saseho' ? spotsSaseho : spotsBusan;
    const updated = currentSpots.filter((s) => s.id !== spotId);

    if (port === 'saseho') {
      setSpotsSaseho(updated);
      await saveState('spots-saseho', updated);
    } else {
      setSpotsBusan(updated);
      await saveState('spots-busan', updated);
    }
  };

  const toggleVote = async (port: 'saseho' | 'busan', spotId: string) => {
    if (!me.name) return;
    const userName = me.name;
    const currentSpots = port === 'saseho' ? spotsSaseho : spotsBusan;
    const updated = currentSpots.map((s) => {
      if (s.id === spotId) {
        const voters = s.voters || [];
        const index = voters.indexOf(userName);
        if (index >= 0) {
          // Remove vote
          const newVoters = [...voters];
          newVoters.splice(index, 1);
          return { ...s, voters: newVoters };
        } else {
          // Add vote
          return { ...s, voters: [...voters, userName] };
        }
      }
      return s;
    });

    if (port === 'saseho') {
      setSpotsSaseho(updated);
      await saveState('spots-saseho', updated);
    } else {
      setSpotsBusan(updated);
      await saveState('spots-busan', updated);
    }
  };

  // 2. EXPENSES Actions
  const addExpense = async (description: string, amount: number, currency: 'TWD' | 'JPY' | 'KRW') => {
    if (!me.name) return;
    const rates = { TWD: 1, JPY: 0.21, KRW: 0.024 }; // Approximate exchange rates
    const amountTWD = Math.round(amount * rates[currency]);

    const newExpense: Expense = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      payer: me.name,
      description,
      amount,
      currency,
      amountTWD,
      created: Date.now()
    };

    const updated = [...expenses, newExpense];
    setExpenses(updated);
    await saveState('expenses', updated);
  };

  const deleteExpense = async (expenseId: string) => {
    const updated = expenses.filter((e) => e.id !== expenseId);
    setExpenses(updated);
    await saveState('expenses', updated);
  };

  // 3. MEMOS Actions
  const addMemo = async (text: string) => {
    if (!me.name) return;
    const newMemo: Memo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      author: me.name,
      text,
      created: Date.now()
    };

    const updated = [...memos, newMemo];
    setMemos(updated);
    await saveState('memos', updated);
  };

  const deleteMemo = async (memoId: string) => {
    const updated = memos.filter((m) => m.id !== memoId);
    setMemos(updated);
    await saveState('memos', updated);
  };

  const updateMemo = async (memoId: string, text: string) => {
    const updated = memos.map((m) => {
      if (m.id === memoId) {
        return { ...m, text };
      }
      return m;
    });
    setMemos(updated);
    await saveState('memos', updated);
  };

  // 4. WISHLIST Actions
  const addWishlistItem = async (name: string, category: WishlistItem['category']) => {
    if (!me.name) return;
    const newItem: WishlistItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name,
      category,
      addedBy: me.name,
      completed: false,
      created: Date.now()
    };

    const updated = [...wishlist, newItem];
    setWishlist(updated);
    await saveState('wishlist', updated);
  };

  const toggleWishlistItem = async (itemId: string) => {
    const updated = wishlist.map((item) => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setWishlist(updated);
    await saveState('wishlist', updated);
  };

  const deleteWishlistItem = async (itemId: string) => {
    const updated = wishlist.filter((item) => item.id !== itemId);
    setWishlist(updated);
    await saveState('wishlist', updated);
  };

  // 5. CHECKLIST Actions
  const toggleChecklistItem = async (index: number) => {
    const updated = { ...checklist, [index]: !checklist[index] };
    setChecklist(updated);
    if (dbMode === 'cloud' && database) {
      try {
        await set(ref(database, 'cruise-115/checklist'), updated);
      } catch (e) {
        console.error('Error saving checklist to Firebase', e);
      }
    } else {
      if (checkLocalStorageUsable()) {
        localStorage.setItem('cruise:prep-checklist', JSON.stringify(updated));
      }
    }
  };

  return {
    me,
    spotsSaseho,
    spotsBusan,
    expenses,
    memos,
    wishlist,
    checklist,
    dbMode,
    saveName,
    changeName,
    addSpot,
    updateSpot,
    deleteSpot,
    toggleVote,
    addExpense,
    deleteExpense,
    addMemo,
    deleteMemo,
    updateMemo,
    addWishlistItem,
    toggleWishlistItem,
    deleteWishlistItem,
    toggleChecklistItem
  };
}
