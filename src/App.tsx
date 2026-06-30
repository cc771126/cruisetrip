/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Ship, Calendar, HelpCircle, Heart, Trash2, Edit3, Check, X, 
  MapPin, DollarSign, Tag, Navigation, Flame, Sparkles, ChevronLeft, 
  ChevronRight, Camera, HelpCircle as InfoIcon, CheckCircle2, ChevronDown, 
  AlertTriangle, Eye, Compass, MessageSquare, ListTodo, Plus
} from 'lucide-react';

import { DAYS, SHIP, NOTES, CONFIRM, CHECKLIST, CATS, IDEAS, TOUR } from './data';
import { Spot, Expense, Memo, WishlistItem } from './types';
import { useCollaborativeState, colorFor } from './hooks/useCollaborativeState';

// Subcomponents
import WeatherWidget from './components/WeatherWidget';
import ExpenseTracker from './components/ExpenseTracker';
import ItineraryBuilder from './components/ItineraryBuilder';
import MemoSection from './components/MemoSection';
import ShoppingSection from './components/ShoppingSection';
import LocalTipsSection from './components/LocalTipsSection';

const MiniShip = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg viewBox="0 0 460 300" className={className}>
    <path d="M70 142 H360 L335 196 Q330 206 318 206 H112 Q100 206 95 196 Z" fill="currentColor" />
    <path d="M82 168 H348 L341 182 H88 Z" fill="#4f46e5" opacity="0.85" />
    <rect x="120" y="120" width="190" height="22" rx="6" fill="#ffffff" />
    <rect x="140" y="98" width="150" height="24" rx="6" fill="#f8fafc" />
    <rect x="160" y="78" width="110" height="22" rx="6" fill="#ffffff" />
    <rect x="180" y="56" width="20" height="26" rx="5" fill="#1e1b4b" />
    <rect x="210" y="56" width="20" height="26" rx="5" fill="#3b82f6" />
    <g fill="#cbd5e1">
      <circle cx="120" cy="155" r="5" /><circle cx="145" cy="155" r="5" />
      <circle cx="170" cy="155" r="5" /><circle cx="195" cy="155" r="5" />
    </g>
  </svg>
);

const MSC_CruiseShip_With_Sunset = ({ className = "w-full h-auto" }: { className?: string }) => (
  <svg viewBox="0 0 500 320" className={className}>
    {/* Golden/Orange Sunset Sun */}
    <circle cx="360" cy="130" r="110" fill="url(#sunset-grad)" />
    
    {/* Sun glow & reflection gradients */}
    <defs>
      <linearGradient id="sunset-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />      {/* Yellow-200 */}
        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.95" />    {/* Amber-500 */}
        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />    {/* Orange-600 */}
      </linearGradient>
      <linearGradient id="hull-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="85%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>
    
    {/* Ship body / hull */}
    {/* Lower hull (Navy blue base) */}
    <path d="M 60,210 L 410,210 L 390,255 Q 380,265 365,265 L 105,265 Q 90,265 82,255 Z" fill="#0f172a" />
    
    {/* Waterline stripe (MSC signature style light blue / turquoise stripe) */}
    <path d="M 72,195 H 418 L 412,210 H 77 Z" fill="#38bdf8" />
    
    {/* Upper hull (White main body) */}
    <path d="M 80,140 H 390 L 424,195 H 68 Z" fill="url(#hull-grad)" />
    
    {/* Portholes (Little round window dots on the white hull) */}
    <g fill="#475569" opacity="0.65">
      <circle cx="100" cy="170" r="4.5" />
      <circle cx="130" cy="170" r="4.5" />
      <circle cx="160" cy="170" r="4.5" />
      <circle cx="190" cy="170" r="4.5" />
      <circle cx="220" cy="170" r="4.5" />
      <circle cx="250" cy="170" r="4.5" />
      <circle cx="280" cy="170" r="4.5" />
      <circle cx="310" cy="170" r="4.5" />
      <circle cx="340" cy="170" r="4.5" />
      <circle cx="370" cy="170" r="4.5" />
    </g>
    
    {/* Main decks (Multi-tier white cabins) */}
    {/* Deck 1 */}
    <rect x="110" y="112" width="265" height="28" rx="5" fill="#ffffff" />
    {/* Deck 2 */}
    <rect x="135" y="84" width="220" height="28" rx="5" fill="#f8fafc" />
    {/* Deck 3 */}
    <rect x="165" y="58" width="165" height="26" rx="5" fill="#ffffff" />
    
    {/* Deck Cabin Windows (Indigo/blue glass look) */}
    <g fill="#1e3a8a" opacity="0.8">
      {/* Deck 1 windows */}
      <rect x="130" y="120" width="12" height="12" rx="2" />
      <rect x="150" y="120" width="12" height="12" rx="2" />
      <rect x="170" y="120" width="12" height="12" rx="2" />
      <rect x="190" y="120" width="12" height="12" rx="2" />
      <rect x="210" y="120" width="12" height="12" rx="2" />
      <rect x="230" y="120" width="12" height="12" rx="2" />
      <rect x="250" y="120" width="12" height="12" rx="2" />
      <rect x="270" y="120" width="12" height="12" rx="2" />
      <rect x="290" y="120" width="12" height="12" rx="2" />
      <rect x="310" y="120" width="12" height="12" rx="2" />
      <rect x="330" y="120" width="12" height="12" rx="2" />
      
      {/* Deck 2 windows */}
      <rect x="155" y="92" width="10" height="12" rx="1.5" />
      <rect x="175" y="92" width="10" height="12" rx="1.5" />
      <rect x="195" y="92" width="10" height="12" rx="1.5" />
      <rect x="215" y="92" width="10" height="12" rx="1.5" />
      <rect x="235" y="92" width="10" height="12" rx="1.5" />
      <rect x="255" y="92" width="10" height="12" rx="1.5" />
      <rect x="275" y="92" width="10" height="12" rx="1.5" />
      <rect x="295" y="92" width="10" height="12" rx="1.5" />
      <rect x="315" y="92" width="10" height="12" rx="1.5" />
      
      {/* Deck 3 windows */}
      <rect x="180" y="65" width="10" height="10" rx="1.5" />
      <rect x="200" y="65" width="10" height="10" rx="1.5" />
      <rect x="220" y="65" width="10" height="10" rx="1.5" />
      <rect x="240" y="65" width="10" height="10" rx="1.5" />
      <rect x="260" y="65" width="10" height="10" rx="1.5" />
      <rect x="280" y="65" width="10" height="10" rx="1.5" />
      <rect x="300" y="65" width="10" height="10" rx="1.5" />
    </g>
    
    {/* Funnels (MSC signature style colors) */}
    {/* Funnel 1 */}
    <rect x="190" y="28" width="18" height="30" rx="3" fill="#1e293b" />
    <path d="M 190,28 H 208 L 206,22 H 192 Z" fill="#38bdf8" />
    
    {/* Funnel 2 */}
    <rect x="225" y="24" width="22" height="34" rx="4" fill="#0f172a" />
    <path d="M 225,24 H 247 L 245,18 H 227 Z" fill="#f97316" />
    
    {/* Funnel 3 */}
    <rect x="260" y="28" width="18" height="30" rx="3" fill="#1e293b" />
    <path d="M 260,28 H 278 L 276,22 H 262 Z" fill="#38bdf8" />
    
    {/* Navigation Radar / Antenna */}
    <line x1="310" y1="58" x2="310" y2="38" stroke="#475569" strokeWidth="2.5" />
    <ellipse cx="310" cy="38" rx="8" ry="3" fill="#94a3b8" />
    
    {/* MSC Text Logo printed boldly on the side hull */}
    <rect x="210" y="222" width="80" height="24" rx="6" fill="#ffffff" opacity="0.2" />
    <text x="250" y="240" textAnchor="middle" fontFamily="'Space Grotesk', 'Inter', sans-serif" fontWeight="900" fontSize="18" letterSpacing="1" fill="#ffffff">MSC</text>
    
    {/* Beautiful gentle sea waves */}
    <path d="M 30,260 Q 70,255 110,260 T 190,260 T 270,260 T 350,260 T 430,260 T 490,260" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    <path d="M 50,266 Q 95,262 140,266 T 230,266 T 320,266 T 410,266 T 480,266" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const RATE = 31.5; // JPY/KRW estimates

export default function App() {
  const {
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
  } = useCollaborativeState();

  // Navigation tabs active
  const [activeSection, setActiveSection] = useState('overview');

  // Accordion Day By Day active state
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Accordion Notes Active states
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({ 0: true });

  // Accordion Q&A Active states
  const [expandedConfirm, setExpandedConfirm] = useState<Record<number, boolean>>({ 0: true });

  // Accordion Fee reference folding
  const [feeFolded, setFeeFolded] = useState(false);

  // Countdown timer state
  const [countdown, setCountdown] = useState({ d: 0, h: '00', m: '00', s: '00' });

  // Cost calculator state
  const [calcTab, setCalcTab] = useState<'onboard' | 'offship'>('onboard');
  const [wifiPlan, setWifiPlan] = useState<'none' | 'browse' | 'stream'>('none');
  const [drinkPlan, setDrinkPlan] = useState<'none' | 'soft' | 'alcohol'>('none');
  const [diningCount, setDiningCount] = useState<number>(0);
  const [diningCostUnit, setDiningCostUnit] = useState<number>(1200);
  const [extraOnboard, setExtraOnboard] = useState<number>(1000);
  const [paxCount, setPaxCount] = useState<number>(2);

  // Disembark plans
  const [sasehoMode, setSasehoMode] = useState<'none' | 'free' | 'tour'>('free');
  const [busanMode, setBusanMode] = useState<'none' | 'free' | 'tour'>('free');
  const [sasehoFreeCost, setSasehoFreeCost] = useState<number>(3400);
  const [busanFreeCost, setBusanFreeCost] = useState<number>(4300);
  const [sasehoTourSel, setSasehoTourSel] = useState<'a' | 'b'>('a');
  const [busanTourSel, setBusanTourSel] = useState<'a' | 'b'>('a');
  const [sizeSaseho, setSizeSaseho] = useState<'over' | 'under'>('over');
  const [sizeBusan, setSizeBusan] = useState<'over' | 'under'>('over');

  // Discussion forum state
  const [discPort, setDiscPort] = useState<'saseho' | 'busan'>('saseho');
  const [spotName, setSpotName] = useState('');
  const [spotCost, setSpotCost] = useState('');
  const [spotNote, setSpotNote] = useState('');
  const [spotMap, setSpotMap] = useState('');
  const [spotCategory, setSpotCategory] = useState('sight');
  const [uploadedBase64s, setUploadedBase64s] = useState<string[]>([]);
  const [spotSort, setSpotSort] = useState<'votes' | 'new'>('votes');
  const [diningTab, setDiningTab] = useState<'free' | 'paid'>('free');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showFloat, setShowFloat] = useState(false);
  const [isFloatMenuOpen, setIsFloatMenuOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState<{ port: 'saseho' | 'busan'; id: string; name: string } | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [checklistNameInput, setChecklistNameInput] = useState('');

  // In-place Spot Editing state
  const [editingSpotId, setEditingSpotId] = useState<string | null>(null);
  const [editingSpotNote, setEditingSpotNote] = useState<string>('');
  const [editingSpotMap, setEditingSpotMap] = useState<string>('');
  const [editingSpotCost, setEditingSpotCost] = useState<string>('');
  const [editingSpotImages, setEditingSpotImages] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize countdown
  useEffect(() => {
    const target = new Date("2026-07-25T17:00:00+08:00").getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / 864e5);
      diff -= d * 864e5;
      const h = Math.floor(diff / 36e5);
      diff -= h * 36e5;
      const m = Math.floor(diff / 6e4);
      diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);

      setCountdown({
        d,
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic active section scrolling tracking
  useEffect(() => {
    const handleScroll = () => {
      // If we are at the very bottom of the page, force 'shopping-list'
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection('shopping-list');
        return;
      }

      const threshold = 160; // Offset that accounts for fixed header height
      const sections = [
        { id: 'overview', cat: 'overview' },
        { id: 'daily', cat: 'overview' },
        { id: 'ship', cat: 'overview' },
        { id: 'dining', cat: 'overview' },
        { id: 'cost', cat: 'cost' },
        { id: 'notes', cat: 'cost' },
        { id: 'confirm', cat: 'cost' },
        { id: 'discuss', cat: 'discuss' },
        { id: 'itinerary-plan', cat: 'itinerary-plan' },
        { id: 'shopping-list', cat: 'shopping-list' },
        { id: 'local-tips', cat: 'shopping-list' },
        { id: 'memo-board', cat: 'shopping-list' }
      ];

      let currentCategory = 'overview';

      // 1. If we are above the first section, it's overview (Hero area)
      const firstSectionEl = document.getElementById('overview');
      if (firstSectionEl && firstSectionEl.getBoundingClientRect().top > threshold) {
        currentCategory = 'overview';
      } else {
        // 2. Find which section currently intersects the top line of the viewport (at our threshold)
        const intersectingSec = sections.find((sec) => {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            return rect.top <= threshold && rect.bottom > threshold;
          }
          return false;
        });

        if (intersectingSec) {
          currentCategory = intersectingSec.cat;
        } else {
          // 3. Fallback: Find the closest section using absolute distance to the threshold line
          let minDistance = Infinity;
          let closestCat = 'overview';
          sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              const dist = Math.abs(rect.top - threshold);
              if (dist < minDistance) {
                minDistance = dist;
                closestCat = sec.cat;
              }
            }
          });
          currentCategory = closestCat;
        }
      }

      setActiveSection((prev) => {
        if (prev !== currentCategory) {
          return currentCategory;
        }
        return prev;
      });

      // Show/hide floating button based on scroll offset
      if (window.scrollY > 300) {
        setShowFloat(true);
      } else {
        setShowFloat(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once to initialize
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll active nav button into view when activeSection changes (Horizontal only - avoids scrollIntoView conflicts!)
  useEffect(() => {
    const container = document.getElementById('nav-buttons-container');
    const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
    if (container && activeBtn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const currentScrollLeft = container.scrollLeft;
      const btnRelativeLeft = btnRect.left - containerRect.left;
      const targetScrollLeft = currentScrollLeft + btnRelativeLeft - (containerRect.width / 2) + (btnRect.width / 2);
      
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeSection]);

  // Smooth scroll spy helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const catMap: { [key: string]: string } = {
        'overview': 'overview',
        'daily': 'overview',
        'ship': 'overview',
        'dining': 'overview',
        'cost': 'cost',
        'notes': 'cost',
        'confirm': 'cost',
        'discuss': 'discuss',
        'itinerary-plan': 'itinerary-plan',
        'shopping-list': 'shopping-list',
        'local-tips': 'shopping-list',
        'memo-board': 'shopping-list'
      };
      const cat = catMap[id] || 'overview';
      setActiveSection(cat);
    }
  };

  // Image compression function
  const handleImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const MAX_WIDTH = 1800;
            const MAX_HEIGHT = 1800;
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
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            resolve(dataUrl);
          };
          img.onerror = (e) => reject(e);
        };
        reader.onerror = (e) => reject(e);
      });
    });

    try {
      const results = await Promise.all(base64Promises);
      setUploadedBase64s(prev => [...prev, ...results]);
    } catch (err) {
      alert('圖片上傳失敗，請重試！');
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedBase64s(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const MAX_WIDTH = 1800;
            const MAX_HEIGHT = 1800;
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
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            resolve(dataUrl);
          };
          img.onerror = (e) => reject(e);
        };
        reader.onerror = (e) => reject(e);
      });
    });

    try {
      const results = await Promise.all(base64Promises);
      setEditingSpotImages(prev => [...prev, ...results]);
    } catch (err) {
      alert('圖片上傳失敗，請重試！');
    }
  };

  const removeEditingSpotImage = (index: number) => {
    setEditingSpotImages(prev => prev.filter((_, i) => i !== index));
  };

  // Spot add submit
  const handleAddSpotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me.name) {
      alert('請先在下方「討論區」輸入暱稱登入！');
      return;
    }
    if (!spotName.trim()) {
      alert('景點或店名為必填欄位！');
      return;
    }

    let mapUrl = spotMap.trim();
    if (mapUrl && !/^https?:\/\//i.test(mapUrl)) {
      mapUrl = 'https://' + mapUrl;
    }

    await addSpot(discPort, {
      name: spotName.trim(),
      cat: spotCategory,
      note: spotNote.trim(),
      cost: spotCost.trim(),
      map: mapUrl,
      images: uploadedBase64s
    });

    // Reset Form
    setSpotName('');
    setSpotCost('');
    setSpotNote('');
    setSpotMap('');
    setUploadedBase64s([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add from pre-made ideas
  const handleAddFromIdea = async (name: string, cat: string) => {
    if (!me.name) {
      alert('請先輸入暱稱進入討論區喔！');
      return;
    }
    // Check if duplicate
    const currentSpots = discPort === 'saseho' ? spotsSaseho : spotsBusan;
    if (currentSpots.some(s => s.name === name)) {
      alert(`「${name}」已經在清單中囉！`);
      return;
    }

    await addSpot(discPort, {
      name,
      cat,
      note: '',
      cost: '',
      map: '',
      images: []
    });
  };

  // Start in-place edit spot
  const startEditSpot = (spot: Spot) => {
    setEditingSpotId(spot.id);
    setEditingSpotNote(spot.note);
    setEditingSpotMap(spot.map);
    setEditingSpotCost(spot.cost);
    setEditingSpotImages(spot.images || []);
  };

  const saveSpotEdit = async (port: 'saseho' | 'busan', spotId: string) => {
    let mapUrl = editingSpotMap.trim();
    if (mapUrl && !/^https?:\/\//i.test(mapUrl)) {
      mapUrl = 'https://' + mapUrl;
    }

    await updateSpot(port, spotId, {
      note: editingSpotNote.trim(),
      map: mapUrl,
      cost: editingSpotCost.trim(),
      images: editingSpotImages
    });

    setEditingSpotId(null);
  };

  // Calculate self budgets
  const wifiPrice = wifiPlan === 'none' ? 0 : wifiPlan === 'browse' ? 2200 : 5900;
  const drinkPrice = drinkPlan === 'none' ? 0 : drinkPlan === 'soft' ? 5500 : 9500;
  const diningPrice = diningCount * diningCostUnit;
  const selfOnboardTotal = wifiPrice + drinkPrice + diningPrice + extraOnboard;

  // Calculate disembark budgets
  const sasehoCost = sasehoMode === 'none' ? 0 : sasehoMode === 'free' ? sasehoFreeCost : TOUR.saseho[sasehoTourSel][sizeSaseho];
  const busanCost = busanMode === 'none' ? 0 : busanMode === 'free' ? busanFreeCost : TOUR.busan[busanTourSel][sizeBusan];

  const personalTotal = selfOnboardTotal + sasehoCost + busanCost;
  const groupTotal = personalTotal * paxCount;

  // Render Category styling
  const getCatObj = (k: string) => {
    return CATS.find(c => c.k === k) || CATS[5];
  };

  // Spot List formatting and sorting
  const getSortedSpots = (spots: Spot[]) => {
    const list = [...spots];
    if (spotSort === 'votes') {
      return list.sort((a, b) => (b.voters?.length || 0) - (a.voters?.length || 0) || b.created - a.created);
    }
    return list.sort((a, b) => b.created - a.created);
  };

  const activePortSpots = discPort === 'saseho' ? spotsSaseho : spotsBusan;
  const sortedSpotsToShow = getSortedSpots(activePortSpots);

  // Helper to parse checklist checked users
  const getCheckedUsers = (idx: number): string[] => {
    const val = checklist[idx];
    if (Array.isArray(val)) return val;
    if (typeof val === 'boolean') return val ? ["全員"] : [];
    return [];
  };

  // Count done checklist items for me specifically
  const myDoneChecklistCount = me.name
    ? CHECKLIST.filter((_, idx) => getCheckedUsers(idx).includes(me.name!)).length
    : Object.keys(checklist).filter(idx => {
        const users = getCheckedUsers(Number(idx));
        return users.length > 0;
      }).length;

  const checklistTotal = CHECKLIST.length;
  const checklistPercent = checklistTotal > 0 ? (myDoneChecklistCount / checklistTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* ===== NAVIGATION BAR ===== */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/80 border-b border-sky-100 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-sky-50 p-1.5 rounded-xl border border-sky-100/60 animate-float-ship">
              <MiniShip className="h-7 w-10 text-slate-700" />
            </div>
            <span className="font-black text-slate-800 tracking-tight text-base sm:text-lg">
              康匠郵輪之旅 <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">115員工旅遊</span>
            </span>
          </div>

          <button
            onClick={() => scrollToSection('discuss')}
            className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md shadow-rose-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1"
          >
            🗺️ 一起選景點
          </button>
        </div>

        {/* Unified Scrollable Anchor Bar (Visible on both desktop & mobile with sleek custom scrollbar!) */}
        <div className="border-t border-sky-100/40 bg-white/95 backdrop-blur-sm py-2 px-4 overflow-x-auto flex items-center [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sky-200/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-sky-300 scrollbar-thin scroll-smooth snap-x snap-mandatory">
          <div id="nav-buttons-container" className="max-w-6xl mx-auto w-full flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:none">
            {[
              { id: 'overview', label: '🚢 郵輪與日程' },
              { id: 'cost', label: '📋 自費與回條' },
              { id: 'discuss', label: '💬 景點討論區' },
              { id: 'itinerary-plan', label: '⏰ 時間路線規劃' },
              { id: 'shopping-list', label: '🛒 採購與筆記' }
            ].map((section) => (
              <button
                key={section.id}
                id={`nav-btn-${section.id}`}
                onClick={() => scrollToSection(section.id)}
                className={`text-[11px] sm:text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap snap-center flex-shrink-0 ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== HERO HEADER ===== */}
      <header className="relative bg-gradient-to-br from-[#061f2d] via-[#0d3144] to-[#164a66] text-white overflow-hidden py-16 px-4 md:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_400px_at_80%_-10%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_10%_110%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300">
              🌊 台灣康匠 · 超豪華員工福利郵輪大航海
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white">
              佐世保 × 釜山 <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
                六天五夜郵輪之旅
              </span>
            </h1>
            <p className="text-white/95 text-sm sm:text-base md:text-lg max-w-2xl font-medium leading-relaxed">
              搭乘亞洲最大頂級豪華旗艦郵輪 <b>MSC 榮耀號 Bellissima</b>，免除行李轉乘奔波之苦。一覺醒來已靠岸日本佐世保與韓國釜山！極致享受豐富船上設施，岸上安排各自自主，自由自在！
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1">
                📅 2026.07.25 – 07.30
              </span>
              <span className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1">
                ⚓ 基隆西岸旅客碼頭
              </span>
              <span className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1">
                🛳️ 17.2萬噸 傳奇旗艦
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => scrollToSection('overview')}
                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                看完整行程 ➔
              </button>
              <button
                onClick={() => scrollToSection('discuss')}
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                🗺️ 直接去討論區選景點
              </button>
            </div>
          </div>

          {/* Countdown & visual ship column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 relative">
            {/* Cruise ship with sunset peeking behind it */}
            <div className="w-full max-w-[340px] opacity-100 transition-all duration-300 animate-float-ship relative z-10 -mb-4">
              <MSC_CruiseShip_With_Sunset className="w-full h-auto" />
            </div>

            {/* Countdown layout */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl w-full max-w-xs shadow-xl flex flex-col items-center relative z-20">
              <span className="text-[10px] font-bold text-slate-300 tracking-wider mb-2.5">距離啟航出發倒數 ⏰</span>
              <div className="grid grid-cols-4 gap-2 w-full">
                <div className="bg-white/10 border border-white/10 p-2 rounded-2xl text-center">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">{countdown.d}</span>
                  <span className="block text-[9px] font-bold text-sky-200 mt-0.5">天</span>
                </div>
                <div className="bg-white/10 border border-white/10 p-2 rounded-2xl text-center">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">{countdown.h}</span>
                  <span className="block text-[9px] font-bold text-sky-200 mt-0.5">時</span>
                </div>
                <div className="bg-white/10 border border-white/10 p-2 rounded-2xl text-center">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">{countdown.m}</span>
                  <span className="block text-[9px] font-bold text-sky-200 mt-0.5">分</span>
                </div>
                <div className="bg-white/10 border border-white/10 p-2 rounded-2xl text-center">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">{countdown.s}</span>
                  <span className="block text-[9px] font-bold text-sky-200 mt-0.5">秒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== SECTION: OVERVIEW / TIMELINE ===== */}
      <section id="overview" className="max-w-6xl mx-auto py-16 px-4 scroll-mt-20">
        <div className="space-y-2 mb-10 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center sm:justify-start gap-1.5">
            <span className="w-6 h-0.5 bg-indigo-500 rounded"></span> Itinerary 行程總覽
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">六天五夜郵輪海陸大旅行 🗓️</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-bold max-w-2xl">
            兩個全日海上巡航，盡享榮耀號豪華免稅街、大劇院與餐食；兩日靠港日本佐世保與韓國釜山。自主安排自由行！
          </p>
        </div>

        {/* Timeline Horizontal Layout */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
          {DAYS.map((day) => {
            const tm = (day.arr || day.dep) ? (
              <div className="text-[10px] text-indigo-600 font-bold mt-1.5">
                {day.arr && `抵港 ${day.arr}`} {day.dep && ` 離港 ${day.dep}`}
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 font-bold mt-1.5">{day.time}</div>
            );
            return (
              <div
                key={day.n}
                onClick={() => {
                  setExpandedDay(day.n);
                  scrollToSection('daily');
                }}
                className={`cursor-pointer group bg-white border border-slate-200/60 p-4 rounded-2xl hover:shadow-md hover:border-sky-200 hover:-translate-y-1 transition-all ${
                  day.free ? 'border-amber-400 bg-amber-50/20 shadow-sm' : ''
                }`}
              >
                <div className="text-[10px] font-extrabold text-indigo-500 group-hover:text-indigo-700">DAY 0{day.n}</div>
                <div className="text-base font-black text-slate-800 mt-0.5">{day.date} <span className="text-xs text-slate-400 font-bold">{day.dow}</span></div>
                <div className="text-2xl my-2">{day.icon}</div>
                <div className="text-xs font-black text-slate-800 truncate">{day.title}</div>
                {tm}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== SECTION: DAILY ACCORDIONS ===== */}
      <section id="daily" className="bg-slate-100/50 border-y border-slate-200/50 py-16 px-4 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-6 h-0.5 bg-indigo-500 rounded"></span> Day by Day 每日行程
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight font-sans">每日餐食、注意事項細節 👇</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-bold">
              包含當日安排亮點、郵輪提供的免付費餐食；靠港自由行日，也為大家提供直達討論區的新增連結。
            </p>
          </div>

          {/* Insert Weather widget right above the accordions */}
          <WeatherWidget />

          <div className="space-y-3">
            {DAYS.map((day) => {
              const isOpen = expandedDay === day.n;
              return (
                <div key={day.n} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                  <div
                    onClick={() => setExpandedDay(isOpen ? null : day.n)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center font-bold text-base text-indigo-700 flex-none shadow-sm">
                        {day.n}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-800">
                          {day.title} <span className="text-xs text-slate-400 font-bold ml-1">{day.date} ({day.dow})</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">{day.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-none">
                      <span className="text-xs font-extrabold text-indigo-600 hidden sm:block bg-indigo-50 px-2 py-1 rounded">
                        {day.arr || day.dep ? `${day.arr ? `抵港 ${day.arr}` : ''} ${day.dep ? `離港 ${day.dep}` : ''}` : day.time}
                      </span>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/50 space-y-4 animate-fadeIn">
                      {/* Meals */}
                      <div className="flex flex-wrap gap-2">
                        {day.meals.map((meal, idx) => {
                          const [type, ...rest] = meal.split(' ');
                          return (
                            <span key={idx} className="bg-indigo-50 border border-indigo-100/30 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1">
                              <span className="text-indigo-800 font-black">{type}：</span>
                              {rest.join(' ')}
                            </span>
                          );
                        })}
                      </div>

                      {/* Points */}
                      <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-600 pl-1">
                        {day.pts.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="text-indigo-500 flex-none mt-0.5">⚓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Direct discussion button */}
                      {day.port && (
                        <button
                          onClick={() => {
                            setDiscPort(day.port as any);
                            scrollToSection('discuss');
                          }}
                          className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-sm"
                        >
                          🗺️ 前往【{day.port === 'saseho' ? '佐世保' : '釜山'}】討論區推薦與安排行程
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTION: SHIP HIGHLIGHTS ===== */}
      <section id="ship" className="max-w-6xl mx-auto py-16 px-4 scroll-mt-20">
        <div className="space-y-2 mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-1.5">
            <span className="w-6 h-0.5 bg-indigo-500 rounded"></span> On Board 郵輪亮點
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">亞洲最大旗艦「榮耀號」必玩設施 🛳️</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-bold max-w-xl mx-auto">
            17.2萬噸傳奇旗艦，共有19層甲板，儼然一座海上度假小鎮！免費設施玩不完！
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SHIP.map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-all mb-4">
                {s.ic}
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                {s.t}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  s.tag === 'free' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {s.tag === 'free' ? '免費' : '自費'}
                </span>
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-bold leading-relaxed mt-2.5">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION: DINING ===== */}
      <section id="dining" className="bg-[#f0f9fb]/50 border-t border-sky-100/50 py-12 px-4 scroll-mt-20">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-[#00bdd6] flex items-center justify-center gap-1.5">
              <span className="w-5 h-0.5 bg-[#00bdd6] rounded"></span> Dining 船上餐食
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">吃這件事，船上全包 🍽️</h2>
            <p className="text-slate-500 text-xs font-bold leading-relaxed">
              高水準的主餐廳與全日制自助餐廳均免費提供，甚至會驚喜遇見免費龍蝦之夜喔！
            </p>
          </div>

          {/* Dining Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl max-w-sm mx-auto">
            <button
              onClick={() => setDiningTab('free')}
              className={`flex-1 text-xs py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                diningTab === 'free' ? 'bg-[#00bdd6] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🆓 免費餐廳
            </button>
            <button
              onClick={() => setDiningTab('paid')}
              className={`flex-1 text-xs py-2.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                diningTab === 'paid' ? 'bg-[#00bdd6] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ⭐ 付費特色餐廳
            </button>
          </div>

          <div className="transition-all duration-300">
            {diningTab === 'free' ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🆓</span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">免加錢 · 全船全包</span>
                </div>
                <h3 className="text-base font-black text-slate-800">
                  豐富免費餐廳任你吃
                </h3>
                <div className="text-slate-500 text-xs sm:text-sm font-bold leading-relaxed space-y-2">
                  <p>
                    <b>15 樓自助餐廳 (Marketplace)</b>：幾乎 20 小時全天開放，有多國美食、美式燒烤、手工現烤披薩與沙拉吧。這也是全船唯一免費提供飲水機、冷熱咖啡與茶包的無限取水處。
                  </p>
                  <p>
                    <b>主餐廳 (櫻桃/海王/燈塔等)</b>：精緻的三道式歐陸與亞洲西餐，每晚提供不同的主廚推薦菜色（晚餐時間有固定桌號與時段）。
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">精緻饕客自選項目</span>
                </div>
                <h3 className="text-base font-black text-slate-800">
                  頂級付費特色餐廳
                </h3>
                <div className="text-slate-500 text-xs sm:text-sm font-bold leading-relaxed space-y-2">
                  <p>
                    想品嚐大師級的美味，可另外自費預訂：<b>海渡壽司吧、美式牛排館 (Butcher's Cut)、極致鐵板燒、墨西哥小吃</b>，以及義式頂級巧克力 Gelato 冰淇淋吧。
                  </p>
                  <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-xl border border-amber-100 mt-2">
                    💡 <b>達人建議</b>：一上船連接船上 Wi-Fi 後，立即使用 MSC For Me App 預訂特色餐廳。另外，主餐廳經常客滿，自備保溫水壺至 15 樓裝水回房最省事方便！
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION: BUDGET ESTIMATOR ===== */}
      <section id="cost" className="max-w-6xl mx-auto py-16 px-4 space-y-8 scroll-mt-20">
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-1.5">
            <span className="w-6 h-0.5 bg-indigo-500 rounded"></span> Budget 費用與預算估算
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">自費預算、網路與行程快速試算 🧮</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-bold max-w-xl mx-auto">
            公司補助與基本房費已定（報價包含小費與觀光稅），以下幫您概估「船上個人消費」與「岸上自費自主行程」！
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs on the left */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
            {/* Tabs toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCalcTab('onboard')}
                className={`flex-1 text-xs py-2.5 rounded-lg font-extrabold transition-all ${
                  calcTab === 'onboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🛳️ 船上額外自費
              </button>
              <button
                onClick={() => setCalcTab('offship')}
                className={`flex-1 text-xs py-2.5 rounded-lg font-extrabold transition-all ${
                  calcTab === 'offship' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🗺️ 岸上靠港自費
              </button>
            </div>

            {calcTab === 'onboard' ? (
              <div className="space-y-5">
                {/* WiFi */}
                <div className="border-b border-slate-100 pb-4">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-700 mb-2">📶 船上上網 WiFi 套餐</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: '不買網路', p: 0 },
                      { key: 'browse', label: '標準網頁型', p: 2200 },
                      { key: 'stream', label: '影音串流型', p: 5900 }
                    ].map((plan) => (
                      <button
                        key={plan.key}
                        onClick={() => setWifiPlan(plan.key as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          wifiPlan === plan.key
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-extrabold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 text-xs'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-extrabold">{plan.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">約 NT${plan.p.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold leading-normal">
                    * 免費內網僅可使用 MSC for Me App 內網聊天/看日報。購買上網可在出發前登入官網訂購，通常享八折預購優惠。
                  </p>
                </div>

                {/* Drinks */}
                <div className="border-b border-slate-100 pb-4">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-700 mb-2">🥤 船上飲料暢飲套餐 (Easy Package)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: '不買套餐', p: 0 },
                      { key: 'soft', label: '軟飲套餐', p: 5500 },
                      { key: 'alcohol', label: '酒水套餐', p: 9500 }
                    ].map((plan) => (
                      <button
                        key={plan.key}
                        onClick={() => setDrinkPlan(plan.key as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          drinkPlan === plan.key
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-extrabold shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 text-xs'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-extrabold">{plan.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">約 NT${plan.p.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold leading-normal">
                    * 套餐需購買整個航程，同房旅客須購買同種方案（若為禮遇陽台暢飲房，則房價已內含，不需再選）。
                  </p>
                </div>

                {/* Special Dining count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-700 mb-2">🍣 付費特色餐廳次數</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDiningCount(prev => Math.max(0, prev - 1))}
                        className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center font-black"
                      >
                        -
                      </button>
                      <span className="text-base font-extrabold font-mono w-12 text-center">{diningCount} 次</span>
                      <button
                        onClick={() => setDiningCount(prev => prev + 1)}
                        className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-extrabold text-slate-700 mb-2">單次預算估值 (NT$)</label>
                    <input
                      type="number"
                      value={diningCostUnit}
                      onChange={e => setDiningCostUnit(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-10 border border-slate-200 rounded-lg px-3 text-xs sm:text-sm font-extrabold text-right font-mono"
                    />
                  </div>
                </div>

                {/* Other spending */}
                <div>
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-700 mb-2">🎰 其他船上消費預留 (紀念照/冰淇淋/賭場)</label>
                  <input
                    type="number"
                    value={extraOnboard}
                    onChange={e => setExtraOnboard(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full h-11 border border-slate-200 rounded-lg px-3 text-xs sm:text-sm font-extrabold text-right font-mono bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-fadeIn">
                {/* Saseho */}
                <div className="border-b border-slate-100 pb-4 space-y-3">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-700">⛩️ DAY 03 · 日本佐世保自選方案</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: '留在船上' },
                      { key: 'free', label: '自主自由行' },
                      { key: 'tour', label: '旅行社官方團' }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        onClick={() => setSasehoMode(mode.key as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all text-xs font-extrabold ${
                          sasehoMode === mode.key
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black'
                            : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {sasehoMode === 'free' && (
                    <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-bold">自費自由行預算抓：</span>
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg px-2 h-9">
                        <span className="text-slate-400 font-bold text-xs">NT$</span>
                        <input
                          type="number"
                          value={sasehoFreeCost}
                          onChange={e => setSasehoFreeCost(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 border-none text-right font-mono font-bold text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {sasehoMode === 'tour' && (
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-1">官方旅行團路線</label>
                        <select
                          value={sasehoTourSel}
                          onChange={e => setSasehoTourSel(e.target.value as any)}
                          className="w-full h-9 border border-slate-200 bg-white rounded-lg px-2 font-bold focus:outline-none"
                        >
                          <option value="a">A團: 九十九島展望台 ➔ 免稅店 ➔ 佐世保五番街</option>
                          <option value="b">B團: 豪斯登堡全日 ➔ 免稅店</option>
                        </select>
                      </div>
                      <div className="flex bg-slate-200 p-0.5 rounded-lg">
                        <button
                          onClick={() => setSizeSaseho('over')}
                          className={`flex-1 py-1 rounded font-bold ${sizeSaseho === 'over' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                        >
                          滿 30 人團
                        </button>
                        <button
                          onClick={() => setSizeSaseho('under')}
                          className={`flex-1 py-1 rounded font-bold ${sizeSaseho === 'under' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                        >
                          未滿 30 人
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Busan */}
                <div className="pb-4 space-y-3">
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-700">🏯 DAY 04 · 韓國釜山自選方案</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'none', label: '留在船上' },
                      { key: 'free', label: '自主自由行' },
                      { key: 'tour', label: '旅行社官方團' }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        onClick={() => setBusanMode(mode.key as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all text-xs font-extrabold ${
                          busanMode === mode.key
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black'
                            : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {busanMode === 'free' && (
                    <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-500 font-bold">自費自由行預算抓：</span>
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg px-2 h-9">
                        <span className="text-slate-400 font-bold text-xs">NT$</span>
                        <input
                          type="number"
                          value={busanFreeCost}
                          onChange={e => setBusanFreeCost(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-24 border-none text-right font-mono font-bold text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {busanMode === 'tour' && (
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 mb-1">官方旅行團路線</label>
                        <select
                          value={busanTourSel}
                          onChange={e => setBusanTourSel(e.target.value as any)}
                          className="w-full h-9 border border-slate-200 bg-white rounded-lg px-2 font-bold focus:outline-none"
                        >
                          <option value="a">A團: 天空膠囊列車 ➔ 甘川文化村 ➔ 光復洞時尚街</option>
                          <option value="b">B團: 天空膠囊列車 ➔ 廣安里咖啡街 ➔ 五六島</option>
                        </select>
                      </div>
                      <div className="flex bg-slate-200 p-0.5 rounded-lg">
                        <button
                          onClick={() => setSizeBusan('over')}
                          className={`flex-1 py-1 rounded font-bold ${sizeBusan === 'over' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                        >
                          滿 30 人團
                        </button>
                        <button
                          onClick={() => setSizeBusan('under')}
                          className={`flex-1 py-1 rounded font-bold ${sizeBusan === 'under' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                        >
                          未滿 30 人
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary on the Right */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold text-sky-200 uppercase tracking-wider block">個人估算自費總額</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300 mt-1">
                NT$ {personalTotal.toLocaleString()}{' '}
                <span className="text-xs text-slate-400 font-bold">/ 人</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <span>🛳️ 船上小計</span>
                <span className="font-mono">NT$ {selfOnboardTotal.toLocaleString()}</span>
              </div>
              {wifiPrice > 0 && <div className="flex justify-between text-slate-400 pl-4 font-bold"><span>└ 上網套餐</span><span className="font-mono">NT$ {wifiPrice.toLocaleString()}</span></div>}
              {drinkPrice > 0 && <div className="flex justify-between text-slate-400 pl-4 font-bold"><span>└ 暢飲套餐</span><span className="font-mono">NT$ {drinkPrice.toLocaleString()}</span></div>}
              {diningPrice > 0 && <div className="flex justify-between text-slate-400 pl-4 font-bold"><span>└ 特色餐廳 ({diningCount}次)</span><span className="font-mono">NT$ {diningPrice.toLocaleString()}</span></div>}
              {extraOnboard > 0 && <div className="flex justify-between text-slate-400 pl-4 font-bold"><span>└ 其他零用</span><span className="font-mono">NT$ {extraOnboard.toLocaleString()}</span></div>}

              <div className="border-t border-slate-800/60 my-2 pt-2"></div>

              <div className="flex justify-between font-bold text-slate-300">
                <span>⛩️ 佐世保預算 ({sasehoMode === 'none' ? '不下船' : sasehoMode === 'free' ? '自由行' : '官方團'})</span>
                <span className="font-mono">NT$ {sasehoCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-300">
                <span>🏯 釜山預算 ({busanMode === 'none' ? '不下船' : busanMode === 'free' ? '自由行' : '官方團'})</span>
                <span className="font-mono">NT$ {busanCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>👥 計算我們幾人同行</span>
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setPaxCount(prev => Math.max(1, prev - 1))}
                    className="h-7 w-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-black"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-slate-100">{paxCount}</span>
                  <button
                    onClick={() => setPaxCount(prev => prev + 1)}
                    className="h-7 w-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-black"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="border-t border-white/5 my-2 pt-2 flex justify-between items-center text-sm font-black">
                <span>同伴總計預算額</span>
                <span className="text-amber-300 font-mono text-lg">NT$ {groupTotal.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 font-bold leading-normal">
              * 上述匯率以 1 USD = 31.5 TWD、1 TWD = 4.76 JPY 概估，船上消費一律依現場與官方公告。公司團費補助詳情請見下方。
            </p>
          </div>
        </div>

        {/* Cost Expense Shared Ledger Section */}
        <div className="bg-slate-100 p-4 sm:p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="max-w-md">
            <h3 className="text-base sm:text-lg font-black text-slate-800">我們的「團體共有記帳本」</h3>
            <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1">
              自由行、購物或代購常常分頭付款，把帳記在下面，系統會自動換算匯率，並算出平均分攤和彼此該給多少錢喔！
            </p>
          </div>
          <ExpenseTracker
            expenses={expenses}
            meName={me.name}
            addExpense={addExpense}
            deleteExpense={deleteExpense}
          />
        </div>

        {/* Company rates reference Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div
            onClick={() => setFeeFolded(!feeFolded)}
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none border-b border-slate-100"
          >
            <span className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-1.5">
              <span>📋</span> 公司團費與補助對照表（參考）
            </span>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-all duration-300 ${feeFolded ? 'rotate-180' : ''}`} />
          </div>

          {!feeFolded && (
            <div className="p-4 sm:p-6 bg-slate-50/20 text-xs space-y-4 animate-fadeIn">
              <p className="text-slate-500 font-bold">
                以下為公司回條原始數據，方便大家同房同住選派：報價已包含郵輪服務費及日本觀光稅。12歲以下同大人價。
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 text-left font-extrabold text-slate-700">房型</th>
                      <th className="p-3 font-extrabold text-slate-700">兩人房</th>
                      <th className="p-3 font-extrabold text-slate-700">三人房</th>
                      <th className="p-3 font-extrabold text-slate-700">四人房</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: '內艙房', p2: '31,380', p3: '25,213', p4: '22,130' },
                      { type: '遮蔽海景房', p2: '31,380', p3: '—', p4: '—' },
                      { type: '海景房', p2: '38,380', p3: '30,547', p4: '—' },
                      { type: '豪華海景房', p2: '41,380', p3: '32,547', p4: '—' },
                      { type: '遮蔽陽台房', p2: '32,380', p3: '27,547', p4: '25,130' },
                      { type: '陽台房', p2: '42,380', p3: '34,213', p4: '30,130' },
                      { type: '禮遇陽台暢飲房', p2: '47,380', p3: '38,880', p4: '34,630', hl: true }
                    ].map((row, idx) => (
                      <tr key={idx} className={`border-b border-slate-100 last:border-none ${row.hl ? 'bg-amber-50/40 font-extrabold' : ''}`}>
                        <td className="p-3 text-left font-extrabold text-slate-800">{row.type}</td>
                        <td className="p-3 font-mono font-bold">{row.p2}</td>
                        <td className="p-3 font-mono font-bold">{row.p3}</td>
                        <td className="p-3 font-mono font-bold">{row.p4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm max-w-md">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 text-left font-extrabold text-slate-700">員工補助條件</th>
                      <th className="p-3 font-extrabold text-slate-700">補助金額（每人）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cond: '經理級', p: '44,260' },
                      { cond: '副理、副廠長', p: '33,195' },
                      { cond: '3 年以上年資', p: '22,130' },
                      { cond: '1 年以上，3 年以下', p: '11,065' },
                      { cond: '3 個月以上，1 年以下', p: '8,000' },
                      { cond: '未滿 3 個月', p: '0' }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-none">
                        <td className="p-3 text-left font-extrabold text-slate-800">{row.cond}</td>
                        <td className="p-3 font-mono font-extrabold text-indigo-700">NT$ {row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION: PRECAUTIONS / NOTES ===== */}
      <section id="notes" className="bg-slate-100/50 border-y border-slate-200 py-16 px-4 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-6 h-0.5 bg-indigo-500 rounded"></span> Good to Know 注意事項
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">行前、通關與船上生活指南 📌</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-bold">
              最重要的一件事：<span className="text-rose-500 font-extrabold">請務必列印 2 份護照 A4 影本！</span> 用於每次上岸入境查驗。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NOTES.map((note, idx) => {
              const isOpen = !!expandedNotes[idx];
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm self-start">
                  <div
                    onClick={() => setExpandedNotes(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all select-none font-extrabold text-xs sm:text-sm text-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{note.ic}</span>
                      {note.t}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {isOpen && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50/40 text-xs font-bold leading-relaxed text-slate-600">
                      <div dangerouslySetInnerHTML={{ __html: note.body }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Checklist */}
          <div className="bg-amber-50/40 border border-amber-200/50 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
                🧳 郵輪行前打包準備清單（多人協同勾選）
              </h3>
              <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                {me.name ? `【${me.name}】的進度：${myDoneChecklistCount} / ${checklistTotal}` : `完成進度：${myDoneChecklistCount} / ${checklistTotal}`}
              </span>
            </div>

            <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            {/* Sub Nickname gate inside Checklist */}
            {!me.name ? (
              <div className="bg-amber-100/60 p-4 rounded-2xl border border-amber-200/50 flex flex-col sm:flex-row items-center gap-3 justify-between">
                <span className="text-xs font-black text-amber-900">
                  👋 填寫您的暱稱，即可各自勾選、統計「我個人的準備清單」喔！
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="例如：Erin"
                    value={checklistNameInput}
                    onChange={e => setChecklistNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName(checklistNameInput)}
                    className="flex-1 sm:w-40 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => saveName(checklistNameInput)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-1.5 rounded-xl transition-all whitespace-nowrap"
                  >
                    進入
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/60 border border-emerald-100/40 p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center font-black text-[10px] text-white" style={{ backgroundColor: me.color || '#ef6b3f' }}>
                    {me.name[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-extrabold text-slate-700">當前正在準備【{me.name}】的專屬行李打包清單</span>
                </div>
                <button
                  onClick={changeName}
                  className="text-indigo-600 hover:text-indigo-700 font-extrabold underline cursor-pointer"
                >
                  切換使用者
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {CHECKLIST.map((item, idx) => {
                const checkedUsers = getCheckedUsers(idx);
                const isCheckedByMe = me.name ? checkedUsers.includes(me.name) : false;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!me.name) {
                        alert("請先在下方或本區塊頂部輸入暱稱，即可進行個人化打包勾選！");
                        return;
                      }
                      toggleChecklistItem(idx);
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                      isCheckedByMe
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center text-white text-xs flex-shrink-0 ${
                        isCheckedByMe ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                      }`}>
                        ✓
                      </div>
                      <span className={`font-extrabold text-xs leading-snug flex-1 ${
                        isCheckedByMe ? 'text-slate-400 line-through' : 'text-slate-700'
                      }`}>
                        {item}
                      </span>
                    </div>

                    {/* Show checked members */}
                    {checkedUsers.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pl-8 pt-0.5">
                        <span className="text-[10px] font-extrabold text-slate-400">已打包：</span>
                        {checkedUsers.map((user, uidx) => (
                          <span
                            key={uidx}
                            style={{ backgroundColor: colorFor(user) }}
                            className="text-[9px] font-black text-white px-2 py-0.5 rounded-full shadow-sm"
                          >
                            {user}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: CONFIRM Q&A ===== */}
      <section id="confirm" className="max-w-4xl mx-auto py-16 px-4 space-y-8 scroll-mt-20">
        <div className="text-center sm:text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center sm:justify-start gap-1.5">
            <span className="w-6 h-0.5 bg-indigo-500 rounded"></span> Ask the Agency 報名前 Q&A
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">要跟旅行社確認的事 ✅</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-bold">
            我們跟朋友最關心的細節。已明確的備註<span className="text-indigo-600 font-black">【已知】</span>，待說明的列為<span className="text-rose-500 font-black">【待旅行社】</span>，最終以行前說明會公告為準！
          </p>
        </div>

        <div className="space-y-4">
          {CONFIRM.map((group, idx) => {
            const isOpen = !!expandedConfirm[idx];
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div
                  onClick={() => setExpandedConfirm(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none border-b border-slate-100"
                >
                  <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                    <span className="text-lg">{group.ic}</span>
                    {group.t}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-slate-50/20 divide-y divide-slate-100 space-y-4">
                    {group.items.map((qa, qidx) => (
                      <div key={qidx} className="pt-4 first:pt-0 space-y-2 text-xs">
                        <h4 className="font-extrabold text-slate-800 text-sm flex items-start gap-1.5 leading-snug">
                          <span className="text-indigo-500">Q.</span>
                          <span>{qa.q}</span>
                        </h4>
                        <div className="space-y-1.5 pl-4">
                          {qa.lines.map((ln, lidx) => (
                            <div key={lidx} className="flex items-start gap-2 font-bold text-slate-600 leading-relaxed">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded flex-none mt-0.5 ${
                                ln.t === 'k' ? 'bg-indigo-100 text-indigo-700' : ln.t === 'm' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {ln.t === 'k' ? '已知' : ln.t === 'm' ? '我查' : '待確認'}
                              </span>
                              <span>{ln.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== SECTION: DISCUSSION FORUM (THE MAIN CORE BLOCK) ===== */}
      <section id="discuss" className="bg-[#f0f9fb] text-slate-800 py-16 px-4 border-t border-slate-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-gradient-to-r from-[#00bdd6] to-[#2ac2c9] rounded-3xl p-6 sm:p-8 border border-cyan-400/20 relative overflow-hidden shadow-xl text-white">
            <div className="absolute right-[-10px] bottom-[-20px] text-[130px] opacity-10 select-none pointer-events-none">🗺️</div>
            
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1 bg-amber-300 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                ⭐ 多人協同自由行規劃區
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">佐世保 & 釜山 自由行討論區</h2>
              <p className="text-white/90 text-xs sm:text-sm font-bold leading-relaxed">
                兩天靠港是我們朋友的自由放風時間！點進來，輸入彼此的暱稱。推薦你找到的美食與好玩地標、上傳景點相片，大家可以互相投票，最終直接一鍵排定完美登陸日程！
              </p>

              {/* Login / Name Gate */}
              {!me.name ? (
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 max-w-md space-y-3 pt-4">
                  <span className="block text-xs font-bold text-amber-300">👋 先為自己取個名字進入討論吧：</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="輸入您的暱稱（例：Erin）"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveName(nameInput)}
                      className="flex-1 h-11 !bg-white !text-slate-900 placeholder:text-slate-400 font-extrabold text-sm px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      onClick={() => saveName(nameInput)}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm px-5 h-11 rounded-xl transition-all"
                    >
                      進入討論區 ➔
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl max-w-md pt-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-black text-sm text-white" style={{ backgroundColor: me.color || '#ef6b3f' }}>
                    {me.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-extrabold text-slate-300">當前正在協同：</div>
                    <div className="text-sm font-black truncate">{me.name}</div>
                  </div>
                  <button
                    onClick={changeName}
                    className="text-slate-400 hover:text-rose-400 text-xs font-bold underline cursor-pointer"
                  >
                    更換暱稱
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Core: Tabs, ideas, add form, list, planners */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6 text-slate-950">
            {/* Port selector */}
            <div className="flex bg-slate-800 p-1 rounded-2xl gap-1">
              <button
                onClick={() => setDiscPort('saseho')}
                className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all flex flex-col sm:flex-row justify-center items-center gap-2 ${
                  discPort === 'saseho' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">⛩️</span>
                <span className="text-center sm:text-left">
                  日本佐世保
                  <span className="block sm:inline-block text-[10px] text-slate-300 sm:ml-2 font-bold opacity-80">
                    DAY 3 · 09:30 - 20:00
                  </span>
                </span>
              </button>
              <button
                onClick={() => setDiscPort('busan')}
                className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all flex flex-col sm:flex-row justify-center items-center gap-2 ${
                  discPort === 'busan' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl">🏯</span>
                <span className="text-center sm:text-left">
                  韓國釜山
                  <span className="block sm:inline-block text-[10px] text-slate-300 sm:ml-2 font-bold opacity-80">
                    DAY 4 · 07:00 - 17:00
                  </span>
                </span>
              </button>
            </div>

            {/* Quick Inspiration chips */}
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/60">
              <span className="text-xs font-extrabold text-slate-400 block mb-2">💡 沒靈感？點一下直接推薦給同伴（再一起投票）：</span>
              <div className="flex flex-wrap gap-2">
                {IDEAS[discPort].map((item, idx) => {
                  const cat = getCatObj(item.c);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddFromIdea(item.n, item.c)}
                      className="bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 text-slate-200 text-xs font-extrabold px-3 py-2 rounded-full transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>{cat.emoji}</span> {item.n}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form to add spot */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5">
                  <span>➕</span> 推薦我想去的景點/美食
                </h3>

                <form onSubmit={handleAddSpotSubmit} className="space-y-3.5 text-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 mb-1">景點 / 店名（必填）</label>
                      <input
                        type="text"
                        placeholder="例：九十九島展望台 / 札嘎其海鮮"
                        value={spotName}
                        onChange={e => setSpotName(e.target.value)}
                        className="w-full h-10 border border-slate-200 rounded-xl px-3 bg-slate-50 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 mb-1">預估花費（選填）</label>
                      <input
                        type="text"
                        placeholder="例：¥1,500 / 自理"
                        value={spotCost}
                        onChange={e => setSpotCost(e.target.value)}
                        className="w-full h-10 border border-slate-200 rounded-xl px-3 bg-slate-50 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Category select */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5">景點分類</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATS.map((cat) => (
                        <button
                          key={cat.k}
                          type="button"
                          onClick={() => setSpotCategory(cat.k)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            spotCategory === cat.k
                              ? 'text-white'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                          }`}
                          style={{ backgroundColor: spotCategory === cat.k ? cat.color : '', borderColor: spotCategory === cat.k ? cat.color : '' }}
                        >
                          {cat.emoji} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">想去的備註/理由</label>
                    <textarea
                      placeholder="跟朋友說說為什麼想去吧！這裡沒有字數限制，歡迎寫下詳細的計畫、想買的口味或是推薦菜單 ✍️"
                      value={spotNote}
                      onChange={e => setSpotNote(e.target.value)}
                      className="w-full h-20 border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:bg-white resize-none text-slate-800"
                    />
                  </div>

                  {/* Google Map URL */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Google 地圖地標連結（選填）</label>
                    <input
                      type="text"
                      placeholder="貼上 Google Maps 地標分享連結..."
                      value={spotMap}
                      onChange={e => setSpotMap(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-xl px-3 bg-slate-50 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
                    />
                  </div>

                  {/* Image upload with preview */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5 flex items-center gap-1">
                      <Camera className="h-3.5 w-3.5 text-indigo-500" />
                      搭配一些景點相片/地圖圖（自選，支援左右滑動輪播）
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 border border-dashed border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-500 font-extrabold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="h-4 w-4" /> 選擇景點圖
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleImageUploadChange}
                        className="hidden"
                      />
                    </div>

                    {uploadedBase64s.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2 pr-1 mt-2 scrollbar-thin">
                        {uploadedBase64s.map((img, idx) => (
                          <div key={idx} className="relative h-24 w-32 flex-none rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                            <img src={img} alt="Uploaded" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(idx)}
                              className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 h-6 w-6 rounded-full flex items-center justify-center text-xs text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-rose-500/20"
                  >
                    ＋ 推薦上傳到討論板
                  </button>
                </form>
              </div>

              {/* Spot list on the right */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center flex-wrap gap-2 text-white">
                  <div className="text-xs font-extrabold">
                    共 <span className="font-mono text-amber-300 text-sm">{activePortSpots.length}</span> 個推薦地點
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSpotSort('votes')}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-full transition-all ${
                        spotSort === 'votes' ? 'bg-white text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      最多人想去
                    </button>
                    <button
                      onClick={() => setSpotSort('new')}
                      className={`text-[10px] font-black px-3 py-1.5 rounded-full transition-all ${
                        spotSort === 'new' ? 'bg-white text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      最新推薦
                    </button>
                  </div>
                </div>

                {sortedSpotsToShow.length === 0 ? (
                  <div className="text-center py-24 bg-slate-800/20 border border-dashed border-slate-800/80 rounded-2xl text-slate-400 text-xs">
                    🌌 目前還沒有人推薦這裡的地點喔，快從左側或靈感新增一筆吧！
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                    {sortedSpotsToShow.map((spot) => {
                      const cat = getCatObj(spot.cat);
                      const hasVoted = me.name && spot.voters?.includes(me.name);
                      const voteCount = spot.voters?.length || 0;
                      const isAuthor = spot.author === me.name;
                      const isEditing = editingSpotId === spot.id;

                      return (
                        <div key={spot.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative hover:shadow-md transition-all">
                          <div>
                            {/* Delete button (only author) */}
                            {isAuthor && !isEditing && (
                              <button
                                onClick={() => {
                                  setSpotToDelete({ port: discPort, id: spot.id, name: spot.name });
                                  setDeleteConfirmOpen(true);
                                }}
                                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="刪除推薦"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Edit button (only author) */}
                            {isAuthor && !isEditing && (
                              <button
                                onClick={() => startEditSpot(spot)}
                                className="absolute top-3 right-11 p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                                title="編輯內容"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <span className="inline-block text-[10px] font-black px-2 py-1 rounded-full text-white mb-2" style={{ backgroundColor: cat.color }}>
                              {cat.emoji} {cat.label}
                            </span>

                            <h4 className="text-sm font-black text-slate-800 pr-16">{spot.name}</h4>

                            {/* Carousel of uploaded images (if any) */}
                            {spot.images && spot.images.length > 0 && (
                              <div className="my-3 relative group">
                                <div className="flex gap-2 overflow-x-auto scroll-snap-x snap-mandatory py-1 scrollbar-none rounded-2xl h-48 sm:h-56 max-w-full">
                                  {spot.images.map((img, i) => (
                                    <div 
                                      key={i} 
                                      onClick={() => setLightboxImage(img)}
                                      className="h-full w-full flex-none snap-start rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
                                      title="點擊放大檢視"
                                    >
                                      <img src={img} alt="Spot carousel" className="h-full w-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                                <span className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white">
                                  ↔ 左右滑輪播 ({spot.images.length}) · 點擊放大 🔍
                                </span>
                              </div>
                            )}

                            {/* Note / Description */}
                            {isEditing ? (
                              <div className="space-y-2 mt-2">
                                <textarea
                                  value={editingSpotNote}
                                  onChange={e => setEditingSpotNote(e.target.value)}
                                  placeholder="景點備註理由（無字數限制）"
                                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                                  rows={3}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={editingSpotCost}
                                    onChange={e => setEditingSpotCost(e.target.value)}
                                    placeholder="預估花費"
                                    className="w-full text-[10px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                                  />
                                  <input
                                    type="text"
                                    value={editingSpotMap}
                                    onChange={e => setEditingSpotMap(e.target.value)}
                                    placeholder="地圖地標連結"
                                    className="w-full text-[10px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                                  />
                                </div>

                                {/* Editing Spot Images */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => document.getElementById(`edit-file-${spot.id}`)?.click()}
                                      className="py-1 px-2.5 border border-dashed border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-500 font-extrabold text-[10px] rounded-lg flex items-center gap-1 transition-all"
                                    >
                                      <Plus className="h-3 w-3" /> 編輯景點相片
                                    </button>
                                    <input
                                      type="file"
                                      id={`edit-file-${spot.id}`}
                                      accept="image/*"
                                      multiple
                                      onChange={handleEditImageUploadChange}
                                      className="hidden"
                                    />
                                  </div>

                                  {editingSpotImages.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto py-1 pr-1 scrollbar-thin max-w-full">
                                      {editingSpotImages.map((img, idx) => (
                                        <div key={idx} className="relative h-20 w-28 flex-none rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                                          <img src={img} alt="Editing spot" className="h-full w-full object-cover" />
                                          <button
                                            type="button"
                                            onClick={() => removeEditingSpotImage(idx)}
                                            className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 h-6 w-6 rounded-full flex items-center justify-center text-xs text-white"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => setEditingSpotId(null)}
                                    className="px-2.5 py-1 text-[10px] font-extrabold bg-slate-100 rounded hover:bg-slate-200"
                                  >
                                    取消
                                  </button>
                                  <button
                                    onClick={() => saveSpotEdit(discPort, spot.id)}
                                    className="px-2.5 py-1 text-[10px] font-extrabold bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                  >
                                    儲存
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {spot.note && (
                                  <p className="text-xs font-medium text-slate-500 leading-relaxed mt-2 whitespace-pre-wrap break-words">
                                    {spot.note}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                  {spot.cost && (
                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-extrabold px-2 py-1 rounded-lg">
                                      💸 {spot.cost}
                                    </span>
                                  )}
                                  {spot.map && (
                                    <a
                                      href={spot.map}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-indigo-50 text-indigo-600 hover:text-indigo-800 text-[10px] font-extrabold px-2 py-1 rounded-lg transition-all"
                                    >
                                      📍 地圖導航
                                    </a>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-4">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="h-6.5 w-6.5 rounded-full flex items-center justify-center font-black text-[10px] text-white"
                                style={{ backgroundColor: spot.color || '#ef6b3f' }}
                              >
                                {spot.author[0].toUpperCase()}
                              </div>
                              <span className="text-[10px] font-extrabold text-slate-400">
                                {spot.author} <span className="block text-[8px] font-bold text-slate-300">推薦</span>
                              </span>
                            </div>

                            <button
                              onClick={() => toggleVote(discPort, spot.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all border ${
                                hasVoted
                                  ? 'bg-rose-50 border-rose-100 text-rose-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-400'
                              }`}
                            >
                              👍 想去 <span className="font-mono">{voteCount}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* New collaborative sections: Itinerary Timeline & Memos & Shopping Wishlists */}
          <div id="itinerary-plan" className="scroll-mt-20">
            <ItineraryBuilder
              spotsSaseho={spotsSaseho}
              spotsBusan={spotsBusan}
              updateSpot={updateSpot}
            />
          </div>

          <div id="shopping-list" className="scroll-mt-20">
            <ShoppingSection
              wishlist={wishlist}
              meName={me.name}
              addWishlistItem={addWishlistItem}
              toggleWishlistItem={toggleWishlistItem}
              deleteWishlistItem={deleteWishlistItem}
            />
          </div>

          <div id="local-tips" className="scroll-mt-20">
            <LocalTipsSection />
          </div>

          <div id="memo-board" className="scroll-mt-20">
            <MemoSection
              memos={memos}
              meName={me.name}
              addMemo={addMemo}
              deleteMemo={deleteMemo}
              updateMemo={updateMemo}
            />
          </div>

          {/* cloud connection state status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 text-slate-300 text-xs">
            <span className="text-base">📡</span>
            <div className="space-y-0.5">
              <span className="font-extrabold">同步連線狀態資訊：</span>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                {dbMode === 'cloud' ? (
                  <>
                    🎉 <b>已啟用雲端即時同步資料庫（Firebase）！</b>您與同伴新增的地點、上傳相片、記帳帳本、待買項目和備忘筆記，都將會在所有人瀏覽時，進行最快速的實時同步！
                  </>
                ) : (
                  <>
                    提示：目前處於<b>本機單機紀錄模式（localStorage）</b>。資料安全存於您的瀏覽器快取，關閉或重開仍會保留，但無法在不同同仁的手機/電腦間即時同步推薦。
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL FOOTER ===== */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-3 max-w-md">
            <h4 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>🚢</span> 期待這趟超豪華大航海！
            </h4>
            <p className="font-medium leading-relaxed">
              本頁由台灣康匠員工行程表、自費回條、旅行社提供資訊與公開大數據整理製作，方便大家協同記帳、討論與自由行安排。岸上官方行程是否成團、網路飲料暢飲與劇院安排，請一律以說明會最新公告與郵輪公司現場為準。
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-extrabold text-white block">官方推薦資源</span>
            <a
              href="https://msc-cruises.com.tw/E-book/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:underline font-extrabold block"
            >
              📖 MSC 榮耀號 Bellissima 官方電子介紹書 ➔
            </a>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING UTILITY BUTTONS (KKday Style Cute Buttons!) ===== */}
      {showFloat && (() => {
        const sectionsList = [
          { id: 'overview', label: '🚢 郵輪與日程' },
          { id: 'cost', label: '📋 自費與回條' },
          { id: 'discuss', label: '💬 景點討論區' },
          { id: 'itinerary-plan', label: '⏰ 時間路線規劃' },
          { id: 'shopping-list', label: '🛒 採購與筆記' }
        ];

        const currentSection = sectionsList.find(s => s.id === activeSection) || sectionsList[0];

        return (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 items-end">
            {/* Expanded Fast-Travel Navigation Menu */}
            {isFloatMenuOpen && (
              <div className="bg-white shadow-2xl border border-sky-100/90 rounded-3xl p-3 flex flex-col gap-1 min-w-[190px] mb-1.5 animate-scaleUp">
                <div className="text-[10px] font-black text-slate-400 px-2.5 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>快速跳航導航 ⚓</span>
                  <button 
                    onClick={() => setIsFloatMenuOpen(false)}
                    className="text-slate-400 hover:text-rose-500 font-extrabold text-xs cursor-pointer p-0.5"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {sectionsList.map((sec) => {
                    const isActive = sec.id === activeSection;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          scrollToSection(sec.id);
                          setIsFloatMenuOpen(false);
                        }}
                        className={`w-full text-left text-xs font-bold px-3 py-2.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{sec.label}</span>
                        {isActive && <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-black">目前</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Action Button: Immediately scrolls back to the top of the currently active section */}
            <button
              onClick={() => {
                scrollToSection(activeSection);
                setIsFloatMenuOpen(false);
              }}
              className="flex items-center gap-1.5 bg-[#00bdd6] hover:bg-[#00a8c0] active:scale-95 text-white font-extrabold text-xs px-4.5 py-3.5 rounded-full shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 cursor-pointer border border-cyan-400/20 group"
              title={`點擊快速回到「${
                activeSection === 'overview' ? '郵輪與日程' :
                activeSection === 'cost' ? '自費與回條' :
                activeSection === 'discuss' ? '景點討論區' :
                activeSection === 'itinerary-plan' ? '時間路線規劃' :
                activeSection === 'shopping-list' ? '採購與筆記' : '郵輪與日程'
              }」的最上方`}
            >
              <span>{
                activeSection === 'overview' ? '郵輪與日程' :
                activeSection === 'cost' ? '自費與回條' :
                activeSection === 'discuss' ? '景點討論區' :
                activeSection === 'itinerary-plan' ? '時間路線規劃' :
                activeSection === 'shopping-list' ? '採購與筆記' : '郵輪與日程'
              }</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-black group-hover:translate-y-[-2px] transition-transform">⭡</span>
            </button>
            
            {/* Horizontal row of auxiliary utilities */}
            <div className="flex gap-2">
              {/* Quick Jump Anchor Menu Toggle */}
              <button
                onClick={() => setIsFloatMenuOpen(!isFloatMenuOpen)}
                className={`flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer active:scale-95 ${
                  isFloatMenuOpen 
                    ? 'bg-indigo-600 border border-indigo-500 text-white shadow-indigo-500/20' 
                    : 'bg-white hover:bg-sky-50 text-[#00bdd6] border border-sky-100 shadow-cyan-500/10'
                }`}
                title="快速跳航選單"
              >
                <span className="text-base font-bold">⚓</span>
              </button>

              {/* Scroll back to TOP Button */}
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsFloatMenuOpen(false);
                }}
                className="flex items-center justify-center w-11 h-11 bg-white hover:bg-sky-50 active:scale-95 text-[#00bdd6] border border-sky-100 rounded-full shadow-lg shadow-cyan-500/10 transition-all hover:-translate-y-0.5 cursor-pointer group"
                title="回到最上面"
              >
                <div className="flex flex-col items-center justify-center">
                  <MiniShip className="h-4 w-5 text-[#00bdd6] group-hover:animate-bounce" />
                  <span className="text-[7px] font-black tracking-tighter leading-none mt-0.5">TOP</span>
                </div>
              </button>
            </div>
          </div>
        );
      })()}

      {/* ===== CUSTOM DELETE CONFIRMATION MODAL (Reliable inside iFrame!) ===== */}
      {deleteConfirmOpen && spotToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-xl font-bold">
                ⚠️
              </div>
              <h3 className="text-base font-black text-slate-800">
                確定要刪除此行程嗎？
              </h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">
                確定要刪除討論區推薦的景點 <br />
                <span className="text-rose-600 font-extrabold">「{spotToDelete.name}」</span> 嗎？
              </p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSpotToDelete(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs py-3 rounded-2xl transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteSpot(spotToDelete.port, spotToDelete.id);
                  setDeleteConfirmOpen(false);
                  setSpotToDelete(null);
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg shadow-rose-500/10 transition-all cursor-pointer"
              >
                是，確定刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== GLOBAL LIGHTBOX FOR APP IMAGES ===== */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <img src={lightboxImage} alt="Reference Fullscreen" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-slate-900/80 hover:bg-rose-600 text-white p-2.5 rounded-full transition-all cursor-pointer"
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
