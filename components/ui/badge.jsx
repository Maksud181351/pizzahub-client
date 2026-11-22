import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-surface-2 text-ink",
      pending: "bg-[#fdebc8] text-[#7a4a00] dark:bg-[#4a3412] dark:text-[#ffd27a]",
      success: "bg-[#dcefdc] text-[#1f5b2c] dark:bg-[#1d3a24] dark:text-[#9fe0ae]",
      danger: "bg-[#fbdcd7] text-[#8f1d14] dark:bg-[#4a1f1a] dark:text-[#ffb3a8]",
      neutral: "bg-[#e8e2d9] text-[#4b4036] dark:bg-[#3a2f28] dark:text-[#d8c9bb]",
      premium: "bg-oven text-[#2a1710]",
    },
  },
  defaultVariants: { variant: "default" },
});
export const Badge = ({ className, variant, ...p }) => <span className={cn(badgeVariants({ variant }), className)} {...p} />;
