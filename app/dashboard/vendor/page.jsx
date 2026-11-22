"use client";
import { ClipboardList, Crown, Hourglass, Package, UtensilsCrossed } from "lucide-react";
import { BarCard, PageHeader, PieCard, StatCard, StatGrid } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/shared/data-state";
import { Spinner } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks";

export default function VendorOverview() {
  const { data, loading, error, reload } = useApi("/api/vendor/stats");
  if (loading) return <Spinner label="Loading your dashboard…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Vendor overview" text="How your restaurant is doing right now." />
      <StatGrid>
        <StatCard label="Total menu items" value={data.totalItems} icon={UtensilsCrossed} />
        <StatCard label="Active menu items" value={data.activeItems} icon={Package} hint="Pending + approved" />
        <StatCard label="Pending customer orders" value={data.pendingOrders} icon={Hourglass} />
        <StatCard label="Accepted orders" value={data.acceptedOrders} icon={ClipboardList} />
        <StatCard label="Current plan" value={data.subscriptionPlan} icon={Crown} />
      </StatGrid>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PieCard title="Menu items by status" data={data.itemsByStatus} />
        <BarCard title="Orders by status" data={data.ordersByStatus} />
      </div>
    </>
  );
}
