export const APP_NAME = "Dejumblify Admin Panel";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.staging.dejumblefy.org/";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3050";

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth-token",
  AUTH_USER: "auth-user",
} as const;
