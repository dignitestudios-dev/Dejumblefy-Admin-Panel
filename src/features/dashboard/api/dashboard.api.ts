import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { DashboardData, DashboardFilters } from "../types/dashboard.types";

export const fetchDashboardData = async (filters?: DashboardFilters): Promise<DashboardData> => {
  const response = await axiosInstance.get<ApiResponse<DashboardData>>("/admin/dashboard", {
    params: filters,
  });
  return response.data.data;
};
