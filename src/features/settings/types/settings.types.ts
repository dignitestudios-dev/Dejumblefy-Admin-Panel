export interface SettingsData {
  _id?: string;
  user?: string;
  notification: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsPayload {
  notification: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
