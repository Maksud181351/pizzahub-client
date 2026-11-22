"use client";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/widgets";
import { ItemForm } from "@/components/forms/item-form";
import { ErrorState } from "@/components/shared/data-state";
import { Spinner } from "@/components/ui/skeleton";
import { useApi } from "@/lib/hooks";

export default function EditItemPage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(`/api/vendor/menu/${id}`);
  if (loading) return <Spinner label="Loading item…" />;
  if (error) return <ErrorState error={error} onRetry={error.status >= 500 ? reload : undefined} title={error.status === 403 ? "Not your item" : "Couldn't load this item"} />;
  return (
    <>
      <PageHeader title="Edit menu item" text="Saving changes sends the item back to admin review." />
      <ItemForm item={data.item} />
    </>
  );
}
