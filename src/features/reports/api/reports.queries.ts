import { useQuery } from "@tanstack/react-query";
import { fetchReports } from "./reports.api";
import { ReportsQueryParams } from "../types/reports.types";

export const useReportsQuery = (params?: ReportsQueryParams) => {
  const isCustom = params?.period === "custom";
  const hasBothDates =
    Boolean(params?.startDate?.trim()) && Boolean(params?.endDate?.trim());
  const isEnabled = !isCustom || hasBothDates;

  return useQuery({
    queryKey: ["admin-reports", params],
    queryFn: () => fetchReports(params),
    enabled: isEnabled,
    staleTime: 60 * 1000,
  });
};
