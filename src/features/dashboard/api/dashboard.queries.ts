import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "./dashboard.api";
import { DashboardFilters } from "../types/dashboard.types";

export const useDashboardQuery = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ["admin-dashboard", filters],
    queryFn: () => fetchDashboardData(filters),
    staleTime: 60 * 1000,
  });
};
