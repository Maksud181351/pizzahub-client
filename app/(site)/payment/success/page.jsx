import { Suspense } from "react";
import { PaymentSuccess } from "./payment-success";

export const metadata = { title: "Payment Success" };
export default function Page() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
