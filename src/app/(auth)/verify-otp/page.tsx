import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyOtpForm from "@/features/auth/components/verify-otp-form";

export const metadata = {
  title: "Verify Security Code | Dejumblify Admin Panel",
  description: "Enter your 6-digit administrator verification code",
};

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-[#FB7C20]" />
          </div>
        }
      >
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
