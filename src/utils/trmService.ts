import axios from 'axios';

import { STORAGE_KEYS } from '../config';

/**
 * Fetches the TRM (Colombian Peso to USD exchange rate) for a specific date
 * from trm-colombia API
 *
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<number>} - The TRM value as a number
 */
export async function fetchTRM(date: string): Promise<number> {
  try {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('Invalid date format for TRM fetch:', date);
      return 0;
    }

    const cachedValue = getCachedTRM(date);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const url = `https://trm-colombia.vercel.app/?date=${date}`;

    const response = await axios.get(url, {
      timeout: 10000,
    });

    // Check if the response is successful
    if (!response.data || !response.data.data || !response.data.data.success) {
      console.error('Failed to fetch TRM from API:', response.data);
      return 0;
    }

    const trmValue = response.data.data.value;

    if (typeof trmValue !== 'number' || isNaN(trmValue)) {
      console.error('Invalid TRM value from API:', trmValue);
      return 0;
    }

    // Cache the value
    cacheTRM(date, trmValue);

    return trmValue;
  } catch (error) {
    console.error('Error fetching TRM:', error instanceof Error ? error.message : error);

    // Return 0 to indicate failure and allow manual entry
    return 0;
  }
}

/**
 * Gets the cached TRM value from localStorage if available
 *
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number|null} - The cached TRM value or null if not found
 */
export function getCachedTRM(date: string): number | null {
  try {
    const key = `${STORAGE_KEYS.TRM_CACHE_PREFIX}${date}`;
    const cachedValue = localStorage.getItem(key);

    if (cachedValue) {
      const parsed = parseFloat(cachedValue);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting cached TRM:', error);
    return null;
  }
}

/**
 * Caches a TRM value in localStorage
 *
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} trmValue - The TRM value to cache
 */
export function cacheTRM(date: string, trmValue: number): void {
  try {
    const key = `${STORAGE_KEYS.TRM_CACHE_PREFIX}${date}`;
    localStorage.setItem(key, trmValue.toString());
  } catch (error) {
    console.error('Error caching TRM:', error);
  }
}

/**
 * Gets TRM for a date
 *
 * @param {Date|string} dateObj - Date object or string
 * @returns {Promise<number>} - The TRM value
 */
export async function getTRM(dateObj: Date | string): Promise<number> {
  try {
    const date = typeof dateObj === 'string' ? dateObj : dateObj.toISOString().split('T')[0];

    return await fetchTRM(date);
  } catch (error) {
    console.error('Error in getTRM:', error);
    return 0;
  }
}
