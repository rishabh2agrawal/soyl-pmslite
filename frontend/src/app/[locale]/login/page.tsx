"use client";

import Image from "next/image";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useAppStore } from "@/lib/store";
import { pageTransitionProps } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useTranslations } from "next-intl";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const propertyName = useAppStore((s) => s.propertyName);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"owner" | "manager">("manager");
  const [loading, setLoading] = useState(false);
  const { setOnboardingComplete, setPropertyName, setUserRole } = useAppStore();

  const displayName = propertyName?.trim() || "Your property";

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setPropertyName(propertyName?.trim() || "Sunset Lodge");
    setOnboardingComplete(true);
    setUserRole(role);
    router.replace(role === "owner" ? "/app/owner" : "/app/manager");
    setLoading(false);
  };

  const canSubmit = email.includes("@") && password.length >= 1;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background px-4 dark:from-teal/10 dark:via-background dark:to-background">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[90px] dark:bg-teal/10" />
      </div>

      <motion.div {...pageTransitionProps} className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted shadow-md ring-4 ring-border">
            <Image
              src="/icon.png"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Property Management System
            </p>
          </div>
        </div>

        <div className="mb-6 flex rounded-xl border border-border bg-muted/40 p-1 dark:border-white/10 dark:bg-white/5">
          {(["manager", "owner"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={
                role === r
                  ? "flex-1 rounded-lg border border-primary/25 bg-background py-2 text-sm font-medium text-primary shadow-sm transition-all dark:border-teal dark:bg-teal/10 dark:text-teal"
                  : "flex-1 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
              }
              aria-label={r}
              aria-pressed={role === r}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <div className="surface-card space-y-5 p-6 dark:liquid-glass">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-3 py-3 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 dark:bg-white/[0.04] dark:focus-within:border-teal/40 dark:focus-within:ring-teal/20">
              <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/50 px-3 py-3 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 dark:bg-white/[0.04] dark:focus-within:border-teal/40 dark:focus-within:ring-teal/20">
              <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex cursor-not-allowed items-center gap-2 text-sm text-muted-foreground opacity-70">
              <Checkbox disabled aria-hidden />
              {t("remember")}
            </label>
            <a
              href="#"
              className="text-sm font-medium text-primary hover:underline dark:text-teal"
            >
              {t("forgot")}
            </a>
          </div>

          <Button
            type="button"
            onClick={handleLogin}
            disabled={loading || !canSubmit}
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/25 dark:bg-teal dark:text-ink dark:shadow-glow"
          >
            {loading ? t("signingIn") : t("signIn")}
          </Button>

          <p className="text-center text-xs text-muted-foreground">{t("needAccess")}</p>
          <p className="text-center text-2xs text-muted-foreground/80">{t("demoHint")}</p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SOYL AI Private Limited · Story Of Your Life
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <ThemeToggle compact />
          <LanguageSwitcher compact />
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("newProperty")}{" "}
          <Link
            href="/onboarding"
            className="font-medium text-primary hover:underline dark:text-teal"
          >
            {t("setup")} →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
