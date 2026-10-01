import axiosInstance from "@/lib/axios";
import {
  ReferralsQueryParams,
  PaginatedReferralsResponse,
  ReferralDetailData,
} from "../types/referrals.types";

export const fetchReferrals = async (
  params?: ReferralsQueryParams
): Promise<PaginatedReferralsResponse> => {
  const queryParams: Record<string, string | number> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.search) queryParams.search = params.search;
  if (params?.status && params.status !== "all") queryParams.status = params.status;
  if (params?.startDate) queryParams.startDate = params.startDate;
  if (params?.endDate) queryParams.endDate = params.endDate;

  const response = await axiosInstance.get<PaginatedReferralsResponse>("/admin/referrals", {
    params: queryParams,
  });
  return response.data;
};

export const fetchReferralById = async (id: string): Promise<ReferralDetailData> => {
  const response = await axiosInstance.get<{
    message: string;
    data: ReferralDetailData;
  }>(`/admin/referrals/${id}`);
  return response.data.data;
};
