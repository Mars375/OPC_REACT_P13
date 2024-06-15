import CryptoJS from 'crypto-js';

const SECRET_KEY =
  import.meta.env.REACT_APP_SECRET_KEY_CRYPTO || 'default-secret-key';

/**
 * Function to set an item in localStorage with an expiration date.
 * The value is encrypted before being stored.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {string} value - The value to be stored.
 * @param {number} days - The number of days until the item expires.
 */
export function setItemWithExpiry(key: string, value: string, days: number) {
  const now = new Date();
  const expiryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const item = {
    value: CryptoJS.AES.encrypt(value, SECRET_KEY).toString(),
    expiry: expiryDate.toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Function to get an item from localStorage and check its expiration.
 * The value is decrypted before being returned.
 *
 * @param {string} key - The key under which the value is stored.
 * @returns {string | null} The decrypted value if it exists and is not expired, otherwise null.
 */
export function getItemWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.toISOString() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  const bytes = CryptoJS.AES.decrypt(item.value, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
