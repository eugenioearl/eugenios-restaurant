"use client";
import { useCartStore, CartItem } from "@/lib/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export function CartPageClient() {
  const items = useCartStore((s) => s?.items ?? []);
  const updateQuantity = useCartStore((s) => s?.updateQuantity);
  const removeItem = useCartStore((s) => s?.removeItem);
  const getTotal = useCartStore((s) => s?.getTotal);

  const total = getTotal?.() ?? 0;
  const tax = total * 0.08;
  const grandTotal = total + tax;

  if ((items?.length ?? 0) === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h2 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Browse our delicious menu and add some items!</p>
        <Link href="/menu">
          <Button className="mt-6 gap-2">Browse Menu <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {(items ?? []).map((item: CartItem) => (
              <motion.div key={item?.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item?.imageUrl && <Image src={item.imageUrl} alt={item?.name ?? ""} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item?.name ?? ""}</h3>
                      <p className="text-sm text-primary font-medium">${(item?.price ?? 0)?.toFixed?.(2) ?? "0.00"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity?.(item?.id ?? "", (item?.quantity ?? 1) - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item?.quantity ?? 0}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity?.(item?.id ?? "", (item?.quantity ?? 0) + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="w-20 text-right font-bold">${((item?.price ?? 0) * (item?.quantity ?? 0))?.toFixed?.(2) ?? "0.00"}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeItem?.(item?.id ?? "")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="mb-4 font-display text-xl font-bold">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total?.toFixed?.(2) ?? "0.00"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax?.toFixed?.(2) ?? "0.00"}</span></div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">${grandTotal?.toFixed?.(2) ?? "0.00"}</span></div>
                </div>
              </div>
              <Link href="/checkout"><Button className="mt-6 w-full gap-2" size="lg">Proceed to Checkout <ArrowRight className="h-4 w-4" /></Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
