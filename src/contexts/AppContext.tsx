import React, { createContext, useContext, ReactNode } from 'react';

import { useAppState } from '../hooks/useAppState';
import { IncomeEntry, RecurringItem } from '../types';
import { exportToExcel } from '../utils/exportService';
import { showFutureDateTRMWarning, showTRMFetchError } from '../utils/toastUtils';
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
  reorderIncomeEntries: (newOrder: IncomeEntry[]) => void;
  addRecurringItem: () => void;
  removeRecurringItem: (itemId: number) => void;
  addIncomeEntry: () => void;
  removeIncomeEntry: (entryIndex: number) => void;
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

  const updateTRM = async (entryIndex: number, date: Date): Promise<void> => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const requestDate = new Date(date);
      requestDate.setHours(0, 0, 0, 0);

      if (requestDate > today) {
        console.warn('Cannot fetch TRM for future dates:', date);
        showFutureDateTRMWarning();
        setIncomeEntries(prevEntries => {
          const newEntries = [...prevEntries];
          newEntries[entryIndex] = {
            ...newEntries[entryIndex],
            trm: 0,
          };
          return newEntries;
        });
        return;
      }

      const formattedDate = date.toISOString().split('T')[0];
      const trm = await fetchTRM(formattedDate);

      setIncomeEntries(prevEntries => {
        const newEntries = [...prevEntries];
        const entry = newEntries[entryIndex];

        newEntries[entryIndex] = {
          ...entry,
          trm,
        };

        if (entry.currency === 'USD') {
          newEntries[entryIndex].cop = entry.usd * trm;
        } else {
          newEntries[entryIndex].usd = entry.cop / trm;
        }

        return newEntries;
      });
    } catch (error) {
      console.error('Error fetching TRM:', error);
      showTRMFetchError();
    }
  };

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

      if (field === 'currency') {
        if (value === 'COP') {
          // When switching to COP, convert USD to COP if TRM is available
          if (newEntries[entryIndex].trm > 0) {
            newEntries[entryIndex].cop = newEntries[entryIndex].usd * newEntries[entryIndex].trm;
            newEntries[entryIndex].usd = 0;
          } else {
            newEntries[entryIndex].cop = 0;
          }
        } else {
          // When switching to USD, convert COP to USD if TRM is available
          if (newEntries[entryIndex].trm > 0) {
            newEntries[entryIndex].usd = newEntries[entryIndex].cop / newEntries[entryIndex].trm;
            newEntries[entryIndex].cop = 0;
          } else {
            newEntries[entryIndex].usd = 0;
          }
        }
      } else if (field === 'usd') {
        // If USD value is reset to 0, also reset COP
        if (value === 0 && newEntries[entryIndex].currency === 'USD') {
          newEntries[entryIndex].cop = 0;
        }
        // If USD changed and currency is USD and TRM exists, recalculate COP
        else if (newEntries[entryIndex].currency === 'USD' && newEntries[entryIndex].trm > 0) {
          newEntries[entryIndex].cop = newEntries[entryIndex].usd * newEntries[entryIndex].trm;
        }
      } else if (field === 'cop') {
        // If COP value is reset to 0, also reset USD
        if (value === 0 && newEntries[entryIndex].currency === 'COP') {
          newEntries[entryIndex].usd = 0;
        }
        // If COP changed and currency is COP and TRM exists, recalculate USD
        else if (newEntries[entryIndex].currency === 'COP' && newEntries[entryIndex].trm > 0) {
          newEntries[entryIndex].usd = newEntries[entryIndex].cop / newEntries[entryIndex].trm;
        }
      } else if (field === 'trm') {
        // If TRM changed, recalculate based on the current currency
        if (newEntries[entryIndex].currency === 'USD') {
          newEntries[entryIndex].cop = newEntries[entryIndex].usd * newEntries[entryIndex].trm;
        } else {
          newEntries[entryIndex].usd = newEntries[entryIndex].cop / newEntries[entryIndex].trm;
        }
      }

      return newEntries;
    });
  };

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

  const removeRecurringItem = (itemId: number): void => {
    setRecurringItems(prevItems => {
      const items = Array.isArray(prevItems) ? prevItems : [];
      return items.filter(item => item.id !== itemId);
    });
  };

  const exportCurrentMonth = (): void => {
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    exportToExcel(incomeEntries, totalCOP, costosPercent, includeSolidarity, monthName);
  };

  const reorderRecurringItems = (newItems: RecurringItem[]): void => {
    if (Array.isArray(newItems) && newItems.length > 0) {
      setRecurringItems(newItems);
    }
  };

  const reorderIncomeEntries = (newEntries: IncomeEntry[]): void => {
    if (Array.isArray(newEntries) && newEntries.length > 0) {
      setIncomeEntries(newEntries);
    }
  };

  const addIncomeEntry = (): void => {
    setIncomeEntries(prevEntries => {
      if (!recurringItems || recurringItems.length === 0) {
        const newEntry: IncomeEntry = {
          itemId: Date.now(),
          name: 'New Entry',
          currency: 'USD',
          usd: 0,
          date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
          trm: 0,
          cop: 0,
        };
        return [...prevEntries, newEntry];
      }

      const defaultItem = recurringItems[0];
      const newEntry: IncomeEntry = {
        itemId: defaultItem.id,
        name: defaultItem.name,
        currency: 'USD',
        usd: defaultItem.defaultUSD,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15),
        trm: 0,
        cop: 0,
      };
      return [...prevEntries, newEntry];
    });
  };

  const removeIncomeEntry = (entryIndex: number): void => {
    setIncomeEntries(prevEntries => {
      const newEntries = [...prevEntries];
      newEntries.splice(entryIndex, 1);
      return newEntries;
    });
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
    reorderIncomeEntries,
    addRecurringItem,
    removeRecurringItem,
    addIncomeEntry,
    removeIncomeEntry,
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
