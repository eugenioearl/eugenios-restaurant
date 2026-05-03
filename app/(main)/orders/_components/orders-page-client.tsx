"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { ClipboardList, Package, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: { name: string; imageUrl: string | null } | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export function OrdersPageClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r?.json?.())
      .then((data: any) => setOrders(data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-bold tracking-tight">My Orders</h1>
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />)}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold tracking-tight">My Orders</h1>
      </div>

      {(orders?.length ?? 0) === 0 ? (
        <div className="py-20 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground/40" />
          <h2 className="mt-4 font-display text-2xl font-bold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">Your order history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(orders ?? []).map((order: Order, idx: number) => (
            <motion.div
              key={order?.id ?? idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-mono text-sm font-semibold">{order?.orderNumber ?? ""}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order?.status ?? ""} />
                      <span className="text-lg font-bold text-primary">${(order?.total ?? 0)?.toFixed?.(2) ?? "0.00"}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(order?.items ?? []).map((item: OrderItem) => (
                      <span key={item?.id} className="mr-3">
                        {item?.menuItem?.name ?? "Item"} x{item?.quantity ?? 0}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground capitalize">
                    Payment: {order?.paymentMethod === "cod" ? "Cash on Delivery" : (order?.paymentMethod ?? "")}
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
