import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sipplate_v2';

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useEntries() {
  const [entries, setEntries] = useState(loadEntries);

  const saveEntry = useCallback((date, entryData) => {
    const key = dateKey(date);
    setEntries(prev => {
      const next = { ...prev, [key]: { ...entryData, saved: new Date().toISOString() } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getEntry = useCallback((date) => {
    return entries[dateKey(date)] || null;
  }, [entries]);

  const getMonthEntries = useCallback((year, month) => {
    return Object.entries(entries).filter(([k]) => {
      const d = new Date(k);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [entries]);

  const getStreak = useCallback(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (entries[dateKey(d)]) streak++;
      else break;
    }
    return streak;
  }, [entries]);

  return { entries, saveEntry, getEntry, getMonthEntries, getStreak, dateKey };
}
