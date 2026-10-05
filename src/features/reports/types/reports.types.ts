export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";
export type ReportGranularity = "hour" | "day" | "month" | "year";
export type ReportSectionType = "all" | "users" | "tokens" | "ai" | "revenue" | "clicks";

export interface ReportsQueryParams {
  period?: ReportPeriod;
  granularity?: ReportGranularity;
  startDate?: string;
  endDate?: string;
  type?: ReportSectionType;
  limit?: number;
}

export interface UserReportData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  growth?: Array<{ date: string; count: number }>;
}

export interface TokenReportData {
  totalTokensPurchased: number;
  totalTokensSpent: number;
  totalTokensRefundedForFailures: number;
  totalTokensUsed: number;
  totalTokensStoreRefunded?: number;
  totalTokensFromSignupBonus: number;
  totalTokensFromReferrals: number;
  totalTokensAdminCredited: number;
  totalTokensAdminDebited?: number;
  totalUnusedTokens: number;
  timeSeries?: Array<{ date: string; purchased: number; spent: number }>;
  topSpenders?: Array<{
    _id: string;
    name: string | null;
    email: string;
    tokens?: number;
    tokensSpent?: number;
  }>;
}

export interface AIReportData {
  chatsCount: number;
  messagesCount: number;
  imagesCount: number;
  mostActiveUsers?: Array<{
    _id: string;
    name: string | null;
    email: string;
    messages?: number;
    chats?: number;
  }>;
}

export interface RevenueByPackageItem {
  packageId?: string;
  packageName?: string;
  name?: string;
  tokens?: number;
  count?: number;
  purchases?: number;
  revenue?: number;
  totalRevenue?: number;
}

export interface RevenueGrowthItem {
  date?: string;
  period?: string;
  revenue?: number;
  purchases?: number;
}

export interface RevenueReportData {
  totalRevenue: number;
  netRevenue?: number;
  monthlyRevenue?: number;
  yearlyRevenue?: number;
  tokenPurchaseRevenue?: number;
  tokenPurchases?: number;
  tokensSold?: number;
  refundedPurchases?: number;
  refundedRevenue?: number;
  revenueByPackage?: RevenueByPackageItem[];
  growth?: RevenueGrowthItem[];
  transactionsCount?: number;
  averageOrderValue?: number;
  revenueTimeSeries?: Array<{ date: string; revenue: number }>;
}

export interface ClickProductItem {
  clicks: number;
  productId: string;
  title: string;
  asin: string;
  uniqueUsers?: number;
  imageUrl?: string | null;
  defaultLink?: string;
  _id?: string;
  clickCount?: number;
}

export interface ClickCategoryItem {
  category: string;
  clicks: number;
}

export interface ClickOverTimeItem {
  date: string;
  clicks: number;
}

export interface ClicksReportData {
  totalClicks: number;
  byProduct?: ClickProductItem[];
  byCategory?: ClickCategoryItem[];
  overTime?: ClickOverTimeItem[];
  topProducts?: Array<{
    _id?: string;
    productId?: string;
    asin: string;
    title: string;
    clickCount?: number;
    clicks?: number;
    defaultLink?: string;
    imageUrl?: string | null;
    uniqueUsers?: number;
  }>;
}

export interface ReportsResponseData {
  type: string;
  filters: {
    start: string;
    end: string;
    period?: string;
    granularity?: string;
  };
  users?: UserReportData;
  tokens?: TokenReportData;
  ai?: AIReportData;
  revenue?: RevenueReportData;
  clicks?: ClicksReportData;
}
