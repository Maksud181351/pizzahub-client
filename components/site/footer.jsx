import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/site/logo";

const Social = ({ href, label, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex size-9 items-center justify-center rounded-full border border-line text-ink hover:bg-tomato hover:text-white">
    {children}
  </a>
);

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">Hot, fresh pizza from the shops in your neighbourhood, delivered to your door.</p>
          <div className="mt-4 flex gap-2">
            <Social href="https://facebook.com" label="Facebook">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.8s-1.4-.3-2.8-.3c-2.8 0-4.5 1.7-4.5 4.7v2.3H6.8v3.3h2.8V22h3.9z" /></svg>
            </Social>
            <Social href="https://x.com" label="X (formerly Twitter)">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44z" /></svg>
            </Social>
            <Social href="https://instagram.com" label="Instagram">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </Social>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-base font-bold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-tomato">Home</Link></li>
            <li><Link href="/menu" className="hover:text-tomato">Browse Menu</Link></li>
            <li><Link href="/signin" className="hover:text-tomato">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-tomato">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-base font-bold">Categories</h4>
          <ul className="space-y-2 text-sm text-muted">
            {["Classic Pizzas", "Vegetarian Pizzas", "Meat Lovers", "Sides & Appetizers"].map((c) => (
              <li key={c}><Link href={`/menu?category=${encodeURIComponent(c)}`} className="hover:text-tomato">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-base font-bold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><MapPin className="size-4 text-tomato" /> 12 Gulshan Avenue, Dhaka</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-tomato" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-tomato" /> hello@pizzahub.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-sm text-muted">© {new Date().getFullYear()} PizzaHub. All rights reserved.</div>
    </footer>
  );
}
