import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PizzaImage } from "@/components/site/pizza-art";
import { Avatar } from "@/components/site/navbar";
import { money } from "@/lib/utils";

/** Fixed structure so every card in a grid has equal height */
export function MenuCard({ item }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <PizzaImage src={item.images?.[0]} alt={item.itemName} className="size-full" />
        {item.vendor?.isPremium && <Badge variant="premium" className="absolute left-3 top-3">Premium</Badge>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium text-tomato">{item.category}</p>
          <h3 className="mt-0.5 line-clamp-1 text-lg font-bold">{item.itemName}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin className="size-3.5" /> <span className="line-clamp-1">{item.location}</span></p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Avatar user={item.vendor} className="size-6" />
          <span className="line-clamp-1 text-muted">{item.vendor?.businessName}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-display text-xl font-extrabold">{money(item.price)}</span>
          <Button asChild size="sm"><Link href={`/menu/${item.id}`}>View Details</Link></Button>
        </div>
      </div>
    </article>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="aspect-[4/3] animate-pulse bg-surface-2" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-2" />
        <div className="h-8 w-full animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
