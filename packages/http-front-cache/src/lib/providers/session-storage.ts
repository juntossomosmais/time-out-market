import { Provider } from '../types';

export const sessionStorageProvider: Provider = {
  getItem: (key) =>
    JSON.parse(sessionStorage.getItem(key) as string) as Uint8Array,
  setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
  removeItem: (key) => sessionStorage.removeItem(key),
};
