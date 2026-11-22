import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className, ...p }) => <div className={cn("animate-pulse rounded-lg bg-surface-2", className)} {...p} />;
export const Spinner = ({ className, label }) => (
  <div className={cn("flex items-center justify-center gap-2 py-10 text-muted", className)} role="status">
    <Loader2 className="size-5 animate-spin text-tomato" />
    {label && <span className="text-sm">{label}</span>}
  </div>
);
