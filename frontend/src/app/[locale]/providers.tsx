"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleSync } from "@/components/providers/locale-sync";
import { MotionConfig } from "framer-motion";

function PersistRehydrate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);
  return (
    <>
      <LocaleSync />
      {children}
    </>
  );
}

function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const setIsOnline = useAppStore((s) => s.setIsOnline);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <PersistRehydrate>
              <OnlineStatusProvider>
                {children}
                <Toaster />
              </OnlineStatusProvider>
            </PersistRehydrate>
          </ThemeProvider>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
