import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "./reports.api";
import { ReportsQueryParams } from "../types/reports.types";

export const useReportsQuery = (params?: ReportsQueryParams) => {
  return useQuery({
    queryKey: ["admin-reports", params],
    queryFn: () => fetchReports(params),
    staleTime: 60 * 1000,
  });
};
