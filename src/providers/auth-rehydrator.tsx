"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { setCredentials, setAuthLoading } from "@/store/slices/auth.slice";
import { STORAGE_KEYS } from "@/utils/constants";
import { User } from "@/types/common";

interface AuthRehydratorProps {
  children: React.ReactNode;
}

export default function AuthRehydrator({ children }: AuthRehydratorProps) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        dispatch(setCredentials({ user, accessToken: token }));
      } else {
        dispatch(setAuthLoading(false));
      }
    } catch (error) {
      console.error("Failed to rehydrate auth state:", error);
      dispatch(setAuthLoading(false));
    } finally {
      setIsReady(true);
    }
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
