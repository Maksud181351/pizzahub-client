"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GoogleButton } from "@/components/forms/google-button";
import { signIn } from "@/lib/auth-client";
import { ROLE_HOME } from "@/lib/constants";

// only allow safe in-app redirects
const safe = (p) => (p && p.startsWith("/menu/") && !p.startsWith("//") ? p : null);

export function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = safe(sp.get("redirect"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await signIn.email({ email: form.email.trim(), password: form.password });
    setBusy(false);
    if (error) return toast.error(error.message || "Incorrect email or password");
    toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
    router.push(redirect || ROLE_HOME[data.user.role] || "/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <h1 className="section-title text-center">Welcome back</h1>
      <p className="mb-6 mt-2 text-center text-muted">Sign in to order pizza or manage your restaurant.</p>
      {sp.get("blocked") && <p className="mb-4 rounded-lg bg-[#fbdcd7] p-3 text-sm text-[#8f1d14]">Your account has been blocked. Contact PizzaHub support.</p>}
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={busy}>Sign in</Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" /></div>
        <GoogleButton callbackURL={redirect || "/dashboard"} />
      </Card>
      <p className="mt-5 text-center text-sm text-muted">New to PizzaHub? <Link href="/signup" className="font-semibold text-tomato hover:underline">Create an account</Link></p>
    </div>
  );
}
