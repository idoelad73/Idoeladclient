import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],

  addToCart: (product) => {
    const { cartItems } = get();
    
    // Check if item already exists
    const isDuplicate = cartItems.some((item) => item.id === product.id);
    if (isDuplicate) return false;

    // Create new item with safe numbers
    const newItem = { 
      ...product, 
      cartItemId: Date.now() + Math.random(), 
      qty: Number(product.qty) || 1 // Ensure qty is at least 1 and a valid number
    };

    set({ cartItems: [...cartItems, newItem] });
    return true;
  },

  updateQuantity: (cartItemId, change) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          const currentQty = Number(item.qty) || 1;
          const newQty = Math.max(1, Math.min(item.stock || 99, currentQty + change));
          return { ...item, qty: newQty };
        }
        return item;
      }),
    }));
  },

  removeFromCart: (uniqueId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.cartItemId !== uniqueId),
    }));
  },

  clearCart: () => set({ cartItems: [] }),
}));