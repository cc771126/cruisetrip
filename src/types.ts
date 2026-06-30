/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Spot {
  id: string;
  name: string;
  cat: string;
  note: string;
  cost: string;
  map: string;
  author: string;
  color: string;
  voters: string[];
  created: number;
  images?: string[]; // Array of base64 compressed images
  selectedInItinerary?: boolean;
}

export interface Expense {
  id: string;
  payer: string;
  description: string;
  amount: number;
  currency: 'TWD' | 'JPY' | 'KRW';
  amountTWD: number;
  created: number;
}

export interface Memo {
  id: string;
  author: string;
  text: string;
  created: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  category: 'japan' | 'korea_oy' | 'korea_rx' | 'custom';
  addedBy: string;
  completed: boolean;
  created: number;
}

export interface DayItinerary {
  n: number;
  date: string;
  dow: string;
  icon: string;
  title: string;
  sub: string;
  port?: 'saseho' | 'busan';
  time: string;
  arr: string;
  dep: string;
  meals: string[];
  pts: string[];
  free: boolean;
}

export interface ShipHighlight {
  ic: string;
  t: string;
  tag: 'free' | 'paid';
  d: string;
}

export interface NoteItem {
  ic: string;
  t: string;
  body: string;
}

export interface QALine {
  t: 'k' | 'm' | 'p';
  text: string;
}

export interface QAItem {
  q: string;
  lines: QALine[];
}

export interface QAGroup {
  ic: string;
  t: string;
  items: QAItem[];
}
