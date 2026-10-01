import SettingsManagement from "@/features/settings/components/settings-management";

export const metadata = {
  title: "Admin Settings | Dejumblify Admin Panel",
  description: "Configure system broadcast preferences, master credentials, and system settings.",
};

export default function SettingsPage() {
  return <SettingsManagement />;
}
