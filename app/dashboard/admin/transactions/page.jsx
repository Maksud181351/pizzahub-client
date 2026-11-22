"use client";
import { Spinner } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/widgets";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { useApi } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

export default function Transactions() {
  const { data, loading, error, reload } = useApi("/api/admin/transactions");
  return (
    <>
      <PageHeader title="Transactions" text="Read-only. Payment records come straight from verified Stripe events and can't be edited." />
      {loading ? <Spinner label="Loading transactions…" /> : error ? <ErrorState error={error} onRetry={reload} /> : data.transactions.length === 0 ? <EmptyState title="No transactions yet" text="They appear when vendors subscribe to Premium." /> : (
        <Table>
          <thead><tr><Th>Vendor</Th><Th>Plan</Th><Th>Amount</Th><Th>Payment status</Th><Th>Date</Th></tr></thead>
          <tbody>
            {data.transactions.map((t) => (
              <tr key={t.id}>
                <Td><p className="font-semibold">{t.vendor?.businessName || t.vendor?.name || "Deleted vendor"}</p><p className="text-xs text-muted">{t.vendor?.email}</p></Td>
                <Td className="capitalize">{t.plan}</Td>
                <Td className="whitespace-nowrap">{(t.amount / 100).toFixed(2)} {String(t.currency).toUpperCase()}</Td>
                <Td><StatusBadge status={t.status} /></Td>
                <Td className="whitespace-nowrap">{formatDate(t.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
