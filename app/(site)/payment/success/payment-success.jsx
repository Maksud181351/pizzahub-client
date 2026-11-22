"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/data-state";
import { api } from "@/lib/api";

/**
 * This page does NOT activate Premium. It only polls the API, which reports whether the
 * verified Stripe webhook has already been processed.
 */
export function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState({ status: "checking" });

  useEffect(() => {
    if (!sessionId) return setState({ status: "error", error: { message: "No payment session was found." } });
    let stop = false;
    (async () => {
      for (let i = 0; i < 12 && !stop; i++) {
        try {
          const r = await api(`/api/payments/session/${sessionId}`);
          if (r.confirmed) return setState({ status: "confirmed", r });
        } catch (error) {
          return setState({ status: "error", error });
        }
        await new Promise((res) => setTimeout(res, 2000));
      }
      if (!stop) setState({ status: "slow" });
    })();
    return () => { stop = true; };
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      {state.status === "checking" && <Spinner label="Confirming your payment with Stripe…" />}
      {state.status === "error" && <ErrorState error={state.error} title="We couldn't check this payment" />}
      {state.status === "slow" && (
        <div className="space-y-3">
          <Clock className="mx-auto size-12 text-oven" />
          <h1 className="section-title">Payment received, finishing up</h1>
          <p className="text-muted">Stripe is still confirming. Premium switches on automatically as soon as it does. Refresh in a minute.</p>
          <Button onClick={() => location.reload()}>Check again</Button>
        </div>
      )}
      {state.status === "confirmed" && (
        <div className="space-y-3">
          <CheckCircle2 className="mx-auto size-14 text-basil" />
          <h1 className="section-title">You&apos;re Premium!</h1>
          <p className="text-muted">Payment of ${((state.r.amount || 0) / 100).toFixed(2)} {String(state.r.currency || "usd").toUpperCase()} confirmed. Unlimited menu items, the Premium badge and featured placement are now active.</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button asChild><Link href="/dashboard/vendor/items/new">Add a menu item</Link></Button>
            <Button asChild variant="outline"><Link href="/dashboard/vendor/subscription">View subscription</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
