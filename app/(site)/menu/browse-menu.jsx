"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { MenuCard, MenuCardSkeleton } from "@/components/site/menu-card";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { useApi, useDebounced } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/constants";

export function BrowseMenu() {
  const router = useRouter();
  const sp = useSearchParams();
  const get = (k) => sp.get(k) || "";
  const [search, setSearch] = useState(get("search"));
  const [min, setMin] = useState(get("minPrice"));
  const [max, setMax] = useState(get("maxPrice"));
  const dSearch = useDebounced(search);
  const dMin = useDebounced(min, 600);
  const dMax = useDebounced(max, 600);

  const update = (patch) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    if (!("page" in patch)) p.delete("page");
    router.replace(`/menu${p.toString() ? `?${p}` : ""}`, { scroll: false });
  };

  // push debounced text/price inputs into the URL
  useEffect(() => { if (dSearch !== get("search")) update({ search: dSearch }); }, [dSearch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (dMin !== get("minPrice") || dMax !== get("maxPrice")) update({ minPrice: dMin, maxPrice: dMax }); }, [dMin, dMax]); // eslint-disable-line react-hooks/exhaustive-deps

  const query = new URLSearchParams();
  ["search", "category", "location", "sort", "minPrice", "maxPrice", "page"].forEach((k) => get(k) && query.set(k, get(k)));
  const { data, loading, error, reload } = useApi(`/api/menu?${query}`, { auth: false });
  const { data: meta } = useApi("/api/menu/meta", { auth: false });

  const page = Number(get("page")) || 1;
  const filtered = ["search", "category", "location", "minPrice", "maxPrice"].some((k) => get(k));
  const clear = () => { setSearch(""); setMin(""); setMax(""); router.replace("/menu", { scroll: false }); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="section-title">Browse Menu</h1>
      <p className="section-sub mt-2">Search every approved pizza, side and drink. Sign in when you&apos;re ready to order.</p>

      <div className="mt-6 grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted" />
          <Input className="pl-9" placeholder="Search pizza, restaurant, area…" aria-label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select aria-label="Category" value={get("category")} onChange={(e) => update({ category: e.target.value })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </Select>
        <Select aria-label="Location" value={get("location")} onChange={(e) => update({ location: e.target.value })}>
          <option value="">All locations</option>
          {(meta?.locations || []).map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select aria-label="Sort by price" value={get("sort")} onChange={(e) => update({ sort: e.target.value })}>
          <option value="">Featured first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="newest">Newest</option>
        </Select>
        <div className="flex items-center gap-2">
          <Input type="number" min="0" inputMode="decimal" placeholder="Min $" aria-label="Minimum price" value={min} onChange={(e) => setMin(e.target.value)} />
          <Input type="number" min="0" inputMode="decimal" placeholder="Max $" aria-label="Maximum price" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
      </div>

      <div className="mt-6">
        {error ? (
          <ErrorState error={error} onRetry={reload} title="We couldn't load the menu" />
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <MenuCardSkeleton key={i} />)}</div>
        ) : data.items.length === 0 ? (
          <EmptyState title={filtered ? "No pizzas match your search" : "The menu is empty for now"} text={filtered ? "Try a different word, or clear the filters." : "Restaurants are still adding their items."}
            action={filtered && <Button variant="outline" onClick={clear}><X /> Clear filters</Button>} />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">{data.total} item{data.total === 1 ? "" : "s"} found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((item) => <MenuCard key={item.id} item={item} />)}</div>
            {data.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}><ChevronLeft /> Previous</Button>
                <span className="text-sm text-muted">Page {data.page} of {data.pages}</span>
                <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => update({ page: String(page + 1) })}>Next <ChevronRight /></Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
