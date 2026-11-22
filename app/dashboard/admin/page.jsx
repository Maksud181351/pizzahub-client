"use client";
import { ChefHat, Clock, CreditCard, ShoppingBag, UtensilsCrossed, Users } from "lucide-react";
import { BarCard, PageHeader, PieCard, StatCard, StatGrid } from "@/components/dashboard/widgets";
import { ErrorState } from "@/components/shared/data-state";
import { Spinner } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks";

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi("/api/admin/stats");
  if (loading) return <Spinner label="Loading platform stats…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Platform overview" text="Everything happening on PizzaHub." />
      <StatGrid>
        <StatCard label="Registered users" value={data.totalUsers} icon={Users} />
        <StatCard label="Vendors" value={data.totalVendors} icon={ChefHat} />
        <StatCard label="Customers" value={data.totalCustomers} icon={ShoppingBag} />
        <StatCard label="Menu items" value={data.totalMenuItems} icon={UtensilsCrossed} />
        <StatCard label="Pending menu items" value={data.pendingMenuItems} icon={Clock} hint="Waiting for review" />
        <StatCard label="Transactions" value={data.totalTransactions} icon={CreditCard} />
      </StatGrid>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PieCard title="Users by role" data={data.usersByRole} />
        <BarCard title="Menu items by status" data={data.itemsByStatus} />
        <div className="lg:col-span-2"><BarCard title="Subscription revenue by month (USD)" data={data.revenueByMonth} prefix="$" /></div>
      </div>
    </>
  );
}
