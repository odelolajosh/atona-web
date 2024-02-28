const prefix = 'atona_';

export const storage = {
  get(key: string) {
    return localStorage.getItem(prefix + key);
  },
  set(key: string, value: string) {
    localStorage.setItem(prefix + key, value);
  },
  remove(key: string) {
    localStorage.removeItem(prefix + key);
  },
  clear() {
    localStorage.clear();
  },
};