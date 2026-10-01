import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings, changeAdminPassword } from "./settings.api";
import { SETTINGS_QUERY_KEY } from "./settings.queries";
import { UpdateSettingsPayload, ChangePasswordPayload } from "../types/settings.types";

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changeAdminPassword(payload),
  });
};
