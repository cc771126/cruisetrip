/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyA-5RGAX7EXzyzwxnJX1v3dtvEpRpUG9Tc",
  authDomain: "cruise-115.firebaseapp.com",
  projectId: "cruise-115",
  storageBucket: "cruise-115.firebasestorage.app",
  messagingSenderId: "28336659236",
  appId: "1:28336659236:web:075060d7aac2ea15afb1b1",
  databaseURL: "https://cruise-115-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Check if we can use LocalStorage
export function checkLocalStorageUsable(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

let firebaseApp;
let database;
let dbMode: 'cloud' | 'local' | 'mem' = 'local';

try {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  database = getDatabase(firebaseApp);
  dbMode = 'cloud';
} catch (error) {
  console.warn('Firebase initialization skipped or failed. Falling back to localStorage.', error);
  dbMode = checkLocalStorageUsable() ? 'local' : 'mem';
}

export { firebaseApp, database, dbMode };
