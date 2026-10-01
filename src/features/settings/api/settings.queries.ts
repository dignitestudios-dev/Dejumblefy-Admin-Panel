import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "./settings.api";

export const SETTINGS_QUERY_KEY = ["admin-settings"];

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => fetchSettings(),
    staleTime: 60 * 1000,
  });
};
