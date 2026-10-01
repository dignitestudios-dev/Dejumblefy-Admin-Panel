import { redirect } from "next/navigation";
import { DEFAULT_REDIRECT } from "@/config/routes";

export default function RootPage() {
  redirect(DEFAULT_REDIRECT);
}
