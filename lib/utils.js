import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));
export const money = (n) => `$${Number(n || 0).toFixed(2)}`;
export const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-");
export const formatDay = (s) => (s ? new Date(`${s}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "-");
export const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "U";
