"use client";
import { useState } from "react";
import { Check, Eye, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Spinner } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/widgets";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PizzaImage } from "@/components/site/pizza-art";
import { api } from "@/lib/api";
import { useApi, useDebounced } from "@/lib/hooks";
import { money } from "@/lib/utils";

export default function ManageItems() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const dSearch = useDebounced(search);
  const q = new URLSearchParams();
  if (dSearch) q.set("search", dSearch);
  if (status) q.set("status", status);
  const { data, loading, error, reload } = useApi(`/api/admin/menu?${q}`);
  const [view, setView] = useState(null);
  const [del, setDel] = useState(null);

  const setItemStatus = async (item, s) => {
    try {
      await api(`/api/admin/menu/${item.id}/status`, { method: "PATCH", body: { status: s } });
      toast.success(`Item ${s}`);
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <PageHeader title="Manage menu items" text="Review submissions. Only approved items appear on the public menu." />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="max-w-xs" placeholder="Search by item or location" aria-label="Search items" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
          <option value="">All statuses</option>
          {["pending", "approved", "rejected", "inactive"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
        </Select>
      </div>
      {loading ? <Spinner label="Loading items…" /> : error ? <ErrorState error={error} onRetry={reload} /> : data.items.length === 0 ? <EmptyState title="Nothing here" text={status === "pending" ? "No items are waiting for review." : "No items match these filters."} /> : (
        <Table>
          <thead><tr><Th>Item</Th><Th>Vendor</Th><Th>Price</Th><Th>Status</Th><Th>Change status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <Td><div className="flex items-center gap-3"><PizzaImage src={item.images?.[0]} className="size-12 rounded-lg" /><div><p className="font-semibold">{item.itemName}</p><p className="text-xs text-muted">{item.category}</p></div></div></Td>
                <Td>{item.vendor?.businessName || item.vendor?.name || "-"}</Td>
                <Td>{money(item.price)}</Td>
                <Td><StatusBadge status={item.status} /></Td>
                <Td>
                  <Select aria-label="Change status" className="h-8 w-32 text-xs" value={item.status} onChange={(e) => setItemStatus(item, e.target.value)}>
                    {["pending", "approved", "rejected", "inactive"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                  </Select>
                </Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    {item.status === "pending" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => setItemStatus(item, "approved")}><Check /> Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => setItemStatus(item, "rejected")}><X /> Reject</Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" aria-label="View item" onClick={() => setView(item)}><Eye /></Button>
                    <Button variant="ghost" size="icon" aria-label="Delete item" onClick={() => setDel(item)}><Trash2 className="text-tomato" /></Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          {view && (
            <>
              <DialogHeader><DialogTitle>{view.itemName}</DialogTitle><DialogDescription>{view.category} · {view.location} · {money(view.price)}</DialogDescription></DialogHeader>
              <div className="mb-3 flex gap-2 overflow-x-auto">{view.images.map((s) => <PizzaImage key={s} src={s} className="size-28 shrink-0 rounded-lg" />)}</div>
              <p className="whitespace-pre-line text-sm text-muted">{view.description}</p>
              <p className="mt-3 text-sm">Vendor: <b>{view.vendor?.businessName}</b></p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} destructive title="Delete this item?" description={`"${del?.itemName}" will be removed permanently.`} confirmLabel="Delete item"
        onConfirm={async () => { try { await api(`/api/admin/menu/${del.id}`, { method: "DELETE" }); toast.success("Item deleted"); reload(); } catch (e) { toast.error(e.message); } }} />
    </>
  );
}
