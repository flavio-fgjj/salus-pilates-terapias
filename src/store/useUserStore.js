import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userId: null,
  email: null,
  role: null,
  profile: null,
  setUserBasics: ({ userId, email }) => set({ userId, email }),
  setProfile: ({ role, profile }) => set({ role, profile }),
  clearUser: () => set({ userId: null, email: null, role: null, profile: null }),
}));


