"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const router = useRouter();

  useEffect(() => {
    if (!onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [onboardingComplete, router]);

  if (!onboardingComplete) return null;

  return <>{children}</>;
}
