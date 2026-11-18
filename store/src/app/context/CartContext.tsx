"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("store_cart");
    if (saved) setCart(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("store_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const addQty = product.quantity || 1;
      const maxStock = product.stock || 99;

      if (existing) {
        const newQty = existing.quantity + addQty;
        if (newQty > maxStock) {
          alert(`عذراً، الكمية المتوفرة في المخزون هي ${maxStock} فقط.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { ...product, quantity: Math.min(addQty, maxStock) }];
    });
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const maxStock = item.stock !== undefined ? item.stock : 99;
          if (newQty > maxStock) {
            alert(`عذراً، الكمية المتوفرة في المخزون هي ${maxStock} فقط.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
