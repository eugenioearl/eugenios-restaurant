"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ClipboardList, ChefHat } from "lucide-react";

export function AdminDashboardClient() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Manage your restaurant menu and orders.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" /> Menu Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Add, edit, or remove menu items and categories.</p>
            <Link href="/admin/menu"><Button className="w-full">Manage Menu</Button></Link>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" /> Order Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">View all orders and update their status.</p>
            <Link href="/admin/orders"><Button className="w-full">Manage Orders</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
