import localforage from 'localforage';

// Initialize localforage
localforage.config({
  name: 'social-security-tracker',
  storeName: 'tracker_data'
});

/**
 * Save data to local storage using localforage
 * 
 * @param {string} key - The key to store the data under
 * @param {any} data - The data to store
 * @returns {Promise<void>}
 */
export const saveToLocalStorage = async (key, data) => {
  try {
    await localforage.setItem(key, data);
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

/**
 * Load data from local storage using localforage
 * 
 * @param {string} key - The key to load data from
 * @returns {Promise<any>} - The stored data or null if not found
 */
export const loadFromLocalStorage = async (key) => {
  try {
    const data = await localforage.getItem(key);
    return data;
  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  }
};

/**
 * Load data from local storage synchronously (fallback to localStorage)
 * This is useful for initial renders where we need the data immediately
 * 
 * @param {string} key - The key to load data from
 * @returns {any} - The stored data or null if not found
 */
export const loadFromLocalStorageSync = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from local storage sync:', error);
    return null;
  }
};

/**
 * Remove data from local storage
 * 
 * @param {string} key - The key to remove
 * @returns {Promise<void>}
 */
export const removeFromLocalStorage = async (key) => {
  try {
    await localforage.removeItem(key);
  } catch (error) {
    console.error('Error removing from local storage:', error);
  }
};

/**
 * Clear all data from local storage
 * 
 * @returns {Promise<void>}
 */
export const clearLocalStorage = async () => {
  try {
    await localforage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};