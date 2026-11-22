import { Check, X, Clock, Ban } from "lucide-react";
import { formatDate } from "@/lib/utils";

/** Order status timeline (optional feature #3) */
export function OrderTimeline({ order }) {
  const steps = [{ key: "placed", label: "Order placed", done: true, at: order.createdAt, icon: Check }];
  if (order.status === "pending") steps.push({ key: "wait", label: "Waiting for the restaurant", done: false, current: true, icon: Clock });
  if (order.status === "accepted") steps.push({ key: "acc", label: "Accepted by the restaurant", done: true, at: order.updatedAt, icon: Check });
  if (order.status === "rejected") steps.push({ key: "rej", label: "Rejected by the restaurant", done: true, bad: true, at: order.updatedAt, icon: X });
  if (order.status === "cancelled") steps.push({ key: "can", label: "Cancelled by you", done: true, bad: true, at: order.updatedAt, icon: Ban });
  return (
    <ol className="relative ml-3 border-l-2 border-line">
      {steps.map((s) => (
        <li key={s.key} className="mb-4 ml-6 last:mb-0">
          <span className={`absolute -left-[13px] flex size-6 items-center justify-center rounded-full text-white ${s.bad ? "bg-[#8f1d14]" : s.done ? "bg-basil" : "bg-oven"}`}>
            <s.icon className="size-3.5" />
          </span>
          <p className="text-sm font-semibold">{s.label}</p>
          {s.at && <p className="text-xs text-muted">{formatDate(s.at)}</p>}
        </li>
      ))}
    </ol>
  );
}
