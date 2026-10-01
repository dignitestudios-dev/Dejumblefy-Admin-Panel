import axiosInstance from "@/lib/axios";
import {
  ProductItem,
  ProductsQueryParams,
  PaginatedProductsResponse,
  CreateProductPayload,
  UpdateProductPayload,
  AISuggestTagsPayload,
  AISuggestTagsResponse,
  ImportCsvResponse,
} from "../types/products.types";

export const fetchProducts = async (
  params?: ProductsQueryParams
): Promise<PaginatedProductsResponse> => {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.category) queryParams.category = params.category;
  if (typeof params?.isActive === "boolean") queryParams.isActive = params.isActive;
  if (params?.linkStatus) queryParams.linkStatus = params.linkStatus;
  if (params?.search) queryParams.search = params.search;

  const response = await axiosInstance.get<PaginatedProductsResponse>("/admin/products", {
    params: queryParams,
  });
  return response.data;
};

export const fetchProductById = async (id: string): Promise<ProductItem> => {
  const response = await axiosInstance.get<{
    message: string;
    data: ProductItem;
  }>(`/admin/products/${id}`);
  return response.data.data;
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<ProductItem> => {
  const response = await axiosInstance.post<{
    message: string;
    data: ProductItem;
  }>("/admin/products", payload);
  return response.data.data;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
): Promise<ProductItem> => {
  const response = await axiosInstance.patch<{
    message: string;
    data: ProductItem;
  }>(`/admin/products/${id}`, payload);
  return response.data.data;
};

export const setProductStatus = async (
  id: string,
  isActive: boolean
): Promise<ProductItem> => {
  const response = await axiosInstance.patch<{
    message: string;
    data: ProductItem;
  }>(`/admin/products/${id}/status`, { isActive });
  return response.data.data;
};

export const checkProductLink = async (id: string): Promise<ProductItem> => {
  const response = await axiosInstance.post<{
    message: string;
    data: ProductItem;
  }>(`/admin/products/${id}/check-link`);
  return response.data.data;
};

export const deleteProduct = async (
  id: string
): Promise<{ _id: string; deleted?: boolean; isActive?: boolean }> => {
  const response = await axiosInstance.delete<{
    message: string;
    data: { _id: string; deleted?: boolean; isActive?: boolean };
  }>(`/admin/products/${id}`);
  return response.data.data;
};

export const aiSuggestTags = async (
  payload: AISuggestTagsPayload
): Promise<AISuggestTagsResponse> => {
  const response = await axiosInstance.post<{
    message: string;
    data: AISuggestTagsResponse;
  }>("/admin/products/ai-suggest", payload);
  return response.data.data;
};

export const importProductsCsv = async (
  file: File,
  dryRun = false
): Promise<ImportCsvResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<{
    message: string;
    data: ImportCsvResponse;
  }>("/admin/products/import", formData, {
    params: { dryRun },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const downloadCsvTemplate = async (): Promise<void> => {
  const response = await axiosInstance.get("/admin/products/import/template", {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "products-template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
