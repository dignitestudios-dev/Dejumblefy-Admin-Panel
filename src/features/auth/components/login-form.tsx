"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { loginAdmin } from "../api/auth.api";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { STORAGE_KEYS } from "@/utils/constants";
import { DEFAULT_REDIRECT } from "@/config/routes";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await loginAdmin(data);

      if (response && response.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.admin));
        document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=${response.token}; path=/; max-age=86400; SameSite=Lax`;

        dispatch(
          setCredentials({
            accessToken: response.token,
            user: response.admin,
          })
        );

        // Check if returnUrl parameter is present
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("returnUrl");
        router.push(returnUrl || DEFAULT_REDIRECT);
      } else {
        setErrorMessage("Unexpected login response. Please check your credentials.");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Authentication failed. Please check your credentials.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setValue("email", "admin@dejumblify.com");
    setValue("password", "Admin@1234");
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
      {/* Brand Header */}
      <div className="mb-6 text-center flex flex-col items-center">
        <Image
          src={logoImg}
          alt="Dejumblify"
          className="h-28 w-auto max-w-[280px] object-contain mb-4 drop-shadow-xs"
          priority
        />
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Admin Portal</h1>
        <p className="mt-1 text-xs text-slate-500">Sign in to access your administrative dashboard</p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              maxLength={120}
              disabled={isLoading}
              {...register("email")}
              placeholder="Enter Email"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20] disabled:opacity-50"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#000072] hover:text-[#FB7C20] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              maxLength={100}
              disabled={isLoading}
              {...register("password")}
              placeholder="••••••••••••"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20] disabled:opacity-50"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-[#FB7C20] font-semibold text-white shadow-sm transition-all hover:bg-[#E86B12] focus:outline-none focus:ring-2 focus:ring-[#FB7C20]/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In to Dashboard"
          )}
        </button>
      </form>

      {/* Demo Credentials Quick-Fill Helper */}
    
    </div>
  );
}
