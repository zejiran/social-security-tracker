import React, { createContext, useContext, ReactNode } from 'react';

import { useAppState } from '../hooks/useAppState';
import { IncomeEntry, RecurringItem } from '../types';
import { exportToExcel } from '../utils/exportService';
import { fetchTRM } from '../utils/trmService';

interface AppContextType {
  // State
  recurringItems: RecurringItem[];
  currentMonth: Date;
  incomeEntries: IncomeEntry[];
  costosPercent: number;
  includeSolidarity: boolean;
  totalCOP: number;

  // Actions
  setCurrentMonth: (date: Date) => void;
  handleEntryChange: (entryIndex: number, field: string, value: string | number | Date) => void;
  handleRecurringItemChange: (
    itemId: number,
    field: string,
    value: string | number | boolean
  ) => void;
  reorderRecurringItems: (newOrder: RecurringItem[]) => void;
  addRecurringItem: () => void;
  removeRecurringItem: (itemId: number) => void;
  setCostosPercent: (value: number) => void;
  setIncludeSolidarity: (value: boolean) => void;
  updateTRM: (entryIndex: number, date: Date) => Promise<void>;
  exportCurrentMonth: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
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
  } = useAppState();

  // Update TRM for an entry
  const updateTRM = async (entryIndex: number, date: Date): Promise<void> => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const trm = await fetchTRM(formattedDate);

      setIncomeEntries(prevEntries => {
        const newEntries = [...prevEntries];
        newEntries[entryIndex] = {
          ...newEntries[entryIndex],
          trm,
          cop: newEntries[entryIndex].usd * trm,
        };
        return newEntries;
      });
    } catch (error) {
      console.error('Error fetching TRM:', error);
    }
  };

  // Update entry field
  const handleEntryChange = (
    entryIndex: number,
    field: string,
    value: string | number | Date
  ): void => {
    setIncomeEntries(prevEntries => {
      const newEntries = [...prevEntries];
      newEntries[entryIndex] = {
        ...newEntries[entryIndex],
        [field]: value,
      };

      // If USD or TRM changed, recalculate COP
      if (field === 'usd' || field === 'trm') {
        newEntries[entryIndex].cop = newEntries[entryIndex].usd * newEntries[entryIndex].trm;
      }

      return newEntries;
    });
  };

  // Update recurring item
  const handleRecurringItemChange = (
    itemId: number,
    field: string,
    value: string | number | boolean
  ): void => {
    setRecurringItems(prevItems => {
      const items = Array.isArray(prevItems) ? prevItems : [];
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });
    });
  };

  // Add new recurring item
  const addRecurringItem = (): void => {
    setRecurringItems(prevItems => {
      const items = Array.isArray(prevItems) ? prevItems : [];
      const maxId = items.length > 0 ? Math.max(...items.map(item => Number(item.id) || 0)) : 0;
      const newItem: RecurringItem = {
        id: maxId + 1,
        name: 'New Item',
        defaultUSD: 0,
      };
      return [...items, newItem];
    });
  };

  // Remove recurring item
  const removeRecurringItem = (itemId: number): void => {
    setRecurringItems(prevItems => {
      const items = Array.isArray(prevItems) ? prevItems : [];
      return items.filter(item => item.id !== itemId);
    });
  };

  // Export current data to Excel
  const exportCurrentMonth = (): void => {
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    exportToExcel(incomeEntries, totalCOP, costosPercent, includeSolidarity, monthName);
  };

  const reorderRecurringItems = (newItems: RecurringItem[]): void => {
    if (Array.isArray(newItems) && newItems.length > 0) {
      setRecurringItems(newItems);
    }
  };

  const value = {
    recurringItems,
    currentMonth,
    incomeEntries,
    costosPercent,
    includeSolidarity,
    totalCOP,

    setCurrentMonth,
    handleEntryChange,
    handleRecurringItemChange,
    reorderRecurringItems,
    addRecurringItem,
    removeRecurringItem,
    setCostosPercent,
    setIncludeSolidarity,
    updateTRM,
    exportCurrentMonth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
