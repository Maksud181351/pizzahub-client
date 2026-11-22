"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { OrderTimeline } from "@/components/shared/order-timeline";
import { PizzaImage } from "@/components/site/pizza-art";
import { formatDate, formatDay, money } from "@/lib/utils";

export function OrderDetailsDialog({ order, onOpenChange, as = "customer" }) {
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent>
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>{order.item?.itemName || "Item removed"}</DialogTitle>
              <DialogDescription>Order placed {formatDate(order.createdAt)}</DialogDescription>
            </DialogHeader>
            <div className="mb-4 flex gap-4">
              <PizzaImage src={order.item?.image} alt="" className="size-24 shrink-0 rounded-lg" />
              <dl className="space-y-1 text-sm">
                <div className="flex items-center gap-2"><dt className="text-muted">Status</dt><dd><StatusBadge status={order.status} /></dd></div>
                {order.item && <div><dt className="inline text-muted">Price </dt><dd className="inline font-semibold">{money(order.item.price)}</dd></div>}
                <div><dt className="inline text-muted">Delivery </dt><dd className="inline font-semibold">{formatDay(order.deliveryDate)}</dd></div>
                {as === "customer" ? (
                  <div><dt className="inline text-muted">Restaurant </dt><dd className="inline font-semibold">{order.vendor?.businessName || "-"}</dd></div>
                ) : (
                  <div><dt className="inline text-muted">Customer </dt><dd className="inline font-semibold">{order.customer?.name} ({order.customer?.email})</dd></div>
                )}
              </dl>
            </div>
            <p className="text-sm"><span className="text-muted">Address: </span>{order.deliveryAddress}</p>
            {order.message && <p className="mt-1 text-sm"><span className="text-muted">Note: </span>{order.message}</p>}
            <h4 className="mb-3 mt-5 text-base font-bold">Order timeline</h4>
            <OrderTimeline order={order} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
