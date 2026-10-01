import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "@/utils/constants";
import { AUTH_REDIRECT } from "@/config/routes";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        if (!window.location.pathname.startsWith(AUTH_REDIRECT)) {
          const currentUrl = window.location.pathname + window.location.search;
          const redirectUrl = `${AUTH_REDIRECT}?returnUrl=${encodeURIComponent(currentUrl)}`;
          window.location.href = redirectUrl;
        }
      } else if (!status || status >= 500) {
        // Dispatch custom event to trigger ServerErrorDialog
        window.dispatchEvent(new CustomEvent("app:server-error"));
      }
    }

    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
