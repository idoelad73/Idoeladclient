import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Action to set the user and set authenticated to true
  login: (userData) => set({
    user: userData,
    isAuthenticated: true
  }),

  // Action to merge updated fields into the current user (e.g. address/phone)
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  })),

  // Action to log out and reset both values
  logout: () => set({
    user: null,
    isAuthenticated: false
  }),
}));

export default useAuthStore;