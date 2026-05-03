"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore, CartItem } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { MapPin, Phone, CreditCard, Banknote, Loader2, CheckCircle2, NotepadText } from "lucide-react";
import Link from "next/link";

export function CheckoutPageClient() {
  const { data: session } = useSession() || {};
  const items = useCartStore((s) => s?.items ?? []);
  const getTotal = useCartStore((s) => s?.getTotal);
  const clearCart = useCartStore((s) => s?.clearCart);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetch("/api/profile").then((r) => r?.json?.()).then((data: any) => {
        if (data?.address) setAddress(data.address);
        if (data?.phone) setPhone(data.phone);
      }).catch(() => {});
    }
  }, [session?.user]);

  const total = getTotal?.() ?? 0;
  const tax = total * 0.08;
  const grandTotal = total + tax;

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="font-display text-2xl font-bold">Order Placed!</h2>
        <p className="mt-2 text-muted-foreground">
          Your order <span className="font-mono font-semibold text-foreground">{orderNumber}</span> has been placed successfully.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Payment: Cash on Delivery</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/orders"><Button>View My Orders</Button></Link>
          <Link href="/menu"><Button variant="outline">Continue Ordering</Button></Link>
        </div>
      </div>
    );
  }

  if ((items?.length ?? 0) === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
        <Link href="/menu"><Button className="mt-4">Browse Menu</Button></Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address) { toast.error("Please enter a delivery address"); return; }
    setLoading(true);
    try {
      const orderItems = (items ?? []).map((item: CartItem) => ({ menuItemId: item?.id ?? "", quantity: item?.quantity ?? 1 }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems, paymentMethod, deliveryAddress: address, phone, notes }),
      });
      const data = await res?.json?.();
      if (!res?.ok) { toast.error(data?.error ?? "Failed to place order"); return; }
      setOrderNumber(data?.orderNumber ?? "");
      setOrderPlaced(true);
      clearCart?.();
      toast.success("Order placed successfully!");
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold tracking-tight">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5 text-primary" /> Delivery Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea id="address" placeholder="Enter your full delivery address" value={address} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e?.target?.value ?? "")} rows={3} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="phone" placeholder="Your phone number" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e?.target?.value ?? "")} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions</Label>
                <div className="relative">
                  <NotepadText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea id="notes" placeholder="Any special requests" value={notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e?.target?.value ?? "")} className="pl-10" rows={2} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="h-5 w-5 text-primary" /> Payment Method</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(v: string) => setPaymentMethod(v ?? "cod")}>
                <div className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-5 w-5 text-green-600" />
                    <div><p className="font-medium">Cash on Delivery</p><p className="text-xs text-muted-foreground">Pay when your order arrives</p></div>
                  </Label>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4 opacity-50 cursor-not-allowed mt-2">
                  <RadioGroupItem value="stripe" id="stripe" disabled />
                  <Label htmlFor="stripe" className="flex items-center gap-2 cursor-not-allowed flex-1">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div><p className="font-medium">Credit / Debit Card</p><p className="text-xs text-muted-foreground">Coming soon — Stripe integration</p></div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="mb-4 font-display text-xl font-bold">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {(items ?? []).map((item: CartItem) => (
                  <div key={item?.id} className="flex justify-between text-sm">
                    <span className="truncate max-w-[180px]">{item?.name ?? ""} x{item?.quantity ?? 0}</span>
                    <span className="font-medium">${((item?.price ?? 0) * (item?.quantity ?? 0))?.toFixed?.(2) ?? "0.00"}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total?.toFixed?.(2) ?? "0.00"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${tax?.toFixed?.(2) ?? "0.00"}</span></div>
                <div className="border-t pt-2"><div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">${grandTotal?.toFixed?.(2) ?? "0.00"}</span></div></div>
              </div>
              <Button className="mt-6 w-full" size="lg" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
