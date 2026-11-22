"use client";
import * as M from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = M.Root;
export const DropdownMenuTrigger = M.Trigger;
export const DropdownMenuContent = ({ className, sideOffset = 8, ...p }) => (
  <M.Portal>
    <M.Content sideOffset={sideOffset} align="end" className={cn("z-50 min-w-52 rounded-xl border border-line bg-surface p-1.5 shadow-lg", className)} {...p} />
  </M.Portal>
);
export const DropdownMenuItem = ({ className, ...p }) => (
  <M.Item className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-surface-2 [&_svg]:size-4", className)} {...p} />
);
export const DropdownMenuLabel = ({ className, ...p }) => <M.Label className={cn("px-3 py-2", className)} {...p} />;
export const DropdownMenuSeparator = ({ className, ...p }) => <M.Separator className={cn("my-1 h-px bg-line", className)} {...p} />;
