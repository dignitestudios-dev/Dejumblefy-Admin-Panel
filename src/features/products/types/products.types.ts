export type LinkStatus = "ok" | "broken" | "unchecked";

export interface Dimensions {
  length?: number | null;
  width?: number | null;
  height?: number | null;
}

export interface ProductItem {
  _id: string;
  asin: string;
  title: string;
  imageUrl?: string | null;
  aiDescription?: string | null;
  categories: string[];
  styles: string[];
  materials: string[];
  tags: string[];
  dimensions?: Dimensions | null;
  defaultLink: string;
  priority: number;
  isActive: boolean;
  linkStatus: LinkStatus;
  linkCheckedAt?: string | null;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  linkStatus?: LinkStatus;
  search?: string;
}

export interface PaginatedProductsResponse {
  message: string;
  data: ProductItem[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateProductPayload {
  amazonUrl: string;
  title: string;
  categories: string[];
  imageUrl?: string | null;
  aiDescription?: string | null;
  styles?: string[];
  materials?: string[];
  tags?: string[];
  dimensions?: Dimensions | null;
  priority?: number;
  isActive?: boolean;
}

export interface UpdateProductPayload {
  amazonUrl?: string;
  title?: string;
  categories?: string[];
  imageUrl?: string | null;
  aiDescription?: string | null;
  styles?: string[];
  materials?: string[];
  tags?: string[];
  dimensions?: Dimensions | null;
  priority?: number;
  isActive?: boolean;
}

export interface AISuggestTagsPayload {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface AISuggestTagsResponse {
  categories: string[];
  styles: string[];
  materials: string[];
  tags: string[];
  aiDescription: string;
}

export interface ImportCsvResponse {
  dryRun: boolean;
  totalRows: number;
  inserted?: number;
  updated?: number;
  failed?: number;
  errors?: Array<{ row: number; error: string; data?: Record<string, unknown> }>;
}
