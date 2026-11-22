import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export default async function DashboardIndex() {
  const session = await getServerSession();
  if (!session) redirect("/signin");
  if (session.user.isBlocked) redirect("/signin?blocked=1");
  if (session.user.onboarded === false) redirect("/onboarding");
  redirect(`/dashboard/${session.user.role}`);
}
