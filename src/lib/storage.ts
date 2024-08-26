/* eslint-disable @typescript-eslint/no-explicit-any */
const prefix = 'atona_';

export const localStorage = {
  get(key: string, defaultValue?: any) {
    const value = window.localStorage.getItem(prefix + key);
    if (value) {
      return JSON.parse(value);
    }
    return defaultValue;
  },
  set(key: string, value: any) {
    value = value === undefined ? "" : JSON.stringify(value);
    window.localStorage.setItem(prefix + key, value);
  },
  remove(key: string) {
    window.localStorage.removeItem(prefix + key);
  },
  clear() {
    window.localStorage.clear();
  },
};

export const sessionStorage = {
  get(key: string, defaultValue?: any) {
    const value = window.sessionStorage.getItem(prefix + key);
    if (value) {
      return JSON.parse(value);
    }
    return defaultValue;
  },
  set(key: string, value: any) {
    value = value === undefined ? "" : JSON.stringify(value);
    window.sessionStorage.setItem(prefix + key, value);
  },
  remove(key: string) {
    window.sessionStorage.removeItem(prefix + key);
  },
  clear() {
    window.sessionStorage.clear();
  },
};