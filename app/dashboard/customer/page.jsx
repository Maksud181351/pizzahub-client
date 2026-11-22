"use client";
import { CircleCheck, CircleX, Clock, ShoppingBag } from "lucide-react";
import { BarCard, PageHeader, StatCard, StatGrid } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/shared/data-state";
import { Spinner } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks";

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi("/api/orders/stats");
  if (loading) return <Spinner label="Loading your dashboard…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="My dashboard" text="A quick look at your orders." />
      <StatGrid>
        <StatCard label="Total orders" value={data.total} icon={ShoppingBag} />
        <StatCard label="Pending orders" value={data.pending} icon={Clock} />
        <StatCard label="Accepted orders" value={data.accepted} icon={CircleCheck} />
        <StatCard label="Rejected orders" value={data.rejected} icon={CircleX} />
      </StatGrid>
      <div className="mt-6 max-w-2xl"><BarCard title="Orders by status" data={data.byStatus} /></div>
    </>
  );
}
