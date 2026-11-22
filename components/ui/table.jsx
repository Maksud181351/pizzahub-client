import { cn } from "@/lib/utils";

export const Table = ({ className, ...p }) => (
  <div className="overflow-x-auto rounded-xl border border-line bg-surface">
    <table className={cn("w-full text-left text-sm", className)} {...p} />
  </div>
);
export const Th = ({ className, ...p }) => <th className={cn("whitespace-nowrap border-b border-line bg-surface-2 px-4 py-3 font-semibold", className)} {...p} />;
export const Td = ({ className, ...p }) => <td className={cn("border-b border-line px-4 py-3 align-middle", className)} {...p} />;
