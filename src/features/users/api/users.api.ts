import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import {
  AdminUserListItem,
  UserDetailData,
  UsersQueryParams,
  AdjustTokensPayload,
  UpdateUserPayload,
  ToggleBlockPayload,
  LedgerItem,
  PaginatedUsersResponse,
} from "../types/users.types";

export const fetchUsers = async (params?: UsersQueryParams): Promise<PaginatedUsersResponse> => {
  const response = await axiosInstance.get<PaginatedUsersResponse>("/admin/users", { params });
  return response.data;
};

export const fetchUserById = async (id: string): Promise<UserDetailData> => {
  const response = await axiosInstance.get<ApiResponse<UserDetailData>>(`/admin/users/${id}`);
  return response.data.data;
};

export const fetchUserLedger = async (
  id: string,
  params?: { page?: number; limit?: number }
): Promise<{ data: LedgerItem[]; pagination: Record<string, unknown> }> => {
  const response = await axiosInstance.get<{
    message: string;
    data: LedgerItem[];
    pagination: Record<string, unknown>;
  }>(`/admin/users/${id}/ledger`, { params });
  return response.data;
};

export const fetchUserActivity = async (
  id: string,
  params?: {
    type?: import("../types/users.types").UserActivityType;
    page?: number;
    limit?: number;
  }
): Promise<import("../types/users.types").UserActivityResponse> => {
  const response = await axiosInstance.get<{
    message?: string;
    data?: import("../types/users.types").UserActivityResponse;
    items?: import("../types/users.types").UserActivityItem[];
    pagination?: any;
  }>(`/admin/users/${id}/activity`, { params });

  if (response.data.data?.items) {
    return response.data.data;
  }
  return {
    items: response.data.items || (response.data as any)?.data || [],
    pagination: response.data.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
  };
};


export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<AdminUserListItem> => {
  const response = await axiosInstance.patch<ApiResponse<AdminUserListItem>>(
    `/admin/users/${id}`,
    payload
  );
  return response.data.data;
};

export const adjustUserTokens = async (
  id: string,
  payload: AdjustTokensPayload
): Promise<unknown> => {
  const response = await axiosInstance.post<ApiResponse<unknown>>(
    `/admin/users/${id}/tokens`,
    payload
  );
  return response.data.data;
};

export const toggleBlockUser = async (
  id: string,
  payload: ToggleBlockPayload
): Promise<unknown> => {
  const response = await axiosInstance.put<ApiResponse<unknown>>(
    `/admin/user/${id}/block/toggle`,
    payload
  );
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<unknown> => {
  const response = await axiosInstance.delete<ApiResponse<unknown>>(`/admin/users/${id}`);
  return response.data.data;
};
