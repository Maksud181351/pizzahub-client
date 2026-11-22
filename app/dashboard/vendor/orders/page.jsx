"use client";
import { useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Spinner } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/widgets";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { OrderDetailsDialog } from "@/components/shared/order-details-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PizzaImage } from "@/components/site/pizza-art";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatDay } from "@/lib/utils";

export default function VendorOrders() {
  const [status, setStatus] = useState("");
  const { data, loading, error, reload } = useApi(`/api/vendor/orders${status ? `?status=${status}` : ""}`);
  const [view, setView] = useState(null);
  const [reject, setReject] = useState(null);

  const decide = async (order, s) => {
    try {
      await api(`/api/vendor/orders/${order.id}/status`, { method: "PATCH", body: { status: s } });
      toast.success(s === "accepted" ? "Order accepted" : "Order rejected");
      reload();
    } catch (e) {
      toast.error(e.message);
      reload();
    }
  };

  return (
    <>
      <PageHeader title="Customer orders" text="Accept or reject pending orders. A decision can only be made once."
        action={<Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-44"><option value="">All statuses</option>{["pending", "accepted", "rejected", "cancelled"].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}</Select>} />
      {loading ? <Spinner label="Loading orders…" /> : error ? <ErrorState error={error} onRetry={reload} /> : data.orders.length === 0 ? (
        <EmptyState title="No orders here yet" text="When customers order your items, they show up here." />
      ) : (
        <Table>
          <thead><tr><Th>Customer</Th><Th>Item</Th><Th>Delivery</Th><Th>Address</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o.id}>
                <Td><p className="font-semibold">{o.customer?.name}</p><p className="text-xs text-muted">{o.customer?.email}</p></Td>
                <Td><div className="flex items-center gap-2"><PizzaImage src={o.item?.image} className="size-10 rounded-md" /><span>{o.item?.itemName || "Item removed"}</span></div></Td>
                <Td className="whitespace-nowrap">{formatDay(o.deliveryDate)}</Td>
                <Td className="max-w-56"><p className="line-clamp-2">{o.deliveryAddress}</p>{o.message && <p className="line-clamp-1 text-xs text-muted">“{o.message}”</p>}</Td>
                <Td><StatusBadge status={o.status} /></Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="View order" onClick={() => setView(o)}><Eye /></Button>
                    {o.status === "pending" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => decide(o, "accepted")}><Check /> Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => setReject(o)}><X /> Reject</Button>
                      </>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <OrderDetailsDialog order={view} as="vendor" onOpenChange={(o) => !o && setView(null)} />
      <ConfirmDialog open={!!reject} onOpenChange={(o) => !o && setReject(null)} destructive title="Reject this order?" description="The customer will see it as rejected. You can't undo this." confirmLabel="Reject order" onConfirm={() => decide(reject, "rejected")} />
    </>
  );
}
