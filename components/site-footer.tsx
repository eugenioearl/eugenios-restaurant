import Link from "next/link";
import { ChefHat } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-semibold text-primary">EUGENIO&apos;S</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
        </nav>
        <p className="text-xs text-muted-foreground">&copy; 2026 EUGENIO&apos;S. All rights reserved.</p>
      </div>
    </footer>
  );
}
