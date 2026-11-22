"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { formatDate, formatDay } from "@/lib/utils";

export default function MyOrders() {
  const { data, loading, error, reload } = useApi("/api/orders/mine");
  const [view, setView] = useState(null);
  const [cancel, setCancel] = useState(null);

  return (
    <>
      <PageHeader title="My orders" text="You can cancel an order while it's still pending." />
      {loading ? <Spinner label="Loading your orders…" /> : error ? <ErrorState error={error} onRetry={reload} /> : data.orders.length === 0 ? (
        <EmptyState title="No orders yet" text="Find something delicious and place your first order." action={<Button asChild><Link href="/menu">Browse menu</Link></Button>} />
      ) : (
        <Table>
          <thead><tr><Th>Item</Th><Th>Restaurant</Th><Th>Delivery</Th><Th>Address</Th><Th>Requested</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody>
            {data.orders.map((o) => (
              <tr key={o.id}>
                <Td><div className="flex items-center gap-2"><PizzaImage src={o.item?.image} className="size-10 rounded-md" /><span className="font-semibold">{o.item?.itemName || "Item removed"}</span></div></Td>
                <Td>{o.vendor?.businessName || "-"}</Td>
                <Td className="whitespace-nowrap">{formatDay(o.deliveryDate)}</Td>
                <Td className="max-w-52"><p className="line-clamp-2">{o.deliveryAddress}</p></Td>
                <Td className="whitespace-nowrap">{formatDate(o.createdAt)}</Td>
                <Td><StatusBadge status={o.status} /></Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="View order" onClick={() => setView(o)}><Eye /></Button>
                    {o.status === "pending" && <Button size="sm" variant="outline" onClick={() => setCancel(o)}><XCircle /> Cancel</Button>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <OrderDetailsDialog order={view} onOpenChange={(o) => !o && setView(null)} />
      <ConfirmDialog open={!!cancel} onOpenChange={(o) => !o && setCancel(null)} destructive title="Cancel this order?" description="The restaurant won't see it any more. This can't be undone." confirmLabel="Cancel order"
        onConfirm={async () => { try { await api(`/api/orders/${cancel.id}/cancel`, { method: "PATCH" }); toast.success("Order cancelled"); } catch (e) { toast.error(e.message); } reload(); }} />
    </>
  );
}
