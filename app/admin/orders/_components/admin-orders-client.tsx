"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { toast } from "sonner";
import { ClipboardList, Calendar, User, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem { id: string; quantity: number; price: number; menuItem: { name: string } | null; }
interface OrderUser { name: string | null; email: string; phone: string | null; }
interface Order {
  id: string; orderNumber: string; status: string; paymentMethod: string;
  paymentStatus: string; subtotal: number; tax: number; total: number;
  deliveryAddress: string | null; phone: string | null; notes: string | null;
  createdAt: string; items: OrderItem[]; user: OrderUser | null;
}

const statuses = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = useCallback(() => {
    setLoading(true);
    fetch(`/api/orders?status=${statusFilter}`)
      .then((r) => r?.json?.())
      .then((data: any) => setOrders(data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res?.ok) {
        toast.success(`Order updated to ${newStatus}`);
        fetchOrders();
      } else toast.error("Failed to update");
    } catch { toast.error("Error updating order"); }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl font-bold tracking-tight">Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : (orders?.length ?? 0) === 0 ? (
        <div className="py-20 text-center"><p className="text-lg text-muted-foreground">No orders found.</p></div>
      ) : (
        <div className="space-y-4">
          {(orders ?? []).map((order: Order, idx: number) => (
            <motion.div key={order?.id ?? idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-mono text-sm font-bold">{order?.orderNumber ?? ""}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{order?.user?.name ?? order?.user?.email ?? ""}</span>
                        {order?.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{order.phone}</span>}
                      </div>
                      {order?.deliveryAddress && (
                        <p className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 shrink-0" />{order.deliveryAddress}</p>
                      )}
                      {order?.notes && <p className="mt-1 text-xs italic text-muted-foreground">Note: {order.notes}</p>}
                    </div>
                    <div className="text-right">
                      <OrderStatusBadge status={order?.status ?? ""} />
                      <p className="mt-1 text-lg font-bold text-primary">${(order?.total ?? 0)?.toFixed?.(2)}</p>
                      <p className="text-xs text-muted-foreground capitalize">Payment: {order?.paymentMethod === "cod" ? "COD" : (order?.paymentMethod ?? "")}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {(order?.items ?? []).map((item: OrderItem) => (
                      <span key={item?.id} className="mr-3">{item?.menuItem?.name ?? "Item"} x{item?.quantity ?? 0} (${((item?.price ?? 0) * (item?.quantity ?? 0))?.toFixed?.(2)})</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => (
                      <Button
                        key={s}
                        variant={order?.status === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(order?.id ?? "", s)}
                        disabled={order?.status === s}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
