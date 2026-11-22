"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChefHat, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GoogleButton } from "@/components/forms/google-button";
import { ImageUpload } from "@/components/forms/image-upload";
import { signUp } from "@/lib/auth-client";
import { ROLE_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const roles = [
  { value: "customer", title: "Customer", text: "Order pizza", icon: ShoppingBag },
  { value: "vendor", title: "Vendor", text: "Restaurant owner", icon: ChefHat },
];

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", businessName: "" });
  const [image, setImage] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 6) e.password = "Use at least 6 characters";
    else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password)) e.password = "Include one uppercase and one lowercase letter";
    if (form.role === "vendor" && form.businessName.trim().length < 2) e.businessName = "Enter your restaurant name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const { data, error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      ...(form.role === "vendor" ? { businessName: form.businessName.trim() } : {}),
      ...(image[0] ? { image: image[0] } : {}),
    });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account");
    toast.success("Account created. Welcome to PizzaHub!");
    router.push(ROLE_HOME[data?.user?.role] || "/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="section-title text-center">Create your account</h1>
      <p className="mb-6 mt-2 text-center text-muted">Join PizzaHub as a customer or open your restaurant.</p>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <Label>I want to join as</Label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button type="button" key={r.value} onClick={() => setForm({ ...form, role: r.value })} aria-pressed={form.role === r.value}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left", form.role === r.value ? "border-tomato bg-tomato/10" : "border-line hover:bg-surface-2")}>
                  <r.icon className="size-5 text-tomato" />
                  <span><span className="block text-sm font-semibold">{r.title}</span><span className="text-xs text-muted">{r.text}</span></span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoComplete="name" value={form.name} onChange={set("name")} />
            <FieldError>{errors.name}</FieldError>
          </div>
          {form.role === "vendor" && (
            <div>
              <Label htmlFor="biz">Restaurant name</Label>
              <Input id="biz" value={form.businessName} onChange={set("businessName")} />
              <FieldError>{errors.businessName}</FieldError>
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
            <FieldError>{errors.email}</FieldError>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
            <p className="mt-1 text-xs text-muted">At least 6 characters with one uppercase and one lowercase letter.</p>
            <FieldError>{errors.password}</FieldError>
          </div>
          <div>
            <Label>Profile photo (optional)</Label>
            <ImageUpload value={image} onChange={setImage} max={1} label="Upload" />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={busy}>Create account</Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" /></div>
        <GoogleButton label="Sign up with Google" callbackURL="/dashboard" />
        <p className="mt-2 text-center text-xs text-muted">With Google you choose Customer or Vendor right after signing in.</p>
      </Card>
      <p className="mt-5 text-center text-sm text-muted">Already have an account? <Link href="/signin" className="font-semibold text-tomato hover:underline">Sign in</Link></p>
    </div>
  );
}
