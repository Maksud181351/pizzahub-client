import { Badge } from "@/components/ui/badge";

const map = {
  pending: "pending", approved: "success", accepted: "success", paid: "success", active: "success",
  rejected: "danger", failed: "danger", blocked: "danger",
  cancelled: "neutral", inactive: "neutral", free: "neutral", premium: "premium",
};
export const StatusBadge = ({ status }) => <Badge variant={map[status] || "default"} className="capitalize">{status}</Badge>;
