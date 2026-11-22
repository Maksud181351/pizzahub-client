"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/forms/image-upload";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

export function ItemForm({ item }) {
  const router = useRouter();
  const [form, setForm] = useState({
    itemName: item?.itemName || "", category: item?.category || "", description: item?.description || "",
    price: item?.price ?? "", location: item?.location || "",
  });
  const [images, setImages] = useState(item?.images || []);
  const [busy, setBusy] = useState(false);
  const [limit, setLimit] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Upload at least one image of the item");
    if (!form.category) return toast.error("Choose a category");
    setBusy(true);
    try {
      await api(item ? `/api/vendor/menu/${item.id}` : "/api/vendor/menu", { method: item ? "PUT" : "POST", body: { ...form, price: Number(form.price), images } });
      toast.success(item ? "Item updated and sent for review" : "Item added. It will appear once an admin approves it");
      router.push("/dashboard/vendor/items");
    } catch (err) {
      setLimit(err.code === "PLAN_LIMIT");
      toast.error(err.message);
      setBusy(false);
    }
  };

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="itemName">Item name</Label>
            <Input id="itemName" required minLength={2} maxLength={80} value={form.itemName} onChange={set("itemName")} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" required value={form.category} onChange={set("category")}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" required min="0.5" step="0.01" value={form.price} onChange={set("price")} />
          </div>
          <div>
            <Label htmlFor="location">Location (area / city)</Label>
            <Input id="location" required value={form.location} onChange={set("location")} placeholder="e.g. Gulshan, Dhaka" />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" required minLength={10} maxLength={1000} value={form.description} onChange={set("description")} placeholder="Crust, toppings, size, what makes it special" />
        </div>
        <div>
          <Label>Item images (required, up to 4)</Label>
          <ImageUpload value={images} onChange={setImages} max={4} />
        </div>
        {limit && (
          <p className="rounded-lg bg-surface-2 p-3 text-sm">
            You&apos;ve reached the Free plan limit. <Link href="/dashboard/vendor/subscription" className="font-semibold text-tomato underline">Upgrade to Premium</Link> to publish unlimited items.
          </p>
        )}
        <div className="flex gap-3">
          <Button type="submit" loading={busy}>{item ? "Save changes" : "Add menu item"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
