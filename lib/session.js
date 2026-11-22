import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getServerSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Server-side guard used by every dashboard layout. Works on reload because it reads the session cookie on the server. */
export async function requireRole(role) {
  const session = await getServerSession();
  if (!session) redirect("/signin");
  const u = session.user;
  if (u.isBlocked) redirect("/signin?blocked=1");
  if (u.onboarded === false) redirect("/onboarding");
  if (u.role !== role) redirect(`/dashboard/${u.role}`); // wrong role: send them to their own dashboard
  return { id: u.id, name: u.name, email: u.email, image: u.image || null, role: u.role, businessName: u.businessName || "" };
}
