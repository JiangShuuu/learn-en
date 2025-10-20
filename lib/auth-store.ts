import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, tokenManager } from './api-client';
import { mockAPI } from '@/mocks/api';
import { UserProfile } from '@/types';

const USER_KEY = '@learn_en:user';
const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

interface User {
  id: string;
  email: string;
  display_name?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });

      const token = await tokenManager.getToken();
      const userStr = await AsyncStorage.getItem(USER_KEY);

      if (token && userStr) {
        const user = JSON.parse(userStr);

        // Fetch fresh profile
        try {
          const profile = USE_MOCK_API
            ? await mockAPI.profile.get()
            : await apiClient.get<UserProfile>('/profile');

          set({
            user,
            profile,
            initialized: true,
            loading: false,
          });
        } catch (error) {
          // Token might be expired
          await tokenManager.clearAuth();
          await AsyncStorage.removeItem(USER_KEY);
          set({ initialized: true, loading: false });
        }
      } else {
        set({ initialized: true, loading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ initialized: true, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });

      const response = USE_MOCK_API
        ? await mockAPI.auth.login(email, password)
        : await apiClient.post<{
            token: string;
            user: User;
            profile: UserProfile;
          }>('/auth/login', { email, password });

      await tokenManager.setToken(response.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));

      set({
        user: response.user,
        profile: response.profile,
        loading: false,
      });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return {
        error: new Error(error.response?.data?.message || error.message || '登入失敗'),
      };
    }
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      set({ loading: true });

      if (USE_MOCK_API) {
        await mockAPI.auth.register(email, password, displayName);
      } else {
        await apiClient.post('/auth/register', {
          email,
          password,
          display_name: displayName,
        });
      }

      set({ loading: false });
      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return {
        error: new Error(error.response?.data?.message || error.message || '註冊失敗'),
      };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });

      // Optionally call logout endpoint
      try {
        if (USE_MOCK_API) {
          await mockAPI.auth.logout();
        } else {
          await apiClient.post('/auth/logout');
        }
      } catch (error) {
        // Ignore logout errors
      }

      await tokenManager.clearAuth();
      await AsyncStorage.removeItem(USER_KEY);

      set({
        user: null,
        profile: null,
        loading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    try {
      const updatedProfile = USE_MOCK_API
        ? await mockAPI.profile.update(updates)
        : await apiClient.patch<UserProfile>('/profile', updates);

      set({
        profile: updatedProfile,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
}));
