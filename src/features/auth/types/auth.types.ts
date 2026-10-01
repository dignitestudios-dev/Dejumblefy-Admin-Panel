import { Admin } from "@/types/common";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  admin: Admin;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  password: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
