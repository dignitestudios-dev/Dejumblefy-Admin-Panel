import { useQuery } from "@tanstack/react-query";
import { fetchReferrals, fetchReferralById } from "./referrals.api";
import { ReferralsQueryParams } from "../types/referrals.types";

export const useReferralsQuery = (params?: ReferralsQueryParams) => {
  return useQuery({
    queryKey: ["admin-referrals", params],
    queryFn: () => fetchReferrals(params),
    staleTime: 30 * 1000,
  });
};

export const useReferralDetailQuery = (referralId?: string | null) => {
  return useQuery({
    queryKey: ["admin-referral-detail", referralId],
    queryFn: () => (referralId ? fetchReferralById(referralId) : null),
    enabled: !!referralId,
  });
};
