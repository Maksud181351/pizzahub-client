"use client";
import { useState } from "react";
import Link from "next/link";
import { CirclePlus, Eye, Pause, Pencil, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/widgets";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PizzaImage } from "@/components/site/pizza-art";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { money } from "@/lib/utils";

export default function MyMenuItems() {
  const { data, loading, error, reload } = useApi("/api/vendor/menu");
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  const toggle = async (item) => {
    const pause = item.status === "approved" || item.status === "pending";
    try {
      await api(`/api/vendor/menu/${item.id}/availability`, { method: "PATCH", body: { available: !pause } });
      toast.success(pause ? "Item paused. Customers can't see it" : "Item is active again");
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <PageHeader title="My menu items" text="Only you can see rejected and pending items." action={<Button asChild><Link href="/dashboard/vendor/items/new"><CirclePlus /> Add menu item</Link></Button>} />
      {loading ? <Spinner label="Loading your items…" /> : error ? <ErrorState error={error} onRetry={reload} /> : data.items.length === 0 ? (
        <EmptyState title="You haven't added any items" text="Add your first pizza. It goes live after an admin approves it." action={<Button asChild><Link href="/dashboard/vendor/items/new">Add menu item</Link></Button>} />
      ) : (
        <>
          <p className="mb-3 text-sm text-muted">Active items: <b className="text-ink">{data.activeCount}</b> / {data.limit ?? "unlimited"}</p>
          <Table>
            <thead><tr><Th>Item</Th><Th>Category</Th><Th>Price</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
            <tbody>
              {data.items.map((item) => {
                const canToggle = ["approved", "pending", "inactive"].includes(item.status);
                const active = item.status === "approved" || item.status === "pending";
                return (
                  <tr key={item.id}>
                    <Td><div className="flex items-center gap-3"><PizzaImage src={item.images?.[0]} className="size-12 rounded-lg" /><span className="font-semibold">{item.itemName}</span></div></Td>
                    <Td>{item.category}</Td>
                    <Td>{money(item.price)}</Td>
                    <Td><StatusBadge status={item.status} /></Td>
                    <Td>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="View details" onClick={() => setView(item)}><Eye /></Button>
                        <Button asChild variant="ghost" size="icon" aria-label="Edit"><Link href={`/dashboard/vendor/items/${item.id}/edit`}><Pencil /></Link></Button>
                        {canToggle && <Button variant="ghost" size="icon" aria-label={active ? "Pause item" : "Resume item"} onClick={() => toggle(item)}>{active ? <Pause /> : <Play />}</Button>}
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDel(item)}><Trash2 className="text-tomato" /></Button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          {view && (
            <>
              <DialogHeader><DialogTitle>{view.itemName}</DialogTitle><DialogDescription>{view.category} · {view.location}</DialogDescription></DialogHeader>
              <div className="mb-3 flex gap-2 overflow-x-auto">{view.images.map((s) => <PizzaImage key={s} src={s} className="size-28 shrink-0 rounded-lg" />)}</div>
              <div className="mb-2 flex items-center gap-2"><StatusBadge status={view.status} /><Badge>{money(view.price)}</Badge></div>
              <p className="whitespace-pre-line text-sm text-muted">{view.description}</p>
              {view.status === "rejected" && <p className="mt-3 rounded-lg bg-[#fbdcd7] p-3 text-sm text-[#8f1d14]">An admin rejected this item. Edit it and save to send it for review again.</p>}
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} destructive title="Delete this menu item?" description={`"${del?.itemName}" will be removed permanently.`} confirmLabel="Delete item"
        onConfirm={async () => { try { await api(`/api/vendor/menu/${del.id}`, { method: "DELETE" }); toast.success("Item deleted"); reload(); } catch (e) { toast.error(e.message); } }} />
    </>
  );
}
