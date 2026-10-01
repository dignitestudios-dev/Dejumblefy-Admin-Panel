export interface AdminUserListItem {
  _id: string;
  name: string | null;
  email: string;
  role?: string;
  tokenBalance: number;
  isDeactivatedByAdmin: boolean;
  status?: "active" | "suspended";
  isEmailVerified?: boolean;
  isProfileCompleted?: boolean;
  referralCode?: string | null;
  registeredAt?: string;
  referredBy?: {
    _id: string;
    name: string | null;
    email: string;
  } | null;
  profilePicture?: {
    location: string;
  } | null;
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
  status?: "all" | "active" | "suspended";
  isActive?: boolean;
  isVerified?: boolean;
  role?: string;
  referred?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "tokenBalance" | "name";
  sortOrder?: "asc" | "desc";
  minTokenBalance?: number;
  maxTokenBalance?: number;
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

