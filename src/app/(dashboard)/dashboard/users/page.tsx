import UsersManagement from "@/features/users/components/users-management";

export const metadata = {
  title: "Users Management | Dejumblify Admin Panel",
  description: "Manage registered users, token balances, and account bans.",
};

export default function UsersPage() {
  return <UsersManagement />;
}
