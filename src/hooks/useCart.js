import { useState, useCallback } from "react";

export function useCart(products, showToast) {
  const [cart, setCart] = useState([]); // {id, qty}

  const addToCart = useCallback((id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, qty: 1 }];
    });
    const p = products.find((x) => x.id === id);
    if (p) showToast(`Added "${p.name}" to cart`);
  }, [products, showToast]);

  const changeQty = useCallback((id, delta) => {
    setCart((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i));
      return next.filter((i) => i.qty > 0);
    });
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const subtotal = cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  return { cart, addToCart, changeQty, removeItem, clearCart, subtotal, totalQty };
}
