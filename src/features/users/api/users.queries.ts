import { useQuery } from "@tanstack/react-query";
import { fetchUsers, fetchUserById, fetchUserLedger } from "./users.api";
import { UsersQueryParams } from "../types/users.types";

export const useUsersQuery = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchUsers(params),
    staleTime: 30 * 1000,
  });
};

export const useUserDetailQuery = (userId?: string | null) => {
  return useQuery({
    queryKey: ["admin-user-detail", userId],
    queryFn: () => (userId ? fetchUserById(userId) : null),
    enabled: !!userId,
  });
};

export const useUserLedgerQuery = (
  userId?: string | null,
  params?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ["admin-user-ledger", userId, params],
    queryFn: () => (userId ? fetchUserLedger(userId, params) : null),
    enabled: !!userId,
  });
};

export const useUserActivityQuery = (
  userId?: string | null,
  params?: {
    type?: import("../types/users.types").UserActivityType;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ["admin-user-activity", userId, params],
    queryFn: () =>
      userId
        ? import("./users.api").then((m) => m.fetchUserActivity(userId, params))
        : null,
    enabled: !!userId,
  });
};

