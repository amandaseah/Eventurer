/**
 * @deprecated This IndexedDB implementation was used for local forum storage.
 * Forum data has been migrated to Firebase Firestore for real-time, cross-device functionality.
 * This file is kept for potential future local storage needs or migration purposes.
 */

const DB_NAME = 'EventForumDB';
const STORE_NAME = 'posts';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveToIndexedDB = async (key: string, data: any) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, key);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getFromIndexedDB = async (key: string) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Clean up old forum data from IndexedDB (optional)
 * Call this function if you want to remove legacy local forum data
 */
export const clearOldForumData = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.clear();
    console.log('Old forum data cleared from IndexedDB');
  } catch (error) {
    console.warn('Failed to clear old forum data:', error);
  }
};