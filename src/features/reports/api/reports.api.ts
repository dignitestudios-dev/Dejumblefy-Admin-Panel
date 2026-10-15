import axiosInstance from "@/lib/axios";
import {
  ReportsQueryParams,
  ReportsResponseData,
} from "../types/reports.types";

export const fetchReports = async (
  params?: ReportsQueryParams
): Promise<ReportsResponseData> => {
  const queryParams: Record<string, string | number> = {};
  const isCustom = params?.period === "custom";
  const hasBothDates =
    Boolean(params?.startDate?.trim()) && Boolean(params?.endDate?.trim());

  if (params?.period) {
    if (!isCustom || hasBothDates) {
      queryParams.period = params.period;
    }
  }

  if (params?.granularity) queryParams.granularity = params.granularity;

  if (hasBothDates) {
    queryParams.startDate = params!.startDate!.trim();
    queryParams.endDate = params!.endDate!.trim();
  }

  if (params?.type) queryParams.type = params.type;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await axiosInstance.get<{
    message: string;
    data: ReportsResponseData;
  }>("/admin/reports", { params: queryParams });
  return response.data.data;
};

export const exportReportCsv = async (params: ReportsQueryParams): Promise<void> => {
  const queryParams: Record<string, string | number> = {};
  const isCustom = params.period === "custom";
  const hasBothDates =
    Boolean(params.startDate?.trim()) && Boolean(params.endDate?.trim());

  if (params.period) {
    if (!isCustom || hasBothDates) {
      queryParams.period = params.period;
    }
  }

  if (params.granularity) queryParams.granularity = params.granularity;

  if (hasBothDates) {
    queryParams.startDate = params.startDate!.trim();
    queryParams.endDate = params.endDate!.trim();
  }

  if (params.type && params.type !== "all") queryParams.type = params.type;

  const response = await axiosInstance.get("/admin/reports/export", {
    params: queryParams,
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const filename = `dejumblefy-report-${params.type || "analytics"}-${params.period || "custom"}.csv`;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
