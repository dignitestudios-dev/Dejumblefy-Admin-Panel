import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAdminNotification } from "./notifications.api";
import { SendAdminNotificationPayload } from "../types/notifications.types";

export const useSendAdminNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendAdminNotificationPayload) => sendAdminNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });
};
