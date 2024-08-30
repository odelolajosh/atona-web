export const __DEV__ = import.meta.env.DEV;

export const apiUrl = import.meta.env.VITE_CHAT_API_URL ?? "";
export const wsUrl = apiUrl.replace("http", "ws").replace("/chat", "/ws");

export const prefix = "naero";