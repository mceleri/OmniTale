import { StateStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

export const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await idbGet<string>(name);
      return value || null;
    } catch (error) {
      console.error(`Error reading from IndexedDB key "${name}":`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await idbSet(name, value);
    } catch (error) {
      console.error(`Error writing to IndexedDB key "${name}":`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await idbDel(name);
    } catch (error) {
      console.error(`Error deleting IndexedDB key "${name}":`, error);
    }
  },
};
