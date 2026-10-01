import { useQuery } from "@tanstack/react-query";
import { fetchAdminNotifications } from "./notifications.api";
import { NotificationsQueryParams } from "../types/notifications.types";

export const useAdminNotificationsQuery = (params?: NotificationsQueryParams) => {
  return useQuery({
    queryKey: ["admin-notifications", params],
    queryFn: () => fetchAdminNotifications(params),
    staleTime: 30 * 1000,
  });
};
