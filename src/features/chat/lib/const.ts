export const __DEV__ = false;

export const apiUrl = import.meta.env.VITE_CHAT_API_URL ?? "";
export const wsUrl = apiUrl.replace("http", "ws");