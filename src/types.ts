export interface RecurringItem {
  id: number;
  name: string;
  defaultUSD: number;
}

export interface IncomeEntry {
  itemId: number;
  name: string;
  currency: 'USD' | 'COP';
  usd: number;
  date: Date;
  trm: number;
  cop: number;
}

export interface SocialSecurityCalculation {
  base: number;
  health: number;
  pension: number;
  solidarity: number;
  total: number;
  roundedTotal: number;
}

export interface MonthlyData {
  entries: IncomeEntry[];
  totalCOP: number;
  costosPercent: number;
  includeSolidarity: boolean;
  calculation?: {
    direct: SocialSecurityCalculation;
    presumption: SocialSecurityCalculation;
  };
}

export interface UserSettings {
  recurringItems: RecurringItem[];
  defaultCostosPercent: number;
  defaultIncludeSolidarity: boolean;
}

export type TRMFetchFunction = (date: Date) => Promise<number>;
export type MonthChangeFunction = (newMonth: Date) => void;
export type EntryChangeFunction = (
  entryIndex: number,
  field: string,
  value: string | number | Date
) => void;
export type ItemChangeFunction = (
  itemId: number,
  field: string,
  value: string | number | boolean
) => void;
