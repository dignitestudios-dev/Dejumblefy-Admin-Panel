export type LookupType = "category" | "style" | "material";

export interface LookupItem {
  _id: string;
  type: LookupType;
  label: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LookupsQueryParams {
  type?: LookupType;
  isActive?: boolean;
}

export interface CreateLookupPayload {
  type: LookupType;
  label: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateLookupPayload {
  label?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ReorderLookupsPayload {
  type: LookupType;
  ids: string[];
}

export interface LookupTabConfig {
  type: LookupType;
  label: string;
  pluralLabel: string;
  description: string;
  badgeColor: string;
}
