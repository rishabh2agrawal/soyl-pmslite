"use client";

import {
  Zap,
  BedDouble,
  BarChart3,
  CalendarDays,
  MessageSquare,
  Globe,
  ArrowRight,
  Quote,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeUp,
  fadeIn,
  stagger,
  staggerItem,
  landingPreview,
} from "@/lib/motion";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const NAV_ANCHORS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

const FEATURES: {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: "teal" | "plum";
}[] = [
  {
    icon: Zap,
    title: "30-second check-in",
    desc: "Walk-in to room assigned in under 30 seconds. Built for front desk speed.",
    accent: "teal",
  },
  {
    icon: BedDouble,
    title: "Live room grid",
    desc: "Colour-coded housekeeping status across every floor, updated in real-time.",
    accent: "teal",
  },
  {
    icon: BarChart3,
    title: "Owner dashboard",
    desc: "Occupancy, daily revenue, and trends — without spreadsheets.",
    accent: "plum",
  },
  {
    icon: CalendarDays,
    title: "Availability calendar",
    desc: "Gantt-style view across rooms. Tap any gap to create a booking.",
    accent: "teal",
  },
  {
    icon: MessageSquare,
    title: "Guest requests",
    desc: "Housekeeping, maintenance, and F&B requests tracked end-to-end.",
    accent: "plum",
  },
  {
    icon: Globe,
    title: "Works offline",
    desc: "Critical operations continue without internet. Syncs automatically.",
    accent: "teal",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Set up your property",
    desc: "Add your rooms, rates, and staff in minutes with guided onboarding.",
  },
  {
    n: "02",
    title: "Start taking bookings",
    desc: "Walk-ins, phone, and OTA — all managed from one screen.",
  },
  {
    n: "03",
    title: "Run your operation",
    desc: "Housekeeping, guest requests, folios, and day-close in one place.",
  },
];

const TESTIMONIALS = [
  {
    quote: "We switched from spreadsheets in a weekend.",
    name: "Priya Rao",
    role: "Owner, Kudla Retreat",
  },
  {
    quote: "Housekeeping sees room status instantly. No radios.",
    name: "Rahul KM",
    role: "Front office, Mysuru Lodge",
  },
  {
    quote: "Day-close is five minutes instead of forty.",
    name: "Anita S",
    role: "Manager, Coorg Greens",
  },
];

function featureIconWrap(accent: "teal" | "plum") {
  return accent === "teal"
    ? "bg-teal/10 text-teal"
    : "bg-plum/20 text-chalk/80 ring-1 ring-white/[0.06]";
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-ink text-chalk">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="glass-heavy safe-area-pt fixed inset-x-0 top-0 z-50 border-b border-white/[0.05]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="SOYL"
            width={32}
            height={32}
            className="size-8 rounded-full transition-[box-shadow] group-hover:shadow-glow"
            priority
          />
          <span className="text-base font-semibold leading-none tracking-tight text-chalk">
            soyl<span className="text-teal">PMS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Page">
          {NAV_ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="text-sm text-plum transition-colors hover:text-chalk"
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-plum transition-colors hover:bg-white/[0.04] hover:text-chalk sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-xl border border-teal/30 bg-teal/10 px-3 py-2 text-sm font-semibold text-teal shadow-none transition-all hover:border-teal/50 hover:bg-teal/18 hover:shadow-glow-sm sm:px-4 sm:py-2.5"
          >
            Get started
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[700px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.06] blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 size-[600px] max-w-[100vw] translate-x-1/4 rounded-full bg-plum/[0.12] blur-[100px]" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/[0.07] px-4 py-1.5"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-teal" />
        <span className="text-xs font-medium tracking-wide text-teal">
          Purpose-built for Indian hospitality
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.08 }}
        className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
      >
        The PMS your <br className="hidden sm:block" />
        <span className="text-gradient">front desk deserves.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.14 }}
        className="mt-6 max-w-lg text-base leading-relaxed text-plum sm:text-lg"
      >
        Check-in guests in 30 seconds. Track housekeeping in real-time. Give owners live
        visibility. Works offline. Made for India.
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Link
          href="/onboarding"
          className="group inline-flex items-center gap-2 rounded-xl bg-teal px-7 py-3.5 text-sm font-semibold text-ink shadow-glow transition-all duration-200 hover:bg-chalk hover:shadow-raised active:scale-[0.98]"
        >
          Set up your property free
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-chalk transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.06] active:scale-[0.98]"
        >
          Sign in to your account
        </Link>
      </motion.div>

      <motion.p
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.32 }}
        className="mt-8 text-xs text-plum"
      >
        No credit card · No setup fee · Free for properties under 10 rooms
      </motion.p>

      <motion.div
        variants={landingPreview}
        initial="hidden"
        animate="visible"
        className="relative mt-16 w-full max-w-4xl"
      >
        <div className="liquid-glass relative overflow-hidden rounded-2xl shadow-raised">
          <div className="flex h-9 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4">
            <div className="size-2.5 rounded-full bg-destructive/50" />
            <div className="size-2.5 rounded-full bg-[#C9A84C]/50" />
            <div className="size-2.5 rounded-full bg-teal/50" />
            <div className="mx-auto flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-0.5">
              <div className="size-2.5 rounded-full bg-teal/40" />
              <span className="text-[10px] text-plum">soylpms.app/dashboard</span>
            </div>
          </div>
          <div className="pointer-events-none overflow-hidden p-6" style={{ maxHeight: 460 }}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Occupancy", val: "78%", hue: "from-teal/20 to-transparent" },
                { label: "Today revenue", val: "₹42.5k", hue: "from-plum/30 to-transparent" },
                { label: "Rooms dirty", val: "3", hue: "from-[#C9A84C]/25 to-transparent" },
              ].map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    "rounded-xl border border-white/[0.07] bg-gradient-to-br p-4",
                    c.hue,
                  )}
                >
                  <p className="text-xs text-plum">{c.label}</p>
                  <p className="mt-2 text-2xl font-bold text-chalk">{c.val}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
                >
                  <div className="mb-3 h-2 w-24 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-white/10" />
                    <div className="h-2 w-[85%] rounded-full bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="border-t border-white/[0.04] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Everything you need
          </p>
          <h2 className="text-4xl font-semibold tracking-tight">
            Built for how hotels actually work
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="glass-hover liquid-glass flex flex-col gap-4 rounded-2xl p-6"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  featureIconWrap(f.accent),
                )}
              >
                <f.icon className="size-5" />
              </div>
              <div>
                <h3 className="mb-1.5 text-sm font-semibold text-chalk">{f.title}</h3>
                <p className="text-xs leading-relaxed text-plum">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-white/[0.04] px-6 py-24"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Simple by design
          </p>
          <h2 className="text-4xl font-semibold tracking-tight">Up and running in minutes</h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-9 hidden h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent md:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="relative flex size-[52px] items-center justify-center rounded-full liquid-glass ring-1 ring-teal/20">
                <span className="text-sm font-semibold text-teal">{step.n}</span>
              </div>
              <div>
                <h3 className="mb-1.5 text-sm font-semibold text-chalk">{step.title}</h3>
                <p className="text-xs leading-relaxed text-plum">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="border-t border-white/[0.04] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center text-4xl font-semibold tracking-tight"
        >
          Trusted by property owners
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="glass-hover liquid-glass flex flex-col gap-5 rounded-2xl p-6"
            >
              <Quote className="size-8 text-teal/60" aria-hidden />
              <p className="flex-1 text-sm italic leading-relaxed text-chalk/80">{t.quote}</p>
              <div className="mt-auto">
                <p className="text-sm font-semibold text-chalk">{t.name}</p>
                <p className="mt-0.5 text-xs text-plum">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="liquid-glass rounded-3xl p-10 ring-1 ring-teal/15 shadow-glow sm:p-14"
        >
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to modernise your property?
          </h2>
          <p className="mb-8 text-base leading-relaxed text-plum">
            Join independent hotels across India. Set up in minutes. No technical skills
            required.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="group inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-4 text-sm font-semibold text-ink shadow-glow transition-all hover:bg-chalk hover:shadow-raised active:scale-[0.98]"
            >
              Get started for free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-plum">
            {["No credit card", "Free under 10 rooms", "Works offline", "GST invoicing"].map(
              (f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-teal" /> {f}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.05] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="SOYL"
            width={24}
            height={24}
            className="size-6 rounded-full opacity-70"
          />
          <span className="text-sm text-plum">
            © {new Date().getFullYear()} SOYL AI · Story of your life.
          </span>
        </div>
        <div className="flex gap-5 text-sm text-plum">
          {["Privacy", "Terms", "Contact"].map((label) => (
            <a key={label} href="#" className="transition-colors hover:text-chalk">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
