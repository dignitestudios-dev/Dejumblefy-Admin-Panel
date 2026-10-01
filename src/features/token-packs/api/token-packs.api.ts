import axiosInstance from "@/lib/axios";
import {
  TokenPackItem,
  TokenPacksQueryParams,
  CreateTokenPackPayload,
  UpdateTokenPackPayload,
  DeleteTokenPackResponse,
} from "../types/token-packs.types";

export const fetchTokenPacks = async (
  params?: TokenPacksQueryParams
): Promise<TokenPackItem[]> => {
  const queryParams: Record<string, boolean> = {};
  if (typeof params?.isActive === "boolean") {
    queryParams.isActive = params.isActive;
  }

  const response = await axiosInstance.get<{
    message: string;
    data: TokenPackItem[];
  }>("/admin/token-packs", {
    params: queryParams,
  });
  return response.data.data;
};

export const fetchTokenPackById = async (id: string): Promise<TokenPackItem> => {
  const response = await axiosInstance.get<{
    message: string;
    data: TokenPackItem;
  }>(`/admin/token-packs/${id}`);
  return response.data.data;
};

export const createTokenPack = async (
  payload: CreateTokenPackPayload
): Promise<TokenPackItem> => {
  const response = await axiosInstance.post<{
    message: string;
    data: TokenPackItem;
  }>("/admin/token-packs", payload);
  return response.data.data;
};

export const updateTokenPack = async (
  id: string,
  payload: UpdateTokenPackPayload
): Promise<TokenPackItem> => {
  const response = await axiosInstance.patch<{
    message: string;
    data: TokenPackItem;
  }>(`/admin/token-packs/${id}`, payload);
  return response.data.data;
};

export const setTokenPackStatus = async (
  id: string,
  isActive: boolean
): Promise<TokenPackItem> => {
  const response = await axiosInstance.patch<{
    message: string;
    data: TokenPackItem;
  }>(`/admin/token-packs/${id}/status`, { isActive });
  return response.data.data;
};

export const deleteTokenPack = async (
  id: string
): Promise<DeleteTokenPackResponse> => {
  const response = await axiosInstance.delete<{
    message: string;
    data: DeleteTokenPackResponse;
  }>(`/admin/token-packs/${id}`);
  return response.data.data;
};
