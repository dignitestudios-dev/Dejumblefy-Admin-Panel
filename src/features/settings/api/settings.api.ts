import axiosInstance from "@/lib/axios";
import {
  SettingsData,
  UpdateSettingsPayload,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "../types/settings.types";

export const fetchSettings = async (): Promise<SettingsData> => {
  try {
    const response = await axiosInstance.get<{
      message?: string;
      data: SettingsData | { data: SettingsData };
    }>("/setting");

    const payload = response.data?.data;
    if (payload && "data" in payload && typeof payload.data === "object") {
      return payload.data as SettingsData;
    }
    return (payload as SettingsData) || { notification: true };
  } catch {
    // Fallback to /notification/settings if /setting route is not available
    const response = await axiosInstance.get<{
      message?: string;
      data: SettingsData | { data: SettingsData };
    }>("/notification/settings");

    const payload = response.data?.data;
    if (payload && "data" in payload && typeof payload.data === "object") {
      return payload.data as SettingsData;
    }
    return (payload as SettingsData) || { notification: true };
  }
};

export const updateSettings = async (
  payload: UpdateSettingsPayload
): Promise<SettingsData> => {
  try {
    const response = await axiosInstance.put<{
      message?: string;
      data: SettingsData;
    }>("/setting", payload);
    return response.data?.data;
  } catch {
    const response = await axiosInstance.put<{
      message?: string;
      data: SettingsData;
    }>("/notification/settings", payload);
    return response.data?.data;
  }
};

export const changeAdminPassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  const response = await axiosInstance.put<ChangePasswordResponse>(
    "/admin/update-password",
    payload
  );
  return response.data;
};
