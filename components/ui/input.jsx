import * as React from "react";
import { cn } from "@/lib/utils";

const field = "w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/70 focus-visible:border-oven focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oven/40 disabled:opacity-60";

export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(field, "h-10", className)} {...props} />;
});
export const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(field, "min-h-24 py-2", className)} {...props} />;
});
export const Select = React.forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(field, "h-10 cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
});
export function Label({ className, ...props }) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink", className)} {...props} />;
}
export function FieldError({ children }) {
  return children ? <p className="mt-1 text-xs text-tomato">{children}</p> : null;
}
