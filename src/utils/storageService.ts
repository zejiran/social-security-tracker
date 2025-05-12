import localforage from 'localforage';

// Initialize localforage
localforage.config({
  name: 'social-security-tracker',
  storeName: 'tracker_data',
});

/**
 * Save data to local storage
 * Uses localStorage for immediate access and localforage for larger data
 *
 * @param key - The key to store the data under
 * @param data - The data to store
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    // Use localStorage as immediate backup
    localStorage.setItem(key, JSON.stringify(data));

    // Also save to localforage for future retrieval
    localforage.setItem(key, data).catch(error => {
      console.error('Error saving to localforage:', error);
    });
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

/**
 * Load data from local storage
 * This uses synchronous localStorage for immediate access
 *
 * @param key - The key to load data from
 * @returns The stored data or null if not found
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    // Get from localStorage (synchronous)
    const item = localStorage.getItem(key);

    if (item) {
      return JSON.parse(item) as T;
    }

    return null;
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  }
};

/**
 * Asynchronously load data from localforage
 * Use when synchronous operation is not required
 *
 * @param key - The key to load data from
 * @returns Promise resolving to the stored data or null if not found
 */
export const loadFromLocalStorageAsync = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await localforage.getItem<T>(key);
    return data;
  } catch (error) {
    console.error('Error loading from localforage:', error);
    return null;
  }
};

/**
 * Remove data from local storage
 *
 * @param key - The key to remove
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
    localforage.removeItem(key).catch(error => {
      console.error('Error removing from localforage:', error);
    });
  } catch (error) {
    console.error('Error removing from local storage:', error);
  }
};

/**
 * Clear all data from local storage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
    localforage.clear().catch(error => {
      console.error('Error clearing localforage:', error);
    });
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};
