export interface UserProfilePicture {
  _id?: string;
  location: string;
  mimetype?: string;
  size?: number;
}

export interface ReferredByUser {
  _id: string;
  name: string | null;
  email: string;
}

export interface AdminUserListItem {
  _id: string;
  name: string | null;
  email: string;
  role?: string;
  tokenBalance: number;
  isDeactivatedByAdmin: boolean;
  status?: "active" | "pending" | "suspended";
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  referralCode?: string | null;
  registeredAt?: string;
  referredBy?: ReferredByUser | null;
  profilePicture?: UserProfilePicture | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsersResponse {
  message: string;
  data: {
    users: AdminUserListItem[];
  };
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface UserTokenTotals {
  purchased: number;
  used: number;
  refunded: number;
  referralRewards: number;
}

export interface UserAIUsageSummary {
  chatsCount: number;
  messagesCount: number;
  imagesCount: number;
  totalChats?: number;
}

export interface UserDetailData extends AdminUserListItem {
  tokenTotals?: UserTokenTotals;
  aiUsage?: UserAIUsageSummary;
  totalReferrals?: number;
  lastLogin?: string | null;
  recentTransactions?: Array<{
    _id: string;
    amount: number;
    type: string;
    source: string;
    balanceAfter: number;
    note?: string;
    createdAt: string;
  }>;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "pending" | "suspended";
  minTokenBalance?: number;
  maxTokenBalance?: number;
  sortBy?: "createdAt" | "tokenBalance" | "name";
  sortOrder?: "asc" | "desc";
  referred?: boolean;
  startDate?: string;
  endDate?: string;
}

export type UserActivityType =
  | "logins"
  | "uploads"
  | "purchases"
  | "usage"
  | "transactions"
  | "ai"
  | "referrals";

export interface UserActivityItem {
  _id: string;
  type: string;
  description?: string;
  action?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  referredUser?: {
    _id: string;
    name: string | null;
    email: string;
  };
  rewardAmount?: number;
  rewardStatus?: "earned" | "pending" | string;
  createdAt: string;
  [key: string]: unknown;
}

export interface UserActivityResponse {
  items: UserActivityItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface AdjustTokensPayload {
  amount: number;
  note: string;
}

export interface UpdateUserPayload {
  name: string;
}

export interface ToggleBlockPayload {
  toggle: boolean;
}

export interface LedgerItem {
  _id: string;
  amount: number;
  type: string;
  source: string;
  balanceAfter: number;
  note?: string;
  createdAt: string;
}
