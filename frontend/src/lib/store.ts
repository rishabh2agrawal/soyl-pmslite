import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale, UserRole } from "@/types";

export type ThemeMode = "light" | "dark" | "system";

interface AppState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  syncQueue: number;
  setSyncQueue: (count: number) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  propertyName: string;
  setPropertyName: (name: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      locale: "en",
      setLocale: (locale) => set({ locale }),
      userRole: "owner",
      setUserRole: (userRole) => set({ userRole }),
      isOnline: true,
      setIsOnline: (isOnline) => set({ isOnline }),
      syncQueue: 0,
      setSyncQueue: (syncQueue) => set({ syncQueue }),
      onboardingStep: 0,
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      onboardingComplete: false,
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      propertyName: "",
      setPropertyName: (propertyName) => set({ propertyName }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "soyl-pms-store",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
