import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/types';
import { getCurrentUser } from '@/lib/auth';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          console.error('Error fetching user:', error);
          set({ user: null, isLoading: false });
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);