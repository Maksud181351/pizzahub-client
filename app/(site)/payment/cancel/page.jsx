import Link from "next/link";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Payment Cancelled" };
export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <CircleX className="mx-auto size-14 text-tomato" />
      <h1 className="section-title mt-3">Payment cancelled</h1>
      <p className="mt-2 text-muted">No charge was made and your plan hasn&apos;t changed. You can upgrade whenever you&apos;re ready.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild><Link href="/dashboard/vendor/subscription">Back to subscription</Link></Button>
        <Button asChild variant="outline"><Link href="/">Home</Link></Button>
      </div>
    </div>
  );
}
