import { useEffect, useState } from 'react';

import { APP_CONFIG, DEFAULT_RECURRING_ITEMS, STORAGE_KEYS } from '../config';
import { IncomeEntry, RecurringItem } from '../types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storageService';

/**
 * Custom hook to manage application state
 * Handles initialization, persistence, and state updates
 */
export const useAppState = () => {
  const getInitialRecurringItems = (): RecurringItem[] => {
    const storedItems = loadFromLocalStorage<RecurringItem[]>(STORAGE_KEYS.RECURRING_ITEMS);
    return Array.isArray(storedItems) && storedItems.length > 0
      ? storedItems
      : DEFAULT_RECURRING_ITEMS;
  };

  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>(getInitialRecurringItems());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [costosPercent, setCostosPercent] = useState<number>(
    loadFromLocalStorage<number>(STORAGE_KEYS.COSTOS_PERCENT) || APP_CONFIG.DEFAULT_COSTOS_PERCENT
  );
  const [includeSolidarity, setIncludeSolidarity] = useState<boolean>(
    loadFromLocalStorage<boolean>(STORAGE_KEYS.INCLUDE_SOLIDARITY) ||
      APP_CONFIG.DEFAULT_INCLUDE_SOLIDARITY
  );
  const [totalCOP, setTotalCOP] = useState<number>(0);

  const getMonthKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  useEffect(() => {
    const monthKey = getMonthKey(currentMonth);
    const savedEntries = loadFromLocalStorage<IncomeEntry[]>(
      `${STORAGE_KEYS.ENTRIES_PREFIX}${monthKey}`
    );

    if (Array.isArray(savedEntries) && savedEntries.length > 0) {
      const updatedEntries = savedEntries.map(entry => {
        const matchingItem = recurringItems.find(item => item.id === entry.itemId);
        if (!entry.currency) {
          entry.currency = 'USD';
        }
        if (matchingItem && entry.name !== matchingItem.name) {
          return { ...entry, name: matchingItem.name };
        }
        return entry;
      });

      recurringItems.forEach(item => {
        if (!updatedEntries.some(entry => entry.itemId === item.id)) {
          updatedEntries.push({
            itemId: item.id,
            name: item.name,
            currency: 'USD',
            usd: item.defaultUSD,
            date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
            trm: 0,
            cop: 0,
          });
        }
      });

      setIncomeEntries(updatedEntries);
    } else {
      const newEntries: IncomeEntry[] = recurringItems.map(item => ({
        itemId: item.id,
        name: item.name,
        currency: 'USD',
        usd: item.defaultUSD,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
        trm: 0,
        cop: 0,
      }));
      setIncomeEntries(newEntries);
    }
  }, [currentMonth, recurringItems]);

  useEffect(() => {
    const total = incomeEntries.reduce((sum, entry) => sum + (entry.cop || 0), 0);
    setTotalCOP(total);
  }, [incomeEntries]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.RECURRING_ITEMS, recurringItems);
    saveToLocalStorage(STORAGE_KEYS.COSTOS_PERCENT, costosPercent);
    saveToLocalStorage(STORAGE_KEYS.INCLUDE_SOLIDARITY, includeSolidarity);

    const monthKey = getMonthKey(currentMonth);
    saveToLocalStorage(`${STORAGE_KEYS.ENTRIES_PREFIX}${monthKey}`, incomeEntries);
  }, [recurringItems, costosPercent, includeSolidarity, incomeEntries, currentMonth]);

  return {
    // State
    recurringItems,
    setRecurringItems,
    currentMonth,
    setCurrentMonth,
    incomeEntries,
    setIncomeEntries,
    costosPercent,
    setCostosPercent,
    includeSolidarity,
    setIncludeSolidarity,
    totalCOP,

    // Derived state
    monthKey: getMonthKey(currentMonth),
  };
};
