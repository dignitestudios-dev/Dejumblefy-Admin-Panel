import LoginForm from "@/features/auth/components/login-form";

export const metadata = {
  title: "Admin Login | Dejumblify Admin Panel",
  description: "Secure login for Dejumblify administrators",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
