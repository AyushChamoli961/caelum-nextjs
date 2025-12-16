import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard | Caelum",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Skip auth check for login page
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  return <>{children}</>;
}
