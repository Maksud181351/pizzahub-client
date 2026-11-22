"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, Crown, LayoutDashboard, LogOut, Menu, Receipt, Settings, UtensilsCrossed, CirclePlus, Users, X, House } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Avatar } from "@/components/site/navbar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV = {
  vendor: [
    { href: "", label: "Overview", icon: LayoutDashboard },
    { href: "/items", label: "My Menu Items", icon: UtensilsCrossed },
    { href: "/items/new", label: "Add Menu Item", icon: CirclePlus },
    { href: "/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/subscription", label: "Subscription", icon: Crown },
    { href: "/profile", label: "Profile Settings", icon: Settings },
  ],
  customer: [
    { href: "", label: "Overview", icon: LayoutDashboard },
    { href: "/orders", label: "My Orders", icon: ClipboardList },
    { href: "/profile", label: "Profile Settings", icon: Settings },
  ],
  admin: [
    { href: "", label: "Overview", icon: LayoutDashboard },
    { href: "/users", label: "Manage Users", icon: Users },
    { href: "/items", label: "Manage Menu Items", icon: UtensilsCrossed },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/profile", label: "Profile Settings", icon: Settings },
  ],
};

export function DashboardShell({ role, user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const base = `/dashboard/${role}`;
  const isActive = (href) => (href === "" ? pathname === base : pathname.startsWith(base + href) && !(href === "/items" && pathname.startsWith(base + "/items/new")));

  const logout = async () => {
    await signOut();
    clearToken();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-line px-5"><Logo /></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
        {NAV[role].map((l) => (
          <Link key={l.href} href={base + l.href} onClick={() => setOpen(false)}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium", isActive(l.href) ? "bg-tomato text-white dark:text-[#1b110d]" : "text-ink hover:bg-surface-2")}>
            <l.icon className="size-4" /> {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <Link href="/" className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2"><House className="size-4" /> Back to website</Link>
        <div className="flex items-center gap-3 rounded-lg bg-surface-2 p-3">
          <Avatar user={user} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs capitalize text-muted">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-surface lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-[#2a1710]/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-surface shadow-xl">{sidebar}</aside>
        </div>
      )}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-background/90 px-4 backdrop-blur sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle sidebar">{open ? <X /> : <Menu />}</Button>
        <p className="hidden text-sm text-muted lg:block">Signed in as <span className="font-semibold text-ink">{user.email}</span></p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={logout}><LogOut /> Logout</Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
