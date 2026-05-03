"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.abacus.ai/images/57f2e25a-2fdf-4569-9418-ca72f84eec8a.png"
          alt="EUGENIO'S cozy Italian restaurant interior with warm lighting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium uppercase tracking-widest text-amber-400">
              Authentic Italian Cuisine
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome to <span className="text-amber-400">EUGENIO&apos;S</span>
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Experience the warmth of traditional Italian cooking. Handcrafted pasta, wood-fired pizzas, and recipes passed down through generations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/menu">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                View Our Menu <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
