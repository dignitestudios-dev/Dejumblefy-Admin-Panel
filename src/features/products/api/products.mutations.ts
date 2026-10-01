import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  setProductStatus,
  checkProductLink,
  deleteProduct,
  aiSuggestTags,
  importProductsCsv,
} from "./products.api";
import {
  CreateProductPayload,
  UpdateProductPayload,
  AISuggestTagsPayload,
} from "../types/products.types";

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-detail", id] });
    },
  });
};

export const useSetProductStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setProductStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-detail", id] });
    },
  });
};

export const useCheckProductLinkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => checkProductLink(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-detail", id] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};

export const useAISuggestTagsMutation = () => {
  return useMutation({
    mutationFn: (payload: AISuggestTagsPayload) => aiSuggestTags(payload),
  });
};

export const useImportProductsCsvMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, dryRun }: { file: File; dryRun?: boolean }) =>
      importProductsCsv(file, dryRun),
    onSuccess: (data) => {
      if (!data.dryRun) {
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      }
    },
  });
};
