"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/forms/image-upload";
import { PageHeader } from "@/components/dashboard/widgets";
import { authClient } from "@/lib/auth-client";

/** Name / photo / restaurant name only. Role and subscription fields are never sent and are blocked by the auth hooks on the server. */
export function ProfileForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName || "");
  const [image, setImage] = useState(user.image ? [user.image] : []);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Enter your name");
    if (user.role === "vendor" && businessName.trim().length < 2) return toast.error("Enter your restaurant name");
    setBusy(true);
    const { error } = await authClient.updateUser({
      name: name.trim(),
      image: image[0] || null,
      ...(user.role === "vendor" ? { businessName: businessName.trim() } : {}),
    });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not update your profile");
    toast.success("Profile updated");
    router.refresh();
  };

  return (
    <>
      <PageHeader title="Profile Settings" text="Update how you appear on PizzaHub." />
      <Card className="max-w-xl p-6">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label>Profile photo</Label>
            <ImageUpload value={image} onChange={setImage} max={1} label="Upload" />
          </div>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {user.role === "vendor" && (
            <div>
              <Label htmlFor="biz">Restaurant name</Label>
              <Input id="biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled readOnly />
          </div>
          <div>
            <Label htmlFor="role">Account type</Label>
            <Input id="role" value={user.role} disabled readOnly className="capitalize" />
          </div>
          <Button type="submit" loading={busy}>Save changes</Button>
        </form>
      </Card>
    </>
  );
}
