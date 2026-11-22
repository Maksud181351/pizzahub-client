import { DashboardShell } from "@/components/dashboard/shell";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Customer Dashboard" };

export default async function CustomerLayout({ children }) {
  const user = await requireRole("customer"); // server-side role check: other roles are redirected away
  return <DashboardShell role="customer" user={user}>{children}</DashboardShell>;
}
