import ReferralsManagement from "@/features/referrals/components/referrals-management";

export const metadata = {
  title: "Referrals Monitoring | Dejumblify Admin Panel",
  description: "Monitor user-to-user referrals, bonus token disbursements, and invitation chains.",
};

export default function ReferralsPage() {
  return <ReferralsManagement />;
}
