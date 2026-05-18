"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  
  // Track if we just merged to prevent infinite sync loops
  const [syncedWithDb, setSyncedWithDb] = useState(false);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("hunkx_cart");
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // 2. Sync with Supabase on Login
  useEffect(() => {
    const fetchAndMergeCart = async () => {
      if (!user) {
        setSyncedWithDb(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("user_carts")
        .select("cart_items")
        .eq("user_id", user.id)
        .single();
        
      let dbCart = [];
      if (data && data.cart_items) {
        dbCart = data.cart_items;
      }

      // Merge local cart with db cart
      let merged = [...dbCart];
      const localCartStr = localStorage.getItem("hunkx_cart");
      let localCart = [];
      if (localCartStr) {
         try { localCart = JSON.parse(localCartStr); } catch (e) {}
      }
      
      localCart.forEach(localItem => {
        const existing = merged.find(i => i.id === localItem.id && i.size === localItem.size);
        if (existing) {
          // If it exists in DB, we could sum quantities.
          // But to avoid compounding quantities on every refresh, 
          // let's only add it if it's completely new, or just take the max quantity.
          existing.quantity = Math.max(existing.quantity, localItem.quantity);
        } else {
          merged.push(localItem);
        }
      });
      
      setCartItems(merged);
      setSyncedWithDb(true);
      
      // Save merged cart back to db
      await supabase.from("user_carts").upsert({
        user_id: user.id,
        cart_items: merged,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    };

    if (isLoaded) {
      fetchAndMergeCart();
    }
  }, [user, isLoaded]);

  // 3. Save changes to LocalStorage and DB when cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hunkx_cart", JSON.stringify(cartItems));
      
      // Only sync to db if we've finished the initial merge for this session
      if (user && syncedWithDb) {
        supabase.from("user_carts").upsert({
          user_id: user.id,
          cart_items: cartItems,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }).then();
      }
    }
  }, [cartItems, isLoaded, user, syncedWithDb]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === size) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, size, quantity }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.size === size) 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
