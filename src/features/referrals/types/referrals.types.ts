export type ReferralRewardStatus = "earned" | "pending";

export interface ReferralUserSummary {
  _id: string;
  name: string | null;
  email: string;
  registeredAt?: string;
  status?: "active" | "suspended";
}

export interface ReferralItem {
  _id: string;
  referrer: ReferralUserSummary | null;
  referralCode: string | null;
  referredUser: ReferralUserSummary | null;
  referredAt: string;
  rewardStatus: ReferralRewardStatus;
  rewardAmount: number;
}

export interface ReferralRelatedActivity {
  _id: string;
  type: string;
  source: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

export interface ReferralDetailData extends ReferralItem {
  relatedActivity?: ReferralRelatedActivity[];
}

export interface ReferralsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReferralRewardStatus | "all";
  startDate?: string;
  endDate?: string;
}

export interface PaginatedReferralsResponse {
  message: string;
  data: {
    referrals: ReferralItem[];
  };
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
