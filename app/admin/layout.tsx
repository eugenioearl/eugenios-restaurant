import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Admin Dashboard - EUGENIO'S" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30">{children}</main>
    </div>
  );
}
