"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Controlled confirm dialog. onConfirm may be async; the button shows a spinner meanwhile. */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", destructive = false, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Keep it</Button>
          <Button variant={destructive ? "destructive" : "default"} loading={busy} onClick={run}>{confirmLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
