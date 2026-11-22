"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, HandCoins, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PizzaArt } from "@/components/site/pizza-art";
import { MenuCard, MenuCardSkeleton } from "@/components/site/menu-card";
import { EmptyState, ErrorState } from "@/components/shared/data-state";
import { useApi } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/constants";

const Reveal = ({ children, delay = 0, className }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.45, delay }}>
    {children}
  </motion.div>
);

const Heading = ({ title, text }) => (
  <div className="mb-8">
    <h2 className="section-title">{title}</h2>
    {text && <p className="section-sub mt-2">{text}</p>}
  </div>
);

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-oven/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza Delivered to Your Door
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }} className="mt-5 max-w-lg text-lg text-muted">
            Browse menus from pizza shops near you, pick a delivery day and let the oven do the rest. Every restaurant on PizzaHub is reviewed before it goes live.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/menu">Explore Pizza Menu <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/signup">Open your pizza shop</Link></Button>
          </motion.div>
        </div>
        <div className="mx-auto w-full max-w-md md:max-w-none">
          <PizzaArt className="mx-auto w-full max-w-[28rem] drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
}

export function FeaturedSection() {
  const { data, loading, error, reload } = useApi("/api/menu/featured?limit=6", { auth: false });
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title">Featured Menu Items</h2>
          <p className="section-sub mt-2">Fresh from the ovens of our approved restaurants. Premium partners appear first.</p>
        </div>
        <Button asChild variant="outline"><Link href="/menu">See the full menu</Link></Button>
      </div>
      {error ? (
        <ErrorState error={error} onRetry={reload} title="We couldn't load the featured pizzas" />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <MenuCardSkeleton key={i} />)}</div>
      ) : data.items.length === 0 ? (
        <EmptyState title="No pizzas on the menu yet" text="Restaurants are getting their ovens ready. Check back soon." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.06} className="h-full"><MenuCard item={item} /></Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export function CategoriesSection() {
  const { data } = useApi("/api/menu/meta", { auth: false });
  const counts = Object.fromEntries((data?.categories || []).map((c) => [c.name, c.count]));
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <Heading title="Pizza Categories" text="Start with what you're craving." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.name} delay={(i % 3) * 0.06}>
            <Link href={`/menu?category=${encodeURIComponent(c.name)}`} className="group flex h-full items-center gap-4 rounded-xl border border-line bg-surface p-5 hover:border-oven">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-2 text-2xl" aria-hidden="true">{c.emoji}</span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold group-hover:text-tomato">{c.name}</span>
                <span className="block text-sm text-muted">{c.blurb}</span>
                {data && <span className="mt-1 block text-xs font-medium text-basil">{counts[c.name] || 0} available</span>}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const why = [
  { icon: ShieldCheck, title: "Every shop is reviewed", text: "Admins approve each menu item before it can be ordered, so what you see is what's on offer." },
  { icon: Truck, title: "You choose the delivery day", text: "Pick a date and add instructions. The restaurant accepts or declines and you can follow the status." },
  { icon: HandCoins, title: "No online payment for orders", text: "Order now and settle with the restaurant. Stripe is only used for vendor subscriptions." },
  { icon: BadgeCheck, title: "Premium partners stand out", text: "Restaurants on Premium get a badge and a featured spot, so reliable favourites are easy to find." },
];
export function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <Heading title="Why Choose PizzaHub?" text="A pizza marketplace built around the people who bake and the people who eat." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {why.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.07}>
            <div className="h-full rounded-xl border border-line bg-surface p-6">
              <span className="flex size-11 items-center justify-center rounded-lg bg-tomato/10 text-tomato"><w.icon className="size-5" /></span>
              <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted">{w.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const steps = [
  { title: "Find a pizza", text: "Search by name, filter by category or area and sort by price." },
  { title: "Place your order", text: "Choose a delivery date, add your address and any special instructions." },
  { title: "Track it", text: "The restaurant accepts or declines. Follow every update from your dashboard." },
];
export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <div className="rounded-2xl bg-surface-2 p-8 sm:p-12">
        <Heading title="How PizzaHub Works" />
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tomato font-display font-extrabold text-white dark:text-[#1b110d]">{i + 1}</span>
              <div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
