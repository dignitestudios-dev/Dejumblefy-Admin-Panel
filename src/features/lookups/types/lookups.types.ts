export type LookupType = "category" | "style" | "material" | "retailer";

export const LOOKUP_TYPE_LABELS: Record<LookupType, string> = {
  category: "Room Category",
  style: "Design Style",
  material: "Material",
  retailer: "Retailer",
};

export const LOOKUP_LABEL_PLACEHOLDERS: Record<LookupType, string> = {
  category: "e.g. Living Room, Kitchen",
  style: "e.g. Japandi, Minimalist",
  material: "e.g. Walnut Wood, Brass",
  retailer: "e.g. Target, Wayfair",
};

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
