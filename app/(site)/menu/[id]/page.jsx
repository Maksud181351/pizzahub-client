"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PizzaImage } from "@/components/site/pizza-art";
import { Avatar } from "@/components/site/navbar";
import { OrderDialog } from "@/components/forms/order-dialog";
import { ErrorState } from "@/components/shared/data-state";
import { useApi } from "@/lib/hooks";
import { useSession } from "@/lib/auth-client";
import { money } from "@/lib/utils";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(`/api/menu/${id}`, { auth: false });
  const { data: session } = useSession();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const user = session?.user;

  const back = (
    <Link href="/menu" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-tomato"><ArrowLeft className="size-4" /> Back to menu</Link>
  );

  if (loading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {back}
        <div className="grid gap-8 md:grid-cols-2"><Skeleton className="aspect-[4/3]" /><div className="space-y-4"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-5 w-1/3" /><Skeleton className="h-24" /></div></div>
      </div>
    );
  if (error)
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        {back}
        <ErrorState error={error} onRetry={error.status >= 500 || error.status === 0 ? reload : undefined} title={error.status === 400 ? "That link isn't valid" : error.status === 404 ? "Item not found" : "We couldn't load this item"} />
      </div>
    );

  const item = data.item;
  let orderBlock;
  if (!user) orderBlock = <Button asChild size="lg"><Link href={`/signin?redirect=/menu/${item.id}`}>Sign in to order</Link></Button>;
  else if (user.role === "customer" && item.vendorId !== user.id) orderBlock = <Button size="lg" onClick={() => setOpen(true)}>Order this</Button>;
  else {
    const msg = item.vendorId === user.id ? "This is your own menu item, so you can't order it." : user.role === "admin" ? "Admins can't place customer orders." : "Switch to a customer account to place orders.";
    orderBlock = <p className="rounded-lg bg-surface-2 p-3 text-sm text-muted">{msg}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {back}
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <PizzaImage src={item.images?.[active]} alt={item.itemName} className="aspect-[4/3] w-full rounded-xl border border-line" />
          {item.images?.length > 1 && (
            <div className="mt-3 flex gap-3">
              {item.images.map((src, i) => (
                <button key={src} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} className={`size-20 cursor-pointer overflow-hidden rounded-lg border-2 ${i === active ? "border-tomato" : "border-line"}`}>
                  <PizzaImage src={src} className="size-full" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-tomato">{item.category}</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold">{item.itemName}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted"><MapPin className="size-4" /> {item.location}</p>
          <p className="mt-5 font-display text-3xl font-extrabold">{money(item.price)}</p>
          <p className="mt-5 max-w-prose whitespace-pre-line text-muted">{item.description}</p>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
            <Avatar user={item.vendor} className="size-11" />
            <div>
              <p className="font-semibold">{item.vendor?.businessName}</p>
              <p className="text-sm text-muted">Restaurant</p>
            </div>
            {item.vendor?.isPremium && <Badge variant="premium" className="ml-auto">Premium</Badge>}
          </div>
          <div className="mt-6">{orderBlock}</div>
        </div>
      </div>
      <OrderDialog item={item} open={open} onOpenChange={setOpen} />
    </div>
  );
}
