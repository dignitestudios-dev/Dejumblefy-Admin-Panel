import { useQuery } from "@tanstack/react-query";
import { fetchTokenPacks, fetchTokenPackById } from "./token-packs.api";
import { TokenPacksQueryParams } from "../types/token-packs.types";

export const TOKEN_PACKS_QUERY_KEY = ["admin-token-packs"] as const;

export const useTokenPacksQuery = (params?: TokenPacksQueryParams) => {
  return useQuery({
    queryKey: [...TOKEN_PACKS_QUERY_KEY, params],
    queryFn: () => fetchTokenPacks(params),
  });
};

export const useTokenPackDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...TOKEN_PACKS_QUERY_KEY, id],
    queryFn: () => fetchTokenPackById(id),
    enabled: enabled && Boolean(id),
  });
};
