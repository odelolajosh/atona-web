const prefix = 'atona_';

export const storage = {
  get(key: string) {
    const value = localStorage.getItem(prefix + key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  set(key: string, value: any) {
    value = value === undefined ? "" : JSON.stringify(value);
    localStorage.setItem(prefix + key, value);
  },
  remove(key: string) {
    localStorage.removeItem(prefix + key);
  },
  clear() {
    localStorage.clear();
  },
};