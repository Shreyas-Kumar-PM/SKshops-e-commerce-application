import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_BASE = "http://localhost:3000/api";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    fetch(`${API_BASE}/cart_items`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          setItems([]);
          return;
        }
        const data = await res.json().catch(() => []);
        const list = Array.isArray(data) ? data : data.items || [];
        setItems(list);
      })
      .catch(() => {
        setItems([]);
      });
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await fetch(`${API_BASE}/cart_items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Please log in to add items to your cart.");
      }
      throw new Error(data.error || "Failed to add to cart");
    }

    setItems((prev) => {
      const prevList = Array.isArray(prev) ? prev : [];
      const existing = prevList.find((i) => i.id === data.id);
      if (existing) {
        return prevList.map((i) => (i.id === data.id ? data : i));
      }
      return [...prevList, data];
    });
  };

  const updateQuantity = async (id, quantity) => {
    const res = await fetch(`${API_BASE}/cart_items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Update failed");

    setItems((prev) => {
      const prevList = Array.isArray(prev) ? prev : [];
      return prevList.map((i) => (i.id === data.id ? data : i));
    });
  };

  const removeItem = async (id) => {
    await fetch(`${API_BASE}/cart_items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setItems((prev) => {
      const prevList = Array.isArray(prev) ? prev : [];
      return prevList.filter((i) => i.id !== id);
    });
  };

  const checkout = async () => {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Checkout failed");
    setItems([]);
    return data;
  };

  const safeItems = Array.isArray(items) ? items : [];
  const totalCount = safeItems.reduce(
    (acc, i) => acc + (i.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: safeItems,
        addToCart,
        updateQuantity,
        removeItem,
        checkout,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
