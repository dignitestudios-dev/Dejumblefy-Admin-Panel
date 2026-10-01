import axiosInstance from "@/lib/axios";
import {
  LookupItem,
  LookupsQueryParams,
  CreateLookupPayload,
  UpdateLookupPayload,
  ReorderLookupsPayload,
} from "../types/lookups.types";

export const fetchLookups = async (params?: LookupsQueryParams): Promise<LookupItem[]> => {
  const queryParams: Record<string, string | boolean> = {};
  if (params?.type) queryParams.type = params.type;
  if (typeof params?.isActive === "boolean") queryParams.isActive = params.isActive;

  const response = await axiosInstance.get<{
    message: string;
    data: LookupItem[];
  }>("/admin/lookups", { params: queryParams });
  
  return response.data.data;
};

export const createLookup = async (payload: CreateLookupPayload): Promise<LookupItem> => {
  const response = await axiosInstance.post<{
    message: string;
    data: LookupItem;
  }>("/admin/lookups", payload);
  
  return response.data.data;
};

export const updateLookup = async (
  id: string,
  payload: UpdateLookupPayload
): Promise<LookupItem> => {
  const response = await axiosInstance.patch<{
    message: string;
    data: LookupItem;
  }>(`/admin/lookups/${id}`, payload);
  
  return response.data.data;
};

export const deleteLookup = async (id: string): Promise<LookupItem> => {
  const response = await axiosInstance.delete<{
    message: string;
    data: LookupItem;
  }>(`/admin/lookups/${id}`);
  
  return response.data.data;
};

export const reorderLookups = async (
  payload: ReorderLookupsPayload
): Promise<LookupItem[]> => {
  const response = await axiosInstance.put<{
    message: string;
    data: LookupItem[];
  }>("/admin/lookups/reorder", payload);
  
  return response.data.data;
};
