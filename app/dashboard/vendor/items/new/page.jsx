import { PageHeader } from "@/components/dashboard/widgets";
import { ItemForm } from "@/components/forms/item-form";

export const metadata = { title: "Add Menu Item" };
export default function NewItemPage() {
  return (
    <>
      <PageHeader title="Add menu item" text="New items start as Pending until an admin approves them." />
      <ItemForm />
    </>
  );
}
