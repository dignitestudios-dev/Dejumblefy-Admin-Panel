import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById } from "./products.api";
import { ProductsQueryParams } from "../types/products.types";

export const useProductsQuery = (params?: ProductsQueryParams) => {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 30 * 1000,
  });
};

export const useProductDetailQuery = (productId?: string | null) => {
  return useQuery({
    queryKey: ["admin-product-detail", productId],
    queryFn: () => (productId ? fetchProductById(productId) : null),
    enabled: !!productId,
  });
};
