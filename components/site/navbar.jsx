"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { cn, initials } from "@/lib/utils";

const dashLabel = { vendor: "Vendor Dashboard", customer: "My Dashboard", admin: "Admin Dashboard" };

export function Navbar() {
  const { data: session, isPending } = useSession(); // updates instantly after sign in / sign out
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
    ...(user ? [{ href: `/dashboard/${user.role}`, label: dashLabel[user.role] || "Dashboard" }] : []),
  ];
  const active = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const logout = async () => {
    await signOut();
    clearToken();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-2", active(l.href) ? "text-tomato" : "text-ink")}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-surface-2" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2 outline-none hover:bg-surface-2" aria-label="Open profile menu">
                <Avatar user={user} />
                <ChevronDown className="size-4 text-muted" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs font-normal capitalize text-muted">{user.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push(`/dashboard/${user.role}`)}><LayoutDashboard /> Dashboard</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(user.role === "admin" ? "/dashboard/admin" : `/dashboard/${user.role}/profile`)}><Settings /> Profile Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="text-tomato"><LogOut /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost"><Link href="/signin">Sign In</Link></Button>
              <Button asChild><Link href="/signup">Sign Up</Link></Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-background px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn("rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-2", active(l.href) && "text-tomato")}>{l.label}</Link>
            ))}
            {!user && !isPending && (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" className="flex-1"><Link href="/signin" onClick={() => setOpen(false)}>Sign In</Link></Button>
                <Button asChild className="flex-1"><Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link></Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Avatar({ user, className = "size-8" }) {
  return user?.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt="" referrerPolicy="no-referrer" className={cn("rounded-full object-cover", className)} />
  ) : (
    <span className={cn("flex items-center justify-center rounded-full bg-oven text-xs font-bold text-[#2a1710]", className)}>{initials(user?.name)}</span>
  );
}
