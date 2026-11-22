"use client";
import { useState } from "react";
import { Ban, Eye, UserCheck } from "lucide-react";
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
import { Avatar } from "@/components/site/navbar";
import { api } from "@/lib/api";
import { useApi, useDebounced } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const dSearch = useDebounced(search);
  const q = new URLSearchParams();
  if (dSearch) q.set("search", dSearch);
  if (role) q.set("role", role);
  const { data, loading, error, reload } = useApi(`/api/admin/users?${q}`);
  const [detail, setDetail] = useState(null);
  const [target, setTarget] = useState(null);

  const open = async (u) => {
    try { setDetail(await api(`/api/admin/users/${u.id}`)); } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="Manage users" text="Search, review and block or unblock accounts." />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="max-w-xs" placeholder="Search by name or email" aria-label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select aria-label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)} className="w-44">
          <option value="">All roles</option><option value="vendor">Vendors</option><option value="customer">Customers</option><option value="admin">Admins</option>
        </Select>
      </div>
      {loading ? <Spinner label="Loading users…" /> : error ? <ErrorState error={error} onRetry={reload} /> : data.users.length === 0 ? <EmptyState title="No users found" text="Try a different search or role." /> : (
        <Table>
          <thead><tr><Th>User</Th><Th>Role</Th><Th>Plan</Th><Th>Joined</Th><Th>Status</Th><Th className="text-right">Actions</Th></tr></thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u.id}>
                <Td><div className="flex items-center gap-3"><Avatar user={u} className="size-9" /><div><p className="font-semibold">{u.name}</p><p className="text-xs text-muted">{u.email}</p></div></div></Td>
                <Td className="capitalize">{u.role}</Td>
                <Td>{u.role === "vendor" ? <StatusBadge status={u.subscriptionPlan} /> : "-"}</Td>
                <Td className="whitespace-nowrap">{formatDate(u.createdAt)}</Td>
                <Td><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="View user" onClick={() => open(u)}><Eye /></Button>
                    {u.role !== "admin" && (u.isBlocked
                      ? <Button size="sm" variant="success" onClick={() => setTarget(u)}><UserCheck /> Unblock</Button>
                      : <Button size="sm" variant="outline" onClick={() => setTarget(u)}><Ban /> Block</Button>)}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          {detail && (
            <>
              <DialogHeader><DialogTitle>{detail.user.name}</DialogTitle><DialogDescription>{detail.user.email}</DialogDescription></DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted">Role</dt><dd className="font-semibold capitalize">{detail.user.role}</dd></div>
                <div><dt className="text-muted">Status</dt><dd><StatusBadge status={detail.user.isBlocked ? "blocked" : "active"} /></dd></div>
                {detail.user.businessName && <div><dt className="text-muted">Restaurant</dt><dd className="font-semibold">{detail.user.businessName}</dd></div>}
                {detail.user.role === "vendor" && <div><dt className="text-muted">Plan</dt><dd><StatusBadge status={detail.user.subscriptionPlan} /></dd></div>}
                <div><dt className="text-muted">Joined</dt><dd className="font-semibold">{formatDate(detail.user.createdAt)}</dd></div>
                <div><dt className="text-muted">Menu items</dt><dd className="font-semibold">{detail.menuItems}</dd></div>
                <div><dt className="text-muted">Orders</dt><dd className="font-semibold">{detail.orders}</dd></div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)} destructive={!target?.isBlocked}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        description={target?.isBlocked ? `${target?.name} will be able to sign in and use PizzaHub again.` : `${target?.name} will be signed out and won't be able to use protected features.`}
        confirmLabel={target?.isBlocked ? "Unblock" : "Block user"}
        onConfirm={async () => { try { await api(`/api/admin/users/${target.id}/block`, { method: "PATCH", body: { blocked: !target.isBlocked } }); toast.success(target.isBlocked ? "User unblocked" : "User blocked"); reload(); } catch (e) { toast.error(e.message); } }} />
    </>
  );
}
