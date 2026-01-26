import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false, 

  // Action to set the user and set authenticated to true
  login: (userData) => set({ 
    user: userData, 
    isAuthenticated: true 
  }),

  // Action to log out and reset both values
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}));

export default useAuthStore;