import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import type { AuthState } from '@/types/auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({ accessToken: null, user: null, loading: false});
  },

  signUp: async (username, password, email, phone, firstName, lastName) => {
    try {
      set({ loading: true });
      // Simulate API call
      await authService.signUp(username, password, email, phone, firstName, lastName);
      toast.success('Sign up successful');
    } catch (error) {
      console.error('Sign up failed', error);
      toast.error('Sign up failed');
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });
      const response = await authService.signIn(username, password);
      set({ accessToken: response.accessToken });
      toast.success('Sign in successful');
    } catch (error) {
      console.error("Sign in failed", error);
      toast.error('Sign in failed');
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      // Simulate sign out process
      await authService.signOut();
      get().clearState();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error("Sign out failed", error);
      toast.error('Sign out failed');
    } finally {
      set({ loading: false });
    }
  }
}));