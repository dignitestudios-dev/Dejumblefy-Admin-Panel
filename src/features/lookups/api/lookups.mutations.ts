import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLookup,
  updateLookup,
  deleteLookup,
  reorderLookups,
} from "./lookups.api";
import {
  CreateLookupPayload,
  UpdateLookupPayload,
  ReorderLookupsPayload,
} from "../types/lookups.types";

export const useCreateLookupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLookupPayload) => createLookup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lookups"] });
    },
  });
};

export const useUpdateLookupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLookupPayload }) =>
      updateLookup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lookups"] });
    },
  });
};

export const useDeleteLookupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLookup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lookups"] });
    },
  });
};

export const useReorderLookupsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderLookupsPayload) => reorderLookups(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-lookups"] });
    },
  });
};
