"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";

const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export function OrderDialog({ item, open, onOpenChange }) {
  const [form, setForm] = useState({ deliveryDate: today(), deliveryAddress: "", message: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.deliveryAddress.trim().length < 8) return toast.error("Enter your full delivery address");
    setBusy(true);
    try {
      await api("/api/orders", { method: "POST", body: { itemId: item.id, ...form } });
      toast.success("Order placed! The restaurant will review it shortly.");
      onOpenChange(false);
      setForm({ deliveryDate: today(), deliveryAddress: "", message: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {item.itemName}</DialogTitle>
          <DialogDescription>{money(item.price)} from {item.vendor?.businessName}. You pay the restaurant on delivery.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="date">Delivery date</Label>
            <Input id="date" type="date" min={today()} required value={form.deliveryDate} onChange={set("deliveryDate")} />
          </div>
          <div>
            <Label htmlFor="address">Delivery address</Label>
            <Textarea id="address" required minLength={8} maxLength={250} placeholder="House, road, area, city" value={form.deliveryAddress} onChange={set("deliveryAddress")} />
          </div>
          <div>
            <Label htmlFor="message">Special instructions (optional)</Label>
            <Textarea id="message" maxLength={500} placeholder="e.g. Extra cheese, ring the bell twice" value={form.message} onChange={set("message")} />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={busy}>Place order</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
