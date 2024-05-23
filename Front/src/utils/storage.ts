import CryptoJS from "crypto-js";

const SECRET_KEY =
	import.meta.env.REACT_APP_SECRET_KEY_CRYPTO || "default-secret-key";

export function setItemWithExpiry(key: string, value: string, days: number) {
	const now = new Date();
	const expiryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

	const item = {
		value: CryptoJS.AES.encrypt(value, SECRET_KEY).toString(),
		expiry: expiryDate.toISOString(),
	};

	localStorage.setItem(key, JSON.stringify(item));
}

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
