"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart, Plus, Search, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
  category: Category | null;
}

export function MenuPageClient() {
  const { data: session } = useSession() || {};
  const addItem = useCartStore((s) => s?.addItem);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/menu").then((r) => r?.json?.()).catch(() => []),
      fetch("/api/categories").then((r) => r?.json?.()).catch(() => []),
    ]).then(([menuData, catData]) => {
      setItems(menuData ?? []);
      setCategories(catData ?? []);
      setLoading(false);
    });
  }, []);

  const filteredItems = (items ?? []).filter((item: MenuItem) => {
    const matchesCategory = selectedCategory === "all" || item?.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item?.name?.toLowerCase?.()?.includes?.(searchQuery?.toLowerCase?.() ?? "") ||
      item?.description?.toLowerCase?.()?.includes?.(searchQuery?.toLowerCase?.() ?? "");
    return matchesCategory && matchesSearch && item?.isAvailable;
  });

  const handleAddToCart = (item: MenuItem) => {
    if (!session?.user) {
      toast.error("Please sign in to add items to your cart");
      return;
    }
    addItem?.({
      id: item?.id ?? "",
      name: item?.name ?? "",
      price: item?.price ?? 0,
      imageUrl: item?.imageUrl ?? null,
    });
    toast.success(`${item?.name ?? "Item"} added to cart`);
  };

  // Group by category
  const groupedItems: Record<string, MenuItem[]> = {};
  for (const item of filteredItems) {
    const catName = item?.category?.name ?? "Other";
    if (!groupedItems[catName]) groupedItems[catName] = [];
    groupedItems[catName].push(item);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Our Menu</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Explore Our Dishes
        </h1>
        <p className="mt-2 text-muted-foreground">
          From classic appetizers to indulgent desserts, every dish tells a story.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e?.target?.value ?? "")}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {(categories ?? []).map((cat: Category) => (
            <Button
              key={cat?.id}
              variant={selectedCategory === cat?.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat?.id ?? "all")}
            >
              {cat?.name ?? ""}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-muted h-80" />
          ))}
        </div>
      ) : (filteredItems?.length ?? 0) === 0 ? (
        <div className="py-20 text-center">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg text-muted-foreground">No dishes found matching your criteria.</p>
        </div>
      ) : (
        Object.entries(groupedItems ?? {}).map(([catName, catItems]) => (
          <div key={catName} className="mb-10">
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">{catName}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {(catItems ?? []).map((item: MenuItem, idx: number) => (
                  <motion.div
                    key={item?.id ?? idx}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        {item?.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item?.name ?? "Menu item"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        {!item?.isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Badge variant="destructive">Unavailable</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="flex flex-1 flex-col p-4">
                        <h3 className="font-display text-lg font-semibold">{item?.name ?? ""}</h3>
                        <p className="mt-1 flex-1 text-sm text-muted-foreground line-clamp-2">
                          {item?.description ?? ""}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            ${(item?.price ?? 0)?.toFixed?.(2) ?? "0.00"}
                          </span>
                          {session?.user ? (
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="gap-1"
                              disabled={!item?.isAvailable}
                            >
                              <Plus className="h-4 w-4" /> Add
                            </Button>
                          ) : (
                            <Link href="/login">
                              <Button size="sm" variant="outline" className="gap-1">
                                <ShoppingCart className="h-4 w-4" /> Sign in to order
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
