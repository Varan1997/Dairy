import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const CART_KEY = "dairy_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // item: { productId, productName, image, milkType, packSizeId, size, price, quantity }
  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.packSizeId === item.packSizeId
      );
      if (existing) {
        // Refresh metadata (image/milkType/price/etc.) from the latest add too,
        // so a stale entry from before a product edit doesn't stick around.
        return prev.map((i) =>
          i.productId === item.productId && i.packSizeId === item.packSizeId
            ? { ...i, ...item, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (productId, packSizeId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, packSizeId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.packSizeId === packSizeId ? { ...i, quantity } : i
      )
    );
  };

  // Patches fields (e.g. milkType) on an existing item without touching quantity —
  // used to backfill metadata on cart entries saved before that field existed.
  const patchItem = (productId, packSizeId, patch) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.packSizeId === packSizeId ? { ...i, ...patch } : i
      )
    );
  };

  const removeItem = (productId, packSizeId) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.packSizeId === packSizeId))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // Badge count reflects number of distinct items in the cart, not total units
  // (e.g. 2 packets of buffalo milk + 1 packet of ghee = 2 items, not 3).
  const count = items.length;

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, patchItem, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
