import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Fetches the TRM (Colombian Peso to USD exchange rate) for a specific date
 * from dolar-colombia.com
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<number>} - The TRM value as a number
 */
export async function fetchTRM(date) {
  try {
    // Check if the date is valid
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }
    
    // Make the request to dolar-colombia.com
    const url = `https://www.dolar-colombia.com/${date}`;
    const response = await axios.get(url);
    
    // Use cheerio to parse the HTML response
    const $ = cheerio.load(response.data);
    
    // Extract the TRM value 
    // Note: This selector might need to be updated if the website structure changes
    let trmText = $('.exchange-rate .rate').text().trim();
    
    // Clean and convert the text to a number
    if (!trmText) {
      throw new Error('TRM value not found on the page.');
    }
    
    // Remove any non-numeric characters except dots and commas
    trmText = trmText.replace(/[^\d.,]/g, '');
    
    // Convert the Colombian format (where comma is used as decimal separator) to a JS number
    const trmValue = parseFloat(trmText.replace(',', '.'));
    
    if (isNaN(trmValue)) {
      throw new Error('Failed to parse TRM value from the website.');
    }
    
    return trmValue;
  } catch (error) {
    console.error('Error fetching TRM:', error);
    throw error;
  }
}

/**
 * Gets the cached TRM value from localStorage if available
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number|null} - The cached TRM value or null if not found
 */
export function getCachedTRM(date) {
  try {
    const key = `trm-${date}`;
    const cachedValue = localStorage.getItem(key);
    
    if (cachedValue) {
      return parseFloat(cachedValue);
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
export function cacheTRM(date, trmValue) {
  try {
    const key = `trm-${date}`;
    localStorage.setItem(key, trmValue.toString());
  } catch (error) {
    console.error('Error caching TRM:', error);
  }
}

/**
 * Gets TRM for a date (first checks cache, then fetches if needed)
 * 
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<number>} - The TRM value
 */
export async function getTRM(date) {
  const cachedValue = getCachedTRM(date);
  
  if (cachedValue !== null) {
    return cachedValue;
  }
  
  const fetchedValue = await fetchTRM(date);
  cacheTRM(date, fetchedValue);
  
  return fetchedValue;
}