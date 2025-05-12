export const APP_CONFIG = {
  DEFAULT_TRM: 4000,
  DEFAULT_COSTOS_PERCENT: 0.6117,
  DEFAULT_INCLUDE_SOLIDARITY: false,
  TRM_API_URL: 'https://trm-colombia.vercel.app/',
  STORAGE_VERSION: '1.0.0',
  FORMULA: {
    BASE_PERCENTAGE: 0.4,
    HEALTH_PERCENTAGE: 0.125,
    PENSION_PERCENTAGE: 0.16,
    SOLIDARITY_PERCENTAGE: 0.01,
  },
  ROUNDING: {
    UNIT: 100, // Round to nearest 100 COP
  },
  DATE_FORMAT: {
    MONTH_YEAR: 'MMMM yyyy',
    FULL_DATE: 'yyyy-MM-dd',
  },
};

export const DEFAULT_RECURRING_ITEMS = [
  { id: 1, name: 'Payment (1- 15)', defaultUSD: 2000 },
  { id: 2, name: 'Payment (16 - 30)', defaultUSD: 2000 },
  { id: 3, name: 'Reembolso deportivo', defaultUSD: 40 },
  { id: 4, name: 'Reembolso internet', defaultUSD: 37 },
  { id: 5, name: 'Medicamentos Seguro', defaultUSD: 0 },
];

export const STORAGE_KEYS = {
  RECURRING_ITEMS: 'recurringItems',
  COSTOS_PERCENT: 'costosPercent',
  INCLUDE_SOLIDARITY: 'includeSolidarity',
  ENTRIES_PREFIX: 'entries-',
  TRM_CACHE_PREFIX: 'trm-',
  SETTINGS: 'settings',
};
