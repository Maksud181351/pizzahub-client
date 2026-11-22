"use client";
import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { cn, formatDate } from "@/lib/utils";

const plans = [
  { id: "free", name: "Free", price: "$0", features: ["Max 3 active menu items", "Basic vendor dashboard", "Order management"] },
  { id: "premium", name: "Premium", features: ["Unlimited active items", "Premium vendor badge", "Featured menu placement", "All Free features"] },
];

export default function SubscriptionPage() {
  const { data, loading, error, reload } = useApi("/api/payments/subscription");
  const [busy, setBusy] = useState(false);
  const [cancel, setCancel] = useState(false);

  const upgrade = async () => {
    setBusy(true);
    try {
      const { url } = await api("/api/payments/checkout-session", { method: "POST" });
      window.location.href = url; // Stripe Checkout
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  if (loading) return <Spinner label="Loading subscription…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const premium = data.plan === "premium";

  return (
    <>
      <PageHeader title="Subscription" text="Choose the plan that fits your restaurant." />
      <p className="mb-4 text-sm text-muted">Active items: <b className="text-ink">{data.activeItems}</b> / {data.limit ?? "unlimited"}</p>
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        {plans.map((p) => {
          const current = data.plan === p.id;
          return (
            <Card key={p.id} className={cn("flex flex-col p-6", current && "border-2 border-tomato")}>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold">{p.id === "premium" && <Crown className="size-5 text-oven" />}{p.name}</h2>
                {current && <StatusBadge status="active" />}
              </div>
              <p className="mt-2 font-display text-3xl font-extrabold">{p.price || `$${data.priceUsd}`}<span className="text-sm font-normal text-muted">{p.id === "premium" ? " / month" : ""}</span></p>
              <ul className="my-5 flex-1 space-y-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-basil" />{f}</li>)}
              </ul>
              {p.id === "premium" && !premium && <Button size="lg" loading={busy} onClick={upgrade}><Crown /> Upgrade to Premium</Button>}
              {p.id === "premium" && premium && (
                <div className="space-y-2 text-sm">
                  <p className="text-muted">{data.cancelAtPeriodEnd ? "Ends" : "Renews"} on <b className="text-ink">{formatDate(data.expiresAt)}</b></p>
                  {data.cancelAtPeriodEnd ? <p className="text-muted">Cancellation scheduled. You keep Premium until then.</p> : <Button variant="outline" onClick={() => setCancel(true)}>Cancel subscription</Button>}
                </div>
              )}
              {p.id === "free" && current && <p className="text-sm text-muted">Your current plan.</p>}
            </Card>
          );
        })}
      </div>
      <ConfirmDialog open={cancel} onOpenChange={setCancel} destructive title="Cancel Premium?" description="You keep Premium until the end of the billing period. After that, only your 3 oldest active items stay live." confirmLabel="Cancel subscription"
        onConfirm={async () => { try { await api("/api/payments/cancel", { method: "POST" }); toast.success("Cancellation scheduled"); reload(); } catch (e) { toast.error(e.message); } }} />
    </>
  );
}
