import { useQuery } from "@tanstack/react-query";
import { fetchLookups } from "./lookups.api";
import { LookupsQueryParams } from "../types/lookups.types";

export const useLookupsQuery = (params?: LookupsQueryParams) => {
  return useQuery({
    queryKey: ["admin-lookups", params?.type, params?.isActive],
    queryFn: () => fetchLookups(params),
    staleTime: 60 * 1000,
  });
};
