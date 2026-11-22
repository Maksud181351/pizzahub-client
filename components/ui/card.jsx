import { cn } from "@/lib/utils";

export const Card = ({ className, ...p }) => <div className={cn("rounded-xl border border-line bg-surface", className)} {...p} />;
export const CardHeader = ({ className, ...p }) => <div className={cn("flex flex-col gap-1 p-5 pb-2", className)} {...p} />;
export const CardTitle = ({ className, ...p }) => <h3 className={cn("text-lg font-bold", className)} {...p} />;
export const CardContent = ({ className, ...p }) => <div className={cn("p-5", className)} {...p} />;
