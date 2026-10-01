import axiosInstance from "@/lib/axios";
import {
  NotificationsQueryParams,
  PaginatedNotificationsResponse,
  SendAdminNotificationPayload,
  SendAdminNotificationResponse,
} from "../types/notifications.types";

export const fetchAdminNotifications = async (
  params?: NotificationsQueryParams
): Promise<PaginatedNotificationsResponse> => {
  const queryParams: Record<string, number> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await axiosInstance.get<PaginatedNotificationsResponse>(
    "/admin/notifications",
    { params: queryParams }
  );
  return response.data;
};

export const sendAdminNotification = async (
  payload: SendAdminNotificationPayload
): Promise<SendAdminNotificationResponse["data"]> => {
  const response = await axiosInstance.post<{
    message: string;
    data: SendAdminNotificationResponse["data"];
  }>("/admin/notifications/send", payload);
  return response.data.data;
};
