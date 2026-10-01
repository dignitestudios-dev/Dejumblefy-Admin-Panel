export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  totalTokensPurchased: number;
  totalTokensUsed: number;
  totalRevenue: number;
  totalReferrals: number;
  successfulReferrals: number;
}

export interface DashboardUserStatistics {
  newUsers: number;
  activeUsers: number;
  tokenUsers: number;
  referredUsers: number;
  growth: Array<{ date: string; count: number }>;
}

export interface DashboardAIUsage {
  totalImagesUploaded: number;
  totalAIAnalyses: number;
  totalAIUsers: number;
  avgAIInteractionsPerUser: number;
  totalTokensConsumed: number;
}

export interface DashboardRevenue {
  total: number;
  monthly: number;
  yearly: number;
  inRange: number;
  byPackage: Array<{
    packageId: string;
    name?: string;
    purchases: number;
    revenue: number;
  }>;
  growth: Array<{
    date: string;
    purchases: number;
    revenue: number;
  }>;
}

export type DashboardPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface DashboardFilters {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
  granularity?: "hour" | "day" | "month" | "year";
}

export interface DashboardData {
  overview: DashboardOverview;
  userStatistics: DashboardUserStatistics;
  aiUsage: DashboardAIUsage;
  revenue: DashboardRevenue;
  filters: Record<string, unknown>;
}
