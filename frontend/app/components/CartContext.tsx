"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  size?: string;
};

export type CartItem = CartProduct & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: CartProduct) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getQuantity: (id: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "omris-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const updateQuantity = (id: string, delta: number) => {
      setItems((current) =>
        current.flatMap((item) => {
          if (item.id !== id) return [item];
          const quantity = item.quantity + delta;
          return quantity > 0 ? [{ ...item, quantity }] : [];
        }),
      );
    };

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: (product) => {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          return existing
            ? current.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...current, { ...product, quantity: 1 }];
        });
      },
      updateQuantity,
      removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
      clearCart: () => setItems([]),
      getQuantity: (id) => items.find((item) => item.id === id)?.quantity ?? 0,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
