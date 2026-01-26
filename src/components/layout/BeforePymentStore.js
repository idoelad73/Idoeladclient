import { create } from 'zustand';

export const useOrderStore = create((set, get) => ({
  // ✅ Single source of truth for checkout
  orderRequest: {
    user_id: null,          // 🔥 allow Google / regular users
    products: [],
    user_adress: '',
    user_phone: '',
    notes: '',
    total_price: 0,
  },

  // ===============================
  // 1️⃣ Set Order Items (from cart)
  // ===============================
  setOrderItems: (cartItems, userId) => {
    const formattedProducts = cartItems.map((item) => ({
      product_id: item._id || item.id, // Mongo-safe
      quantity: Number(item.qty),
      product_rtp: Number(item.price),
    }));

    const total = formattedProducts.reduce(
      (acc, p) => acc + p.product_rtp * p.quantity,
      0
    );

    set((state) => ({
      orderRequest: {
        ...state.orderRequest,
        user_id: userId ?? state.orderRequest.user_id, // ✅ Google-safe
        products: formattedProducts,
        total_price: total,
      },
    }));
  },

  // ===============================
  // 2️⃣ Set / Update Contact Info
  // ===============================
  setContactInfo: ({ user_adress, user_phone, notes }) => {
    set((state) => ({
      orderRequest: {
        ...state.orderRequest,
        user_adress: user_adress ?? state.orderRequest.user_adress,
        user_phone: user_phone ?? state.orderRequest.user_phone,
        notes: notes ?? state.orderRequest.notes,
      },
    }));
  },

  // ===============================
  // 3️⃣ Reset After Purchase
  // ===============================
  resetOrder: () =>
    set({
      orderRequest: {
        user_id: null,
        products: [],
        user_adress: '',
        user_phone: '',
        notes: '',
        total_price: 0,
      },
    }),
}));
