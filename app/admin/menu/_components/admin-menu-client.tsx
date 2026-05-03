"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, UtensilsCrossed } from "lucide-react";

interface Category { id: string; name: string; }
interface MenuItem {
  id: string; name: string; description: string | null; price: number;
  imageUrl: string | null; isAvailable: boolean; categoryId: string;
  category: Category | null;
}

const emptyForm = { name: "", description: "", price: "", imageUrl: "", categoryId: "", isAvailable: true };

export function AdminMenuClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/menu").then((r) => r?.json?.()).catch(() => []),
      fetch("/api/categories").then((r) => r?.json?.()).catch(() => []),
    ]).then(([m, c]) => { setItems(m ?? []); setCategories(c ?? []); setLoading(false); });
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: MenuItem) => {
    setEditingId(item?.id ?? null);
    setForm({
      name: item?.name ?? "", description: item?.description ?? "",
      price: String(item?.price ?? ""), imageUrl: item?.imageUrl ?? "",
      categoryId: item?.categoryId ?? "", isAvailable: item?.isAvailable ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) { toast.error("Name, price, and category are required"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/menu/${editingId}` : "/api/menu";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res?.ok) {
        toast.success(editingId ? "Item updated" : "Item created");
        setDialogOpen(false); fetchData();
      } else { const d = await res?.json?.(); toast.error(d?.error ?? "Failed"); }
    } catch { toast.error("Error saving"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res?.ok) { toast.success("Item deleted"); fetchData(); }
      else toast.error("Failed to delete");
    } catch { toast.error("Error deleting"); }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl font-bold tracking-tight">Menu Items</h1>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Item</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(items ?? []).map((item: MenuItem) => (
            <Card key={item?.id} className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-muted">
                {item?.imageUrl && <Image src={item.imageUrl} alt={item?.name ?? ""} fill className="object-cover" />}
                {!item?.isAvailable && (
                  <div className="absolute top-2 right-2 rounded bg-destructive px-2 py-0.5 text-xs text-white font-medium">Unavailable</div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="text-xs text-primary font-medium uppercase mb-1">{item?.category?.name ?? ""}</div>
                <h3 className="font-semibold">{item?.name ?? ""}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{item?.description ?? ""}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-primary">${(item?.price ?? 0)?.toFixed?.(2)}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item?.id ?? "")}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, name: e?.target?.value ?? ""})} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({...form, description: e?.target?.value ?? ""})} rows={2} /></div>
            <div className="space-y-2"><Label>Price *</Label><Input type="number" step="0.01" value={form.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, price: e?.target?.value ?? ""})} /></div>
            <div className="space-y-2"><Label>Image URL</Label><Input value={form.imageUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, imageUrl: e?.target?.value ?? ""})} placeholder="/menu/image.jpg or URL" /></div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.categoryId} onValueChange={(v: string) => setForm({...form, categoryId: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{(categories ?? []).map((c: Category) => <SelectItem key={c?.id} value={c?.id ?? ""}>{c?.name ?? ""}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isAvailable} onCheckedChange={(v: boolean) => setForm({...form, isAvailable: v})} />
              <Label>Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
