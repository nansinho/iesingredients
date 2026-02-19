import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CartItem {
  code: string;
  name: string;
  category: string;
  quantity: number;
}

interface SampleCartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (code: string) => void;
  updateQuantity: (code: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
}

const useCartStore = create<SampleCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.code === item.code);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.code === item.code ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (code) => {
        set({ items: get().items.filter((i) => i.code !== code) });
      },

      updateQuantity: (code, quantity) => {
        if (quantity <= 0) {
          get().removeItem(code);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.code === code ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "ies-sample-cart",
    }
  )
);

/**
 * Hydration-safe wrapper around the cart store.
 * Returns empty state during SSR/hydration to prevent mismatches,
 * then syncs with localStorage after mount.
 */
export function useSampleCart() {
  const store = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return {
      ...store,
      items: [],
      itemCount: () => 0,
    };
  }

  return store;
}
