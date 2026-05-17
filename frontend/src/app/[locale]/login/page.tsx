"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/routing";
import { useAppStore } from "@/lib/store";
import {
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { pageTransitionProps } from "@/lib/motion";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"owner" | "manager">("manager");
  const [loading, setLoading] = useState(false);
  const { setOnboardingComplete, setPropertyName, setUserRole } = useAppStore();

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setPropertyName("Sunset Lodge");
    setOnboardingComplete(true);
    setUserRole(role);
    router.replace(role === "owner" ? "/app/owner" : "/app/manager");
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.05] blur-[80px]" />
      </div>

      <motion.div {...pageTransitionProps} className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/icon.png"
            alt="SOYL"
            width={52}
            height={52}
            className="size-[52px] rounded-full shadow-glow"
            priority
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-chalk">
              soyl<span className="text-teal">PMS</span>
            </h1>
            <p className="mt-0.5 text-xs text-plum">Welcome back</p>
          </div>
        </div>

        <div className="mb-6 flex rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
          {(["manager", "owner"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                role === r
                  ? "border border-teal/20 bg-teal/12 text-teal"
                  : "text-plum hover:text-chalk",
              )}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <div className="liquid-glass rounded-2xl p-6 shadow-raised">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-2xs font-semibold uppercase tracking-[0.15em] text-plum">
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all focus-within:border-teal/40 focus-within:shadow-glow-sm">
                <span className="flex items-center border-r border-white/[0.08] px-3 text-xs text-plum">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  inputMode="tel"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-chalk outline-none placeholder:text-plum/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-2xs font-semibold uppercase tracking-[0.15em] text-plum">
                Password
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all focus-within:border-teal/40 focus-within:shadow-glow-sm">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-chalk outline-none placeholder:text-plum/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-3 text-plum transition-colors hover:text-chalk"
                >
                  {showPass ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || phone.length < 10}
              className={cn(
                "group mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal text-sm font-semibold text-ink shadow-glow transition-all duration-200 hover:bg-chalk hover:shadow-raised active:scale-[0.98]",
                "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
              )}
            >
              {loading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              ) : (
                <>
                  Sign in{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-2xs text-plum">
            Demo — any 10-digit number · any password
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-plum">
          New property?{" "}
          <Link
            href="/onboarding"
            className="font-medium text-teal transition-colors hover:text-chalk"
          >
            Set up your account →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
