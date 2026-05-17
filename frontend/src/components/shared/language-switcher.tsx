"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import type { Locale } from "@/types";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
] as const;

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useAppStore((s) => s.setLocale);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const handleChange = (code: Locale) => {
    setLocale(code);
    router.replace(pathname, { locale: code });
  };

  if (!compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleChange(lang.code)}
            className={
              locale === lang.code
                ? "flex flex-col items-center gap-1 rounded-xl border-2 border-primary bg-primary/10 p-3 text-sm font-semibold text-primary shadow-sm transition-all dark:border-teal dark:bg-teal/10 dark:text-teal"
                : "flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            }
          >
            <span className="text-xl" aria-hidden>
              {lang.flag}
            </span>
            <span className="text-xs">{lang.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-border hover:bg-accent/10 hover:text-primary"
          aria-label="Choose language"
        >
          <Globe className="size-3.5 shrink-0" aria-hidden />
          <span>
            {current.flag} {current.label}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={
              locale === lang.code ? "font-semibold text-primary dark:text-teal" : ""
            }
          >
            {lang.flag} {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
