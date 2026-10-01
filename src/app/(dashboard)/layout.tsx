import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="ml-64 flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
