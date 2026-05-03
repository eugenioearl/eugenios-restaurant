"use client";
import { motion } from "framer-motion";
import { Heart, Flame, Leaf } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every dish is crafted with passion, using recipes handed down through generations of Italian tradition.",
  },
  {
    icon: Flame,
    title: "Wood-Fired Oven",
    description: "Our authentic Neapolitan pizza oven reaches 900\u00b0F for the perfect crispy yet chewy crust.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "We source the finest local produce and import specialty items directly from Italy.",
  },
];

export function AboutSection() {
  return (
    <section className="bg-accent/30 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Why EUGENIO&apos;S?
          </h2>
          <p className="mt-2 text-muted-foreground">
            A dining experience that feels like home, tastes like Italy.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, idx) => (
            <motion.div
              key={f?.title ?? idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="rounded-xl bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f?.title ?? ""}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f?.description ?? ""}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
