"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { ROLE_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** One-time role choice for accounts created with Google */
export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [role, setRole] = useState("customer");
  const [businessName, setBusinessName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && !session) router.replace("/signin");
    if (session?.user && session.user.onboarded !== false) router.replace(ROLE_HOME[session.user.role] || "/");
  }, [isPending, session, router]);

  if (isPending || !session) return <Spinner className="min-h-[60vh]" label="Loading…" />;

  const submit = async (e) => {
    e.preventDefault();
    if (role === "vendor" && businessName.trim().length < 2) return toast.error("Enter your restaurant name");
    setBusy(true);
    try {
      await api("/api/users/me/onboard", { method: "POST", body: { role, businessName } });
      toast.success("All set! Taking you to your dashboard");
      router.push(ROLE_HOME[role]);
      router.refresh();
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="section-title text-center">One last step</h1>
      <p className="mb-6 mt-2 text-center text-muted">How will you use PizzaHub? You can&apos;t change this later.</p>
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[["customer", "Customer", ShoppingBag], ["vendor", "Vendor", ChefHat]].map(([v, t, Icon]) => (
              <button type="button" key={v} onClick={() => setRole(v)} className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4", role === v ? "border-tomato bg-tomato/10" : "border-line hover:bg-surface-2")}>
                <Icon className="size-6 text-tomato" /> <span className="font-semibold">{t}</span>
              </button>
            ))}
          </div>
          {role === "vendor" && (
            <div>
              <Label htmlFor="biz">Restaurant name</Label>
              <Input id="biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
          )}
          <Button type="submit" className="w-full" size="lg" loading={busy}>Continue</Button>
        </form>
      </Card>
    </div>
  );
}
