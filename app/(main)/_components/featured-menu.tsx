"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
}

export function FeaturedMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r?.json?.())
      .then((data: any) => {
        const all = data ?? [];
        setItems(all.slice(0, 6));
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              Our Specialties
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Featured Dishes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Discover our most beloved creations, crafted with passion and the finest ingredients.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(items ?? []).map((item: MenuItem, idx: number) => (
            <motion.div
              key={item?.id ?? idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] bg-muted">
                  {item?.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item?.name ?? "Menu item"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
                    {item?.category?.name ?? ""}
                  </div>
                  <h3 className="font-display text-lg font-semibold">{item?.name ?? ""}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {item?.description ?? ""}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    ${(item?.price ?? 0)?.toFixed?.(2) ?? "0.00"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/menu">
            <Button size="lg" variant="outline" className="gap-2">
              View Full Menu <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
