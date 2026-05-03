"use client";
import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item: Omit<CartItem, "quantity">) => {
    set((state: CartStore) => {
      const existing = state.items?.find((i: CartItem) => i?.id === item?.id);
      if (existing) {
        return {
          items: (state.items ?? []).map((i: CartItem) =>
            i?.id === item?.id ? { ...(i ?? {}), quantity: (i?.quantity ?? 0) + 1 } : i
          ),
        };
      }
      return { items: [...(state.items ?? []), { ...(item ?? {}), quantity: 1 }] };
    });
  },
  removeItem: (id: string) => {
    set((state: CartStore) => ({
      items: (state.items ?? []).filter((i: CartItem) => i?.id !== id),
    }));
  },
  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      set((state: CartStore) => ({
        items: (state.items ?? []).filter((i: CartItem) => i?.id !== id),
      }));
      return;
    }
    set((state: CartStore) => ({
      items: (state.items ?? []).map((i: CartItem) =>
        i?.id === id ? { ...(i ?? {}), quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const items = get()?.items ?? [];
    return items.reduce((sum: number, i: CartItem) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0);
  },
  getItemCount: () => {
    const items = get()?.items ?? [];
    return items.reduce((sum: number, i: CartItem) => sum + (i?.quantity ?? 0), 0);
  },
}));
