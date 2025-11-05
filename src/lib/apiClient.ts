// src/lib/apiClient.ts
import axios from "axios";

export const eventbriteApi = axios.create({
  baseURL: "https://www.eventbriteapi.com/v3",
  headers: { "Content-Type": "application/json" },
});

// ensure every request has the freshest token
eventbriteApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("eventbrite_token") ||
    import.meta.env.VITE_EVENTBRITE_API_TOKEN; // dev fallback
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
});
