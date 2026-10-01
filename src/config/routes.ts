export const PUBLIC_ROUTES = ["/"] as const;

export const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password"] as const;

export const PROTECTED_ROUTES = ["/dashboard"] as const;

export const AUTH_REDIRECT = "/login" as const;
export const DEFAULT_REDIRECT = "/dashboard" as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
} as const;
