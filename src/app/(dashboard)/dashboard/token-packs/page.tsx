import { TokenPacksManagement } from "@/features/token-packs";

export const metadata = {
  title: "Token Packages | Dejumblefy Admin Panel",
  description: "Manage in-app purchase token packages for Apple App Store and Google Play Store.",
};

export default function TokenPacksPage() {
  return <TokenPacksManagement />;
}
