import axios from "axios";

import { getStoredToken, removeStoredToken } from "@/utils/storage";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api" : backendUrl);

export const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getStoredToken();
    const status = error.response?.status;

    if (token && status === 401) {
      removeStoredToken();
      window.dispatchEvent(new CustomEvent("pixshare:auth-expired"));
    }

    return Promise.reject(error);
  },
);
