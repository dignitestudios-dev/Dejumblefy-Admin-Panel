import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTokenPack,
  updateTokenPack,
  setTokenPackStatus,
  deleteTokenPack,
} from "./token-packs.api";
import { TOKEN_PACKS_QUERY_KEY } from "./token-packs.queries";
import {
  CreateTokenPackPayload,
  UpdateTokenPackPayload,
} from "../types/token-packs.types";

export const useCreateTokenPackMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTokenPackPayload) => createTokenPack(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOKEN_PACKS_QUERY_KEY });
      onSuccessCallback?.();
    },
  });
};

export const useUpdateTokenPackMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTokenPackPayload;
    }) => updateTokenPack(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOKEN_PACKS_QUERY_KEY });
      onSuccessCallback?.();
    },
  });
};

export const useSetTokenPackStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setTokenPackStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOKEN_PACKS_QUERY_KEY });
    },
  });
};

export const useDeleteTokenPackMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTokenPack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOKEN_PACKS_QUERY_KEY });
      onSuccessCallback?.();
    },
  });
};
