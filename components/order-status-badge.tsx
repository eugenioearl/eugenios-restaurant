import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Preparing: "bg-blue-100 text-blue-800 border-blue-200",
  Ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const colorClass = statusColors[status ?? ""] ?? "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <Badge variant="outline" className={`${colorClass} font-medium`}>
      {status ?? "Unknown"}
    </Badge>
  );
}
