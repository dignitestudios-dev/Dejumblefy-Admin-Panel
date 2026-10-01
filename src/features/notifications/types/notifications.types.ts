export type TargetAudience = "all" | "users" | "segment";
export type NotificationStatus = "sent" | "partial" | "failed";
export type BalanceFilter = "zero" | "positive" | "negative";

export interface NotificationSegment {
  hasPurchased?: boolean;
  balance?: BalanceFilter;
  signedUpFrom?: string;
  signedUpTo?: string;
  activeSince?: string;
}

export interface NotificationSendStats {
  recipients?: number;
  tokens?: number;
  success?: number;
  failed?: number;
  totalUsers?: number;
  sentCount?: number;
  failedCount?: number;
}

export interface AdminNotificationItem {
  _id: string;
  title: string;
  description?: string | null;
  targetAudience: TargetAudience;
  audienceDetails?: {
    userIds?: string[];
    segment?: NotificationSegment;
  } | null;
  status: NotificationStatus;
  sendStats?: NotificationSendStats | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
}

export interface PaginatedNotificationsResponse {
  message: string;
  data: AdminNotificationItem[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface SendAdminNotificationPayload {
  title: string;
  description?: string;
  message?: string;
  targetAudience?: TargetAudience;
  userIds?: string[];
  segment?: NotificationSegment;
}

export interface SendAdminNotificationResponse {
  message: string;
  data: {
    recipients: number;
    tokens: number;
    success: number;
    failed: number;
  };
}
