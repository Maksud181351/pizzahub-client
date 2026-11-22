import { Inbox, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ error, onRetry, title = "Something went wrong" }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface px-6 py-12 text-center">
      <TriangleAlert className="size-9 text-tomato" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-md text-sm text-muted">{error?.message || "Please try again."}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-12 text-center">
      <Inbox className="size-9 text-oven" />
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="max-w-md text-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}
