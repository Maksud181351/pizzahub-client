import { ProfileForm } from "@/components/dashboard/profile-form";
import { requireRole } from "@/lib/session";

export default async function ProfilePage() {
  const user = await requireRole("vendor");
  return <ProfileForm user={user} />;
}
