export interface TokenPackItem {
  _id: string;
  name: string;
  token: number;
  price?: number | null;
  description?: string | null;
  storeProductIdApple?: string | null;
  storeProductIdGoogle?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenPacksQueryParams {
  isActive?: boolean;
}

export interface CreateTokenPackPayload {
  name: string;
  token: number;
  price?: number;
  description?: string;
  storeProductIdApple?: string;
  storeProductIdGoogle?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateTokenPackPayload {
  name?: string;
  token?: number;
  price?: number;
  description?: string;
  storeProductIdApple?: string;
  storeProductIdGoogle?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface DeleteTokenPackResponse {
  _id: string;
  deleted?: boolean;
  isActive?: boolean;
}
