import { DashboardShell } from "@/components/dashboard/shell";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin"); // server-side role check: other roles are redirected away
  return <DashboardShell role="admin" user={user}>{children}</DashboardShell>;
}
