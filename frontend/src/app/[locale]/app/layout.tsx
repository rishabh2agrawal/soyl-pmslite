"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, onboardingComplete, router]);

  if (!hasHydrated) return null;
  if (!onboardingComplete) return null;

  return <>{children}</>;
}
