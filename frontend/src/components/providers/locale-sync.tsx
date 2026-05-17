"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useAppStore } from "@/lib/store";
import type { Locale } from "@/types";

/** Keeps persisted `locale` in sync with the active URL segment (`/en/`, `/hi/`, `/kn/`). */
export function LocaleSync() {
  const urlLocale = useLocale() as Locale;
  const setLocale = useAppStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(urlLocale);
  }, [setLocale, urlLocale]);

  return null;
}
