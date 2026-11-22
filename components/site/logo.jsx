import Link from "next/link";

export function Logo({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink ${className}`} aria-label="PizzaHub home">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <path d="M16 3 C8 3 3 7 2 9 L16 29 L30 9 C29 7 24 3 16 3Z" fill="#f0a63a" stroke="#c97b1f" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5 11 Q16 5 27 11 L16 26Z" fill="#f6d36a" />
        <circle cx="12" cy="12" r="2.4" fill="#c62d1f" />
        <circle cx="19" cy="13" r="2.4" fill="#c62d1f" />
        <circle cx="16" cy="19" r="2.4" fill="#c62d1f" />
      </svg>
      <span>Pizza<span className="text-tomato">Hub</span></span>
    </Link>
  );
}
