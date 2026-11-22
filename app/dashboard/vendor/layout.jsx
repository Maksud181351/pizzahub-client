import { DashboardShell } from "@/components/dashboard/shell";
import { requireRole } from "@/lib/session";

export const metadata = { title: "Vendor Dashboard" };

export default async function VendorLayout({ children }) {
  const user = await requireRole("vendor"); // server-side role check: other roles are redirected away
  return <DashboardShell role="vendor" user={user}>{children}</DashboardShell>;
}
