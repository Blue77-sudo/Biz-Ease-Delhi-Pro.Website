import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  gstin?: string;
  udyamNumber?: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  businessProfile: BusinessProfile | null;
  isAuthenticated: boolean;
  language: 'en' | 'hi';
  setUser: (user: User | null) => void;
  setBusinessProfile: (profile: BusinessProfile | null) => void;
  setLanguage: (language: 'en' | 'hi') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      businessProfile: null,
      isAuthenticated: false,
      language: 'en',
      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
      setBusinessProfile: (businessProfile: BusinessProfile | null) => set({ businessProfile }),
      setLanguage: (language: 'en' | 'hi') => set({ language }),
      logout: () => set({ user: null, businessProfile: null, isAuthenticated: false }),
    }),
    {
      name: 'biz-ease-auth',
    }
  )
);
