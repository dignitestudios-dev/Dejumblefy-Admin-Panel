import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import {
  LoginCredentials,
  LoginResponseData,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
} from "../types/auth.types";

export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponseData> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponseData>>(
    "/admin/login",
    credentials
  );
  return response.data.data;
};

export const logoutAdmin = async (): Promise<void> => {
  await axiosInstance.post("/admin/logout");
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
    "/admin/forgot-password",
    payload
  );
  return response.data.data;
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<{ resetToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ resetToken: string }>>(
    "/admin/verify-otp",
    payload
  );
  return response.data.data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<{ message: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
    "/admin/reset-password",
    payload
  );
  return response.data.data;
};

export const updatePassword = async (
  payload: UpdatePasswordPayload
): Promise<{ message: string }> => {
  const response = await axiosInstance.put<ApiResponse<{ message: string }>>(
    "/admin/update-password",
    payload
  );
  return response.data.data;
};
