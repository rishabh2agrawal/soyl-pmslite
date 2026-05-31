# soyl-pmslite — Professional UI Redesign Prompt (v2)
## Brand-aligned · Glassmorphism · Responsive · Production-grade

> Paste this entire document into Claude (or your AI coding assistant) with the repository open.
> Implement section by section in order. Do not change any business logic, TypeScript types,
> routing structure, or mock data — only visual presentation, layout, and new pages.

---

## 0 — Brand Identity Reference

The SOYL AI brand guidelines define these exact values. **Every colour used in this product
must come from this palette. No substitutions.**

| Token name | Hex | Usage |
|---|---|---|
| `--soyl-ink` | `#030709` | Primary background, deepest surfaces |
| `--soyl-white` | `#F8FCFD` | Primary text, bright surfaces, card highlights |
| `--soyl-teal` | `#AFD0CC` | Accent, active states, CTAs, glows |
| `--soyl-plum` | `#635467` | Secondary text, muted UI, borders |
| `--soyl-surface` | `#0D1419` | Card backgrounds (slightly lifted from ink) |
| `--soyl-glass` | `rgba(175,208,204,0.06)` | Glassmorphism fills |
| `--soyl-glass-border` | `rgba(248,252,253,0.08)` | Glassmorphism borders |

Logo: the circular SOYL AI mark (the uploaded `soyl_-logo.ico` / PNG file). It is a dark circle
with organic white/grey flowing shapes and radial lines. **Never recolour, distort, add shadows,
or rotate it.**

Typography: the brand uses clean geometric sans-serif type. Use **Inter** (Google Fonts) as the
primary typeface — it matches the logo wordmark's geometry and reads clearly at all sizes on dark
backgrounds.

---

## 1 — Project Setup

### 1.1 Favicon & App Icon

Copy the uploaded logo file (`soyl_-logo.ico`, which is actually a 1772×1772 RGBA PNG) into your
project as the favicon and app icon.

In `frontend/public/`:
- Copy the file as `favicon.ico` (Next.js will serve it automatically)
- Also copy as `icon.png` for the App Router metadata API

In `src/app/layout.tsx`, add/update the metadata export:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "soylPMS — Property Management System",
  description: "Modern hotel PMS for Indian hospitality. Check-ins in 30 seconds.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};
```

Also update `src/app/[locale]/layout.tsx` and the root `src/app/layout.tsx` to remove any
existing font imports and switch to Inter:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Apply to <html>: className={inter.variable}
```

### 1.2 Remove old colour references

Search the entire `src/` directory for these strings and confirm they are eliminated after your
changes:
`#B85518`, `#1F5C3F`, `#C9971F`, `#F5F4F0`, `soyl-primary`, `soyl-secondary`, `soyl-accent`,
`soyl-bg`, `soyl-text`, `soyl-muted`, `soyl-border`, `soyl-danger`, `soyl-surface`.

---

## 2 — Design System

### 2.1 `src/app/globals.css` — full replacement

Replace the entire file with the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Brand palette ─────────────────────────────── */
    --soyl-ink:     #030709;
    --soyl-white:   #F8FCFD;
    --soyl-teal:    #AFD0CC;
    --soyl-plum:    #635467;

    /* ── Derived surfaces ──────────────────────────── */
    --soyl-surface:       #0D1419;
    --soyl-surface-2:     #111D22;
    --soyl-surface-3:     #162028;
    --soyl-border:        rgba(248,252,253,0.08);
    --soyl-border-strong: rgba(248,252,253,0.14);
    --soyl-teal-dim:      rgba(175,208,204,0.12);
    --soyl-teal-glow:     rgba(175,208,204,0.18);
    --soyl-plum-dim:      rgba(99,84,103,0.20);

    /* ── Glassmorphism ─────────────────────────────── */
    --glass-fill:         rgba(175,208,204,0.05);
    --glass-fill-hover:   rgba(175,208,204,0.09);
    --glass-border:       rgba(248,252,253,0.08);
    --glass-border-hover: rgba(248,252,253,0.14);
    --glass-blur:         blur(20px);
    --glass-blur-heavy:   blur(32px);

    /* ── shadcn/ui token mapping ───────────────────── */
    --background:         5 44% 4%;
    --foreground:         195 43% 98%;
    --card:               197 34% 8%;
    --card-foreground:    195 43% 98%;
    --popover:            197 34% 8%;
    --popover-foreground: 195 43% 98%;
    --primary:            174 18% 75%;
    --primary-foreground: 5 44% 4%;
    --secondary:          290 10% 37%;
    --secondary-foreground: 195 43% 98%;
    --muted:              197 20% 12%;
    --muted-foreground:   200 10% 50%;
    --accent:             174 18% 75%;
    --accent-foreground:  5 44% 4%;
    --destructive:        0 60% 55%;
    --destructive-foreground: 0 0% 100%;
    --border:             197 20% 12%;
    --input:              197 20% 12%;
    --ring:               174 18% 75%;
    --radius:             0.75rem;

    /* ── Status colours ────────────────────────────── */
    --s-confirmed-bg:    rgba(175,208,204,0.12);
    --s-confirmed-fg:    #AFD0CC;
    --s-checkedin-bg:    rgba(175,208,204,0.22);
    --s-checkedin-fg:    #D4EBE8;
    --s-checkout-bg:     rgba(99,84,103,0.18);
    --s-checkout-fg:     #9B8FA0;
    --s-cancelled-bg:    rgba(200,60,60,0.14);
    --s-cancelled-fg:    #E07070;
    --s-noshow-bg:       rgba(180,140,60,0.14);
    --s-noshow-fg:       #C9A84C;

    --r-available-bg:    rgba(175,208,204,0.14);
    --r-available-fg:    #AFD0CC;
    --r-occupied-bg:     rgba(99,84,103,0.20);
    --r-occupied-fg:     #A899AD;
    --r-dirty-bg:        rgba(180,140,60,0.14);
    --r-dirty-fg:        #C9A84C;
    --r-cleaning-bg:     rgba(100,160,220,0.14);
    --r-cleaning-fg:     #80B8E0;
    --r-maintenance-bg:  rgba(200,60,60,0.14);
    --r-maintenance-fg:  #E07070;
    --r-blocked-bg:      rgba(99,84,103,0.14);
    --r-blocked-fg:      #7A6B7F;
    --r-inspected-bg:    rgba(175,208,204,0.10);
    --r-inspected-fg:    #8FB8B4;

    /* ── Shadows ───────────────────────────────────── */
    --shadow-card:    0 4px 24px rgba(3,7,9,0.50);
    --shadow-raised:  0 8px 40px rgba(3,7,9,0.65);
    --shadow-glow:    0 0 28px rgba(175,208,204,0.20);
    --shadow-glow-sm: 0 0 14px rgba(175,208,204,0.16);
  }

  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }

  body {
    background-color: var(--soyl-ink);
    color: var(--soyl-white);
    font-family: var(--font-sans), Inter, system-ui, sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100dvh;
    /* Subtle ambient light — single teal gradient, very restrained */
    background-image:
      radial-gradient(ellipse 70% 40% at 50% 0%, rgba(175,208,204,0.07) 0%, transparent 70%);
    background-attachment: fixed;
  }

  h1, h2, h3, h4 {
    letter-spacing: -0.02em;
    color: var(--soyl-white);
  }

  ::selection {
    background: rgba(175,208,204,0.22);
    color: var(--soyl-white);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(175,208,204,0.18); border-radius: 2px; }
}

@layer utilities {
  /* ── Glassmorphism ───────────────────── */
  .glass {
    background: var(--glass-fill);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
  }

  .glass-heavy {
    background: rgba(175,208,204,0.04);
    backdrop-filter: var(--glass-blur-heavy);
    -webkit-backdrop-filter: var(--glass-blur-heavy);
    border: 1px solid var(--glass-border);
  }

  .glass-hover {
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .glass-hover:hover {
    background: var(--glass-fill-hover);
    border-color: var(--glass-border-hover);
    box-shadow: var(--shadow-glow-sm);
  }

  /* Liquid glass — for cards and modal surfaces */
  .liquid-glass {
    background:
      linear-gradient(
        135deg,
        rgba(248,252,253,0.05) 0%,
        rgba(175,208,204,0.04) 50%,
        rgba(99,84,103,0.03) 100%
      );
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border: 1px solid rgba(248,252,253,0.07);
    box-shadow:
      inset 0 1px 0 rgba(248,252,253,0.06),
      0 4px 24px rgba(3,7,9,0.45);
  }
  .liquid-glass:hover {
    border-color: rgba(175,208,204,0.15);
    box-shadow:
      inset 0 1px 0 rgba(248,252,253,0.08),
      0 8px 32px rgba(3,7,9,0.55),
      0 0 20px rgba(175,208,204,0.08);
  }

  /* ── Glow utilities ──────────────────── */
  .glow-teal  { box-shadow: var(--shadow-glow); }
  .glow-sm    { box-shadow: var(--shadow-glow-sm); }
  .text-glow  { text-shadow: 0 0 20px rgba(175,208,204,0.35); }

  /* ── Teal gradient text ──────────────── */
  .text-gradient {
    background: linear-gradient(135deg, var(--soyl-white) 0%, var(--soyl-teal) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Animations ──────────────────────── */
  .animate-float {
    animation: float 7s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  .animate-glow-pulse {
    animation: glow-pulse 3s ease-in-out infinite;
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }

  .animate-shimmer {
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
}
```

### 2.2 `tailwind.config.ts` — full replacement

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card:        { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover:     { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:     { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:   { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:       { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:      { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:  "hsl(var(--border))",
        input:   "hsl(var(--input))",
        ring:    "hsl(var(--ring))",
        /* ── Brand palette ── */
        ink:   "#030709",
        chalk: "#F8FCFD",
        teal:  { DEFAULT: "#AFD0CC", dim: "rgba(175,208,204,0.12)", glow: "rgba(175,208,204,0.20)" },
        plum:  { DEFAULT: "#635467", dim: "rgba(99,84,103,0.18)" },
        surface: {
          1: "#0D1419",
          2: "#111D22",
          3: "#162028",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        xs:   ["0.75rem", { lineHeight: "1.1rem" }],
        sm:   ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem",    { lineHeight: "1.6rem" }],
        lg:   ["1.125rem",{ lineHeight: "1.75rem" }],
        xl:   ["1.25rem", { lineHeight: "1.8rem" }],
        "2xl":["1.5rem",  { lineHeight: "2rem" }],
        "3xl":["2rem",    { lineHeight: "2.25rem" }],
        "4xl":["2.5rem",  { lineHeight: "1.1" }],
        "5xl":["3.25rem", { lineHeight: "1.05" }],
      },
      borderRadius: {
        sm:  "0.375rem",
        md:  "0.625rem",
        lg:  "0.75rem",
        xl:  "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      spacing: {
        touch: "48px",
      },
      boxShadow: {
        card:    "var(--shadow-card)",
        raised:  "var(--shadow-raised)",
        glow:    "var(--shadow-glow)",
        "glow-sm": "var(--shadow-glow-sm)",
        glass:   "inset 0 1px 0 rgba(248,252,253,0.06), 0 4px 24px rgba(3,7,9,0.45)",
      },
      backgroundImage: {
        "teal-glow": "radial-gradient(ellipse at center, rgba(175,208,204,0.15) 0%, transparent 70%)",
        "liquid":
          "linear-gradient(135deg, rgba(248,252,253,0.05) 0%, rgba(175,208,204,0.04) 50%, rgba(99,84,103,0.03) 100%)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 3 — Motion Library

Create `src/lib/motion.ts`:

```ts
import type { Variants } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease } },
};

export const slideRight: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease } },
};

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
};
```

**Usage on every page:**
```tsx
<motion.div variants={fadeUp} initial="hidden" animate="visible">
  ...
</motion.div>
```

**Usage on lists:**
```tsx
<motion.ul variants={stagger} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={staggerItem}>
      ...
    </motion.li>
  ))}
</motion.ul>
```

---

## 4 — Shared Components

### 4.1 Top Bar (`src/components/layouts/top-bar.tsx`)

The top bar is a liquid glass strip pinned to the top of the viewport.

```tsx
<header className="fixed inset-x-0 top-0 z-40 h-14 glass-heavy safe-area-pt">
  <div className="flex h-full items-center justify-between px-4">
    {/* Left: logo mark + property name */}
    <div className="flex items-center gap-2.5">
      <img src="/icon.png" alt="SOYL" className="size-7 rounded-full" />
      <span className="text-sm font-semibold text-chalk">{title}</span>
    </div>
    {/* Right: actions */}
    <div className="flex items-center gap-1.5">
      {rightAction}
      {showNotifications && (
        <Link href="/app/notifications"
          className="flex size-9 items-center justify-center rounded-xl text-plum hover:text-chalk hover:bg-white/[0.05] transition-all">
          <Bell className="size-4" />
        </Link>
      )}
      {showSettings && (
        <Link href="/app/settings"
          className="flex size-9 items-center justify-center rounded-xl text-plum hover:text-chalk hover:bg-white/[0.05] transition-all">
          <Settings className="size-4" />
        </Link>
      )}
    </div>
  </div>
</header>
```

### 4.2 Bottom Nav (`src/components/layouts/bottom-nav.tsx`)

```tsx
<nav className="fixed inset-x-0 bottom-0 z-40 glass-heavy safe-area-pb border-t-0">
  <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
    {items.map((item) => {
      const isActive = /* existing active logic */;
      return (
        <Link key={item.href} href={item.href}
          className={cn(
            "relative flex flex-col items-center gap-0.5 min-w-[3rem] px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200",
            isActive
              ? "text-teal bg-teal/10"
              : "text-plum hover:text-chalk hover:bg-white/[0.04]"
          )}>
          {/* Active: icon gets a subtle teal glow */}
          <item.icon className={cn(
            "size-[18px] transition-all",
            isActive && "drop-shadow-[0_0_6px_rgba(175,208,204,0.55)]"
          )} />
          <span className="leading-tight">{item.label}</span>
          {/* Active indicator dot */}
          {isActive && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-teal" />
          )}
          {/* Badge */}
          {item.badge != null && item.badge > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </Link>
      );
    })}
  </div>
</nav>
```

### 4.3 Status Badge (`src/components/shared/status-badge.tsx`)

Replace the colour maps entirely so every status is visually distinct:

```tsx
const bookingVariants: Record<BookingStatus, { bg: string; text: string; ring?: string }> = {
  confirmed:   { bg: "bg-[var(--s-confirmed-bg)]", text: "text-[var(--s-confirmed-fg)]" },
  checked_in:  { bg: "bg-[var(--s-checkedin-bg)]",  text: "text-[var(--s-checkedin-fg)]",
                 ring: "ring-1 ring-teal/30" },  /* extra ring — visually distinct from confirmed */
  checked_out: { bg: "bg-[var(--s-checkout-bg)]",   text: "text-[var(--s-checkout-fg)]" },
  cancelled:   { bg: "bg-[var(--s-cancelled-bg)]",  text: "text-[var(--s-cancelled-fg)]" },
  no_show:     { bg: "bg-[var(--s-noshow-bg)]",     text: "text-[var(--s-noshow-fg)]" },
};

const roomVariants: Record<RoomStatus, { bg: string; text: string }> = {
  available:   { bg: "bg-[var(--r-available-bg)]",   text: "text-[var(--r-available-fg)]" },
  occupied:    { bg: "bg-[var(--r-occupied-bg)]",    text: "text-[var(--r-occupied-fg)]" },
  dirty:       { bg: "bg-[var(--r-dirty-bg)]",       text: "text-[var(--r-dirty-fg)]" },
  cleaning:    { bg: "bg-[var(--r-cleaning-bg)]",    text: "text-[var(--r-cleaning-fg)]" },
  maintenance: { bg: "bg-[var(--r-maintenance-bg)]", text: "text-[var(--r-maintenance-fg)]" },
  blocked:     { bg: "bg-[var(--r-blocked-bg)]",     text: "text-[var(--r-blocked-fg)]" },
  inspected:   { bg: "bg-[var(--r-inspected-bg)]",   text: "text-[var(--r-inspected-fg)]" },
};
```

Badge element:
```tsx
<span className={cn(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
  "border border-current/15",  /* very subtle border matching text colour */
  colors.bg, colors.text, colors.ring, className
)}>
  {formatLabel(status)}
</span>
```

### 4.4 Metric Card (`src/components/shared/metric-card.tsx`)

```tsx
<div className={cn("liquid-glass glass-hover rounded-2xl p-4 transition-all", className)}>
  <div className="flex items-start justify-between gap-3">
    <div className="flex flex-1 flex-col">
      <span className="text-3xl font-semibold tracking-tight text-chalk leading-none">
        {value}
      </span>
      <span className="mt-1.5 text-xs text-plum">{label}</span>
      {trend && (
        <div className={cn(
          "mt-2 flex items-center gap-1 text-xs font-medium",
          trend.direction === "up"      && "text-teal",
          trend.direction === "down"    && "text-destructive",
          trend.direction === "neutral" && "text-plum",
        )}>
          {/* TrendingUp / TrendingDown / Minus icon */}
          <TrendIcon className="size-3" />
          <span>{trend.delta}</span>
        </div>
      )}
    </div>
    <div className={cn(
      "flex size-10 items-center justify-center rounded-xl",
      variant === "success" && "bg-teal/12 text-teal",
      variant === "warning" && "bg-[rgba(180,140,60,0.14)] text-[#C9A84C]",
      variant === "danger"  && "bg-destructive/12 text-destructive",
      variant === "default" && "bg-plum/20 text-chalk/70",
    )}>
      {icon}
    </div>
  </div>
</div>
```

### 4.5 List Row (`src/components/shared/list-row.tsx`)

```tsx
<div className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2.5
                glass-hover cursor-pointer transition-all">
  {/* Avatar: use teal tint */}
  <div className="flex size-9 shrink-0 items-center justify-center rounded-full
                  bg-teal/10 ring-1 ring-teal/20 text-xs font-semibold text-teal">
    {avatar}
  </div>
  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
    {/* Guest name — prominent */}
    <span className="truncate text-sm font-semibold text-chalk leading-tight">
      {title}
    </span>
    {/* Room / date — muted */}
    <span className="truncate text-xs text-plum leading-tight">
      {subtitle}
    </span>
  </div>
  <div className="shrink-0">{right}</div>
</div>
```

### 4.6 Page Header (`src/components/shared/page-header.tsx`)

```tsx
<div className="flex items-center justify-between py-4">
  <div className="flex items-center gap-3">
    {showBack && (
      <button onClick={onBack}
        className="flex size-9 items-center justify-center rounded-xl glass glass-hover text-plum hover:text-chalk transition-all">
        <ChevronLeft className="size-4.5" />
      </button>
    )}
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-chalk">{title}</h1>
      {subtitle && <p className="text-xs text-plum mt-0.5">{subtitle}</p>}
    </div>
  </div>
  {action}
</div>
```

### 4.7 Filter Chips (`src/components/shared/filter-chips.tsx`)

```tsx
/* active chip */
"border border-teal/40 bg-teal/10 text-teal"

/* inactive chip */
"border border-white/[0.07] bg-transparent text-plum hover:border-white/[0.12] hover:text-chalk transition-all"
```

### 4.8 Sticky CTA (`src/components/shared/sticky-cta.tsx`)

Container — liquid glass bar fixed to bottom:
```tsx
<div className="fixed inset-x-0 bottom-0 z-30 glass-heavy border-t border-white/[0.06] px-4 py-3 safe-area-pb">
```

Primary button:
```tsx
<button className="
  h-12 w-full rounded-xl
  bg-teal text-ink font-semibold text-sm
  hover:bg-chalk hover:text-ink
  active:scale-[0.98]
  shadow-glow transition-all duration-200
  disabled:opacity-40 disabled:cursor-not-allowed
">
  {loading ? <Spinner /> : primaryLabel}
</button>
```

Note: the CTA uses `bg-teal` (brand teal `#AFD0CC`) with dark text — clean, brand-aligned, not gradient-heavy.

---

## 5 — App Shell Layouts

### 5.1 Responsive sidebar shell

Both Manager and Owner layouts need a responsive sidebar for desktop (`lg+`) and the existing bottom nav for mobile. Implement this pattern in **both** `app/manager/layout.tsx` and `app/owner/layout.tsx`:

```tsx
"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/* SidebarLink — sub-component */
function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link href={item.href} className={cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-teal/10 text-teal border border-teal/20"
        : "text-plum hover:text-chalk hover:bg-white/[0.04] border border-transparent"
    )}>
      <item.icon className={cn("size-4 transition-all", isActive && "drop-shadow-[0_0_5px_rgba(175,208,204,0.5)]")} />
      <span>{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full
                         bg-destructive/80 px-1.5 text-[10px] font-semibold text-white">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
}

/* Layout */
export default function ManagerLayout({ children }) {
  return (
    <div className="flex min-h-dvh">

      {/* ── Desktop sidebar ─────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 z-40
                         glass-heavy border-r border-white/[0.06]">
        {/* Brand header */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
          <Image src="/icon.png" alt="SOYL" width={32} height={32} className="rounded-full" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-chalk">{propertyName}</p>
            <p className="text-2xs text-plum uppercase tracking-widest">Manager</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {items.map((item) => (
            <SidebarLink key={item.href} item={item} isActive={/* active logic */} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
          <SidebarLink item={{ href: "/app/settings", icon: Settings, label: "Settings" }} isActive={false} />
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────── */}
      <div className="lg:hidden">
        <TopBar
          title={propertyName || "Property"}
          rightAction={<RoleBadge role="manager" />}
        />
      </div>

      {/* ── Main content ─────────────────────── */}
      <main className="flex-1 lg:pl-56 min-h-dvh">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 lg:pt-8 lg:pb-10">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav ────────────────── */}
      <div className="lg:hidden">
        <BottomNav items={items} mode="manager" />
      </div>

      {/* ── FAB (mobile only) ────────────────── */}
      <Link href="/app/manager/bookings/new"
        className="lg:hidden fixed bottom-20 right-4 z-50
                   flex size-14 items-center justify-center rounded-full
                   bg-teal text-ink shadow-glow hover:bg-chalk
                   active:scale-95 transition-all">
        <Plus className="size-6" />
      </Link>
    </div>
  );
}
```

Create a small `RoleBadge` component:
```tsx
function RoleBadge({ role }: { role: "owner" | "manager" }) {
  return (
    <span className="rounded-full border border-teal/25 bg-teal/10 px-2.5 py-1 text-2xs font-medium text-teal uppercase tracking-wide">
      {role}
    </span>
  );
}
```

### 5.2 Desktop dashboard grid

On `lg+` screens, split both dashboards into 2 columns. Wrap each dashboard's content:

```tsx
<div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-5 space-y-4 lg:space-y-0">
  <div className="space-y-4">
    {/* Column 1: KPI metrics + attention banner */}
  </div>
  <div className="space-y-4">
    {/* Column 2: Arrivals + Departures + In-house */}
  </div>
</div>
```

---

## 6 — Page Redesigns

### 6.1 All pages — standard card pattern

Every card surface in the app should use the `.liquid-glass` class instead of plain white cards.
Replace all instances of:
- `bg-white/80`, `bg-white`, `bg-soyl-*` → `liquid-glass`
- `border-soyl-border*` → `border-white/[0.07]`
- `shadow-soft`, `shadow-card` → `shadow-card` (the new CSS variable)

Standard card:
```tsx
<div className="liquid-glass rounded-2xl p-4">
  {/* content */}
</div>
```

### 6.2 Manager Dashboard (`app/manager/page.tsx`)

The room availability card becomes a hero strip with an inline occupancy bar:

```tsx
{/* Hero strip */}
<div className="liquid-glass rounded-2xl p-5">
  <div className="flex items-center justify-between mb-3">
    <div>
      <p className="text-3xl font-semibold text-chalk leading-none">{availableRooms.length}</p>
      <p className="text-xs text-plum mt-1">rooms available of {ROOMS.length}</p>
    </div>
    <div className="flex size-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
      <BedDouble className="size-5" />
    </div>
  </div>
  {/* Occupancy bar */}
  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06] gap-0.5">
    {ROOMS.map((room) => (
      <div key={room.id} className={cn(
        "h-full flex-1 rounded-full",
        room.status === "occupied"    && "bg-plum",
        room.status === "available"   && "bg-teal",
        room.status === "dirty"       && "bg-[#C9A84C]",
        room.status === "maintenance" && "bg-destructive/60",
        room.status === "blocked"     && "bg-white/20",
        room.status === "cleaning"    && "bg-[#80B8E0]",
        room.status === "inspected"   && "bg-teal/50",
      )} />
    ))}
  </div>
</div>
```

All other section headers (Arrivals, Departures, etc.) should use a teal left-bar accent:
```tsx
<div className="flex items-center gap-2.5 mb-2">
  <div className="h-4 w-0.5 rounded-full bg-teal" />
  <LogIn className="size-3.5 text-teal" />
  <h3 className="text-sm font-semibold text-chalk">Arrivals</h3>
  <span className="ml-auto text-xs text-plum font-medium">{arrivals.length}</span>
</div>
```

### 6.3 Owner Dashboard (`app/owner/page.tsx`)

- Greeting: `text-3xl font-semibold text-gradient` (uses the CSS utility from globals — white → teal gradient).
- Metrics grid items: use `motion.div variants={staggerItem}` on each card so they entrance-animate with a 60ms stagger.
- Attention banner — liquid glass with a warm amber left border:
  ```tsx
  <div className="liquid-glass rounded-2xl border-l-2 border-l-[#C9A84C] p-4
                  hover:shadow-[0_0_20px_rgba(201,168,76,0.12)] transition-all">
  ```

### 6.4 Bookings List (`app/manager/bookings/page.tsx`)

- Search input: `liquid-glass rounded-xl border-white/[0.07] focus-within:border-teal/40 focus-within:shadow-glow-sm transition-all`
- Each booking card: add a coloured left border strip by status:
  ```tsx
  const statusBorder = {
    confirmed:   "border-l-[var(--s-confirmed-fg)]",
    checked_in:  "border-l-teal",
    checked_out: "border-l-plum/50",
    cancelled:   "border-l-destructive/60",
    no_show:     "border-l-[#C9A84C]/60",
  };
  // className: `liquid-glass rounded-xl border-l-2 ${statusBorder[booking.status]}`
  ```

### 6.5 Calendar (`app/manager/calendar/page.tsx`)

```ts
const statusColors: Record<BookingStatus, string> = {
  confirmed:   "bg-teal/70",
  checked_in:  "bg-teal",
  checked_out: "bg-plum/60",
  cancelled:   "bg-destructive/60",
  no_show:     "bg-[#C9A84C]/70",
};
```

Grid container: `liquid-glass rounded-2xl overflow-hidden border-0`
Header cells: `bg-white/[0.03] text-plum`
Room label cells: `bg-surface-1 text-chalk font-medium`
Cell dividers: `border-white/[0.04]`

### 6.6 Housekeeping (`app/manager/housekeeping/page.tsx`)

Left border colours:
```ts
const cardBorder: Record<RoomStatus, string> = {
  available:   "border-l-teal",
  occupied:    "border-l-plum",
  dirty:       "border-l-[#C9A84C]",
  cleaning:    "border-l-[#80B8E0]",
  maintenance: "border-l-destructive",
  blocked:     "border-l-white/20",
  inspected:   "border-l-teal/50",
};
```

Room card base: `liquid-glass rounded-xl border-l-2 p-3`

Action button — colour shifts with the next state, NOT one burnt-orange for everything:
```ts
const actionStyle: Record<string, string> = {
  cleaning:  "border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/18",
  inspected: "border border-[#80B8E0]/30 bg-[#80B8E0]/10 text-[#80B8E0] hover:bg-[#80B8E0]/18",
  available: "border border-teal/35 bg-teal/10 text-teal hover:bg-teal/18",
};
// Use as: <button className={`text-xs rounded-lg px-2 py-1.5 flex-1 font-medium transition-all ${actionStyle[action.next]}`}>
```

### 6.7 New Booking Form (`app/manager/bookings/new/page.tsx`)

Group the 8 sections into 3 labelled phases:

```tsx
{/* Phase header */}
function FormPhase({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-2 mb-3">
      <div className="flex size-6 items-center justify-center rounded-full
                      bg-teal/10 ring-1 ring-teal/25 text-2xs font-bold text-teal">
        {number}
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-plum">
        {title}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}
```

```
Phase 1 "Stay"      → Dates card + Room card
Phase 2 "Guest"     → Guest name + Phone + ID Proof + Occupancy cards
Phase 3 "Payment"   → Rate + Source + Advance + Invoice type cards
```

Booking source pills — selected:
```
border border-teal/40 bg-teal/12 text-teal font-semibold
```
Unselected:
```
border border-white/[0.07] bg-white/[0.02] text-plum hover:text-chalk hover:border-white/[0.12]
```

Invoice type toggle — selected:
```
border border-teal/40 bg-teal/10 text-teal
```

All `<Card>` wrappers → `liquid-glass rounded-2xl border-0`
All `<Input>` fields → `bg-white/[0.04] border-white/[0.08] focus:border-teal/40 focus:ring-1 focus:ring-teal/20 text-chalk placeholder:text-plum/60`
All `<Label>` → `text-xs text-plum font-medium uppercase tracking-wide`

---

## 7 — New Pages

### 7.1 Landing Page — `src/app/[locale]/page.tsx`

**Replace the existing redirect with a full marketing page.**
This page does NOT use the app layout — it has its own `<nav>` and `<footer>`.

```tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BedDouble, BarChart3, CalendarDays,
  MessageSquare, Globe, Zap, CheckCircle2,
} from "lucide-react";
import { fadeUp, fadeIn, stagger, staggerItem, ease } from "@/lib/motion";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-ink text-chalk overflow-x-hidden">
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
```

#### NavBar component:

```tsx
function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 glass-heavy border-b border-white/[0.05]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/icon.png" alt="SOYL" width={32} height={32}
            className="rounded-full transition-all group-hover:shadow-glow" />
          <div className="leading-none">
            <span className="text-base font-semibold text-chalk">soyl</span>
            <span className="text-base font-semibold text-teal">PMS</span>
          </div>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {["Features", "How it works", "Pricing"].map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`}
              className="text-sm text-plum hover:text-chalk transition-colors">
              {label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link href="/en/login"
            className="hidden sm:block text-sm font-medium text-plum hover:text-chalk transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.04]">
            Sign in
          </Link>
          <Link href="/en/onboarding"
            className="flex items-center gap-1.5 rounded-xl border border-teal/30 bg-teal/10 px-4 py-2.5 text-sm font-semibold text-teal hover:bg-teal/18 hover:border-teal/50 hover:shadow-glow-sm transition-all">
            Get started
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
```

#### Hero Section:

```tsx
function HeroSection() {
  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center
                        text-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Background: single restrained teal glow centered top */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2
                         h-[500px] w-[700px] rounded-full
                         bg-teal/[0.06] blur-[100px]" />
      </div>

      {/* Pill badge */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="mb-7 inline-flex items-center gap-2 rounded-full
                   border border-teal/20 bg-teal/[0.07] px-4 py-1.5">
        <span className="size-1.5 rounded-full bg-teal animate-pulse" />
        <span className="text-xs font-medium text-teal tracking-wide">
          Purpose-built for Indian hospitality
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.08 }}
        className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight">
        The PMS your{" "}
        <br className="hidden sm:block" />
        <span className="text-gradient">front desk deserves.</span>
      </motion.h1>

      {/* Subline */}
      <motion.p
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.14 }}
        className="mt-6 max-w-lg text-base sm:text-lg text-plum leading-relaxed">
        Check-in guests in 30 seconds. Track housekeeping in real-time.
        Give owners live visibility. Works offline. Made for India.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.20 }}
        className="mt-9 flex flex-col sm:flex-row items-center gap-3">

        <Link href="/en/onboarding"
          className="group flex items-center gap-2 rounded-xl
                     bg-teal text-ink font-semibold text-sm px-7 py-3.5
                     hover:bg-chalk shadow-glow hover:shadow-raised
                     active:scale-[0.98] transition-all duration-200">
          Set up your property free
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link href="/en/login"
          className="flex items-center gap-2 rounded-xl
                     border border-white/[0.10] bg-white/[0.03] text-chalk
                     font-medium text-sm px-7 py-3.5
                     hover:bg-white/[0.06] hover:border-white/[0.16]
                     active:scale-[0.98] transition-all duration-200">
          Sign in to your account
        </Link>
      </motion.div>

      {/* Trust line */}
      <motion.p variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.32 }}
        className="mt-8 text-xs text-plum">
        No credit card · No setup fee · Free for properties under 10 rooms
      </motion.p>

      {/* App preview — liquid glass frame */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease }}
        className="relative mt-16 w-full max-w-4xl">

        {/* Browser chrome */}
        <div className="liquid-glass rounded-2xl overflow-hidden shadow-raised">
          <div className="flex h-9 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4">
            <div className="size-2.5 rounded-full bg-destructive/50" />
            <div className="size-2.5 rounded-full bg-[#C9A84C]/50" />
            <div className="size-2.5 rounded-full bg-teal/50" />
            <div className="mx-auto flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-0.5">
              <div className="size-2.5 rounded-full bg-teal/40" />
              <span className="text-[10px] text-plum">soylpms.app/dashboard</span>
            </div>
          </div>
          {/* Render the actual dashboard UI as a non-interactive preview */}
          <div className="pointer-events-none overflow-hidden" style={{ maxHeight: 460 }}>
            {/*
              Import OwnerPulsePage or ManagerTodayPage here and render it.
              This creates a live "product screenshot" inside the landing page.
              Alternatively, use a static screenshot image of the redesigned dashboard.
            */}
          </div>
          {/* Fade out the bottom */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
```

#### Features Section:

```tsx
const FEATURES = [
  { icon: Zap,          title: "30-second check-in",   desc: "Walk-in to room assigned in under 30 seconds. Built for speed.", accent: "teal" },
  { icon: BedDouble,    title: "Live room grid",        desc: "Colour-coded housekeeping status across every floor, updated in real-time.", accent: "teal" },
  { icon: BarChart3,    title: "Owner dashboard",       desc: "Occupancy, daily revenue, and trends. No spreadsheets required.", accent: "plum" },
  { icon: CalendarDays, title: "Availability calendar", desc: "Gantt-style view across all rooms. Click any gap to create a booking.", accent: "teal" },
  { icon: MessageSquare,title: "Guest requests",        desc: "Housekeeping, maintenance, and F&B requests tracked end-to-end.", accent: "plum" },
  { icon: Globe,        title: "Works offline",         desc: "Critical operations continue without internet. Syncs automatically.", accent: "teal" },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal mb-3">
            Everything you need
          </p>
          <h2 className="text-4xl font-semibold tracking-tight">
            Built for how hotels actually work
          </h2>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={staggerItem}
              className="liquid-glass glass-hover rounded-2xl p-6 flex flex-col gap-4">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                f.accent === "teal" ? "bg-teal/10 text-teal" : "bg-plum/20 text-chalk/70"
              )}>
                <f.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-chalk mb-1.5">{f.title}</h3>
                <p className="text-xs text-plum leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

#### How It Works Section:

```tsx
const STEPS = [
  { n: "01", title: "Set up your property", desc: "Add your rooms, rates, and staff in under 5 minutes with the guided onboarding." },
  { n: "02", title: "Start taking bookings", desc: "Walk-ins, phone bookings, OTA imports — all managed from one screen." },
  { n: "03", title: "Run your operation", desc: "Housekeeping, guest requests, folios, and day-close — all in one place." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.04]">
      <div className="mx-auto max-w-4xl">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal mb-3">
            Simple by design
          </p>
          <h2 className="text-4xl font-semibold tracking-tight">Up and running in minutes</h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-9 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div key={step.n}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-4">
              {/* Number circle */}
              <div className="relative flex size-[52px] items-center justify-center rounded-full
                              liquid-glass ring-1 ring-teal/20">
                <span className="text-sm font-semibold text-teal">{step.n}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-chalk mb-1.5">{step.title}</h3>
                <p className="text-xs text-plum leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### Testimonials Section:

```tsx
const TESTIMONIALS = [
  { name: "Arjun Nair", role: "Owner, The Hillside Homestay, Coorg",
    quote: "We used to manage bookings in a notebook. soylPMS has made our entire operation feel professional." },
  { name: "Deepa Krishnan", role: "Manager, Lakeside Lodge, Alleppey",
    quote: "Check-ins that used to take 10 minutes now take 30 seconds. Guests notice." },
  { name: "Rahul Mehta", role: "Owner, City Suites, Pune",
    quote: "The owner dashboard alone was worth it. I finally know what my property earns every day." },
];

function TestimonialsSection() {
  return (
    <section className="py-24 px-6 border-t border-white/[0.04]">
      <div className="mx-auto max-w-5xl">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center text-4xl font-semibold tracking-tight mb-12">
          Trusted by property owners
        </motion.h2>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={staggerItem}
              className="liquid-glass glass-hover rounded-2xl p-6 flex flex-col gap-5">
              <p className="text-sm text-chalk/80 leading-relaxed italic">"{t.quote}"</p>
              <div className="mt-auto">
                <p className="text-sm font-semibold text-chalk">{t.name}</p>
                <p className="text-xs text-plum mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

#### CTA Banner:

```tsx
function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="liquid-glass rounded-3xl p-10 sm:p-14
                     ring-1 ring-teal/15 shadow-glow">
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Ready to modernise your property?
          </h2>
          <p className="text-plum text-base mb-8 leading-relaxed">
            Join hundreds of properties across India. Set up in 5 minutes.
            No technical skills required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/en/onboarding"
              className="group flex items-center gap-2 rounded-xl bg-teal text-ink font-semibold text-sm px-8 py-4
                         hover:bg-chalk shadow-glow hover:shadow-raised active:scale-[0.98] transition-all">
              Get started for free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-plum">
            {["No credit card", "Free under 10 rooms", "Works offline", "GST invoicing"].map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-teal" /> {f}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

#### Footer:

```tsx
function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.05] py-10 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="SOYL" width={24} height={24} className="rounded-full opacity-70" />
          <span className="text-sm text-plum">
            © 2025 SOYL AI Private Limited. Story of your life.
          </span>
        </div>
        <div className="flex gap-5 text-sm text-plum">
          {["Privacy", "Terms", "Contact"].map((label) => (
            <a key={label} href="#" className="hover:text-chalk transition-colors">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

---

### 7.2 Login Page — `src/app/[locale]/login/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/lib/store";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp, scaleIn } from "@/lib/motion";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"manager" | "owner">("manager");
  const [loading, setLoading] = useState(false);
  const { setOnboardingComplete, setPropertyName } = useAppStore();

  async function handleLogin() {
    if (phone.length < 10) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setPropertyName("Sunset Lodge");
    setOnboardingComplete(true);
    router.replace(role === "owner" ? "/app/owner" : "/app/manager");
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center
                    bg-ink px-4 overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2
                         h-[400px] w-[600px] rounded-full bg-teal/[0.05] blur-[80px]" />
      </div>

      <motion.div
        variants={scaleIn} initial="hidden" animate="visible"
        className="relative w-full max-w-sm">

        {/* Logo + wordmark */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="mb-8 flex flex-col items-center gap-3">
          <Image src="/icon.png" alt="SOYL" width={52} height={52}
            className="rounded-full shadow-glow" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-chalk tracking-tight">
              soyl<span className="text-teal">PMS</span>
            </h1>
            <p className="text-xs text-plum mt-0.5">Welcome back</p>
          </div>
        </motion.div>

        {/* Card */}
        <div className="liquid-glass rounded-2xl p-6 shadow-raised">

          {/* Role selector */}
          <div className="flex rounded-xl border border-white/[0.07] bg-white/[0.02] p-1 mb-5">
            {(["manager", "owner"] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={cn(
                  "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                  role === r
                    ? "bg-teal/12 text-teal border border-teal/20"
                    : "text-plum hover:text-chalk"
                )}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-[0.15em] text-plum mb-1.5">
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]
                              focus-within:border-teal/40 focus-within:shadow-glow-sm transition-all">
                <span className="flex items-center border-r border-white/[0.08] px-3 text-xs text-plum">
                  +91
                </span>
                <input type="tel" value={phone} inputMode="tel"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-chalk
                             placeholder:text-plum/40 outline-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-2xs font-semibold uppercase tracking-[0.15em] text-plum mb-1.5">
                Password
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]
                              focus-within:border-teal/40 focus-within:shadow-glow-sm transition-all">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-chalk
                             placeholder:text-plum/40 outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="px-3 text-plum hover:text-chalk transition-colors">
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleLogin}
              disabled={loading || phone.length < 10}
              className={cn(
                "group mt-1 flex w-full items-center justify-center gap-2 rounded-xl",
                "bg-teal text-ink font-semibold text-sm h-12",
                "hover:bg-chalk shadow-glow hover:shadow-raised",
                "active:scale-[0.98] transition-all duration-200",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              )}>
              {loading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-2xs text-plum">
            Demo — any 10-digit number · any password
          </p>
        </div>

        {/* Register link */}
        <p className="mt-4 text-center text-sm text-plum">
          New property?{" "}
          <Link href="/en/onboarding"
            className="font-medium text-teal hover:text-chalk transition-colors">
            Set up your account →
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
```

---

## 8 — Onboarding Update (`src/app/[locale]/onboarding/page.tsx`)

Apply the new design system to the existing 5-step flow. The logic and step components stay
exactly the same — only styles change:

- Progress bar: replace shadcn `<Progress>` default with a teal fill:
  `[&>div]:bg-teal` or apply inline style to the inner `<div>`.
- Step container: `liquid-glass rounded-2xl px-4 py-6` wrapping all step content.
- Navigation bar (sticky bottom): `glass-heavy border-t border-white/[0.06]`
- Back button: `border border-white/[0.09] bg-white/[0.03] text-chalk hover:bg-white/[0.07]`
- Next / Finish button: `bg-teal text-ink font-semibold hover:bg-chalk shadow-glow`
- All `<Input>` fields: `bg-white/[0.04] border-white/[0.08] text-chalk placeholder:text-plum/50 focus:border-teal/40`
- All room-type cards: `liquid-glass rounded-xl p-4 border-0`
- Language selection buttons (active): `border-2 border-teal/50 bg-teal/10 text-chalk`
- Language selection buttons (inactive): `border border-white/[0.08] bg-white/[0.02] text-plum hover:border-white/[0.16]`
- The custom toggle in StepRooms: active track → `bg-teal`, thumb → `bg-ink`
- Step number label (`2 / 5`): `text-xs text-plum`

---

## 9 — Final Checklist

Before considering the redesign complete:

**Brand compliance**
- [ ] Favicon and app icon are the SOYL circular logo (soyl_-logo.ico / icon.png)
- [ ] All colour values trace back to: `#030709`, `#F8FCFD`, `#AFD0CC`, `#635467`
- [ ] Zero instances of old colour tokens (`soyl-primary`, `soyl-secondary`, etc.)
- [ ] Logo is never recoloured, distorted, or rotated anywhere in the UI
- [ ] Font is Inter across all text (no warm/decorative alternatives)

**Glass & surface quality**
- [ ] All card surfaces use `.liquid-glass` (not plain `bg-white/80` or flat dark fills)
- [ ] Top bar and bottom nav use `.glass-heavy` with `backdrop-blur`
- [ ] Sidebar uses `.glass-heavy` with `backdrop-blur`
- [ ] Modal / sheet overlays use `.glass` or `.liquid-glass`
- [ ] No component uses a solid flat dark fill where glass would be more appropriate

**Hierarchy & readability**
- [ ] `checked_in` badge is visibly distinct from `confirmed` (different background, plus teal ring)
- [ ] Guest name is `font-semibold text-chalk`, room/date details are `text-xs text-plum`
- [ ] Booking form has 3 labelled phases with numbered headers
- [ ] Housekeeping action buttons change colour by next status (not uniform orange)

**Responsive / Desktop**
- [ ] Sidebar appears at `lg:` breakpoint in both Manager and Owner layouts
- [ ] Dashboard uses 2-column grid at `lg:` in both dashboards
- [ ] Bottom nav is hidden at `lg:` in both layouts
- [ ] Top bar is hidden at `lg:` in both layouts
- [ ] FAB is hidden at `lg:` (sidebar has a "New Booking" entry instead)
- [ ] Max content width on desktop: `max-w-2xl` inside the sidebar offset

**New pages**
- [ ] `/` (locale page) renders the full landing page — NOT a redirect
- [ ] Landing page has: Navbar + Hero + Features + HowItWorks + Testimonials + CTA + Footer
- [ ] `/login` page exists and navigates to correct role dashboard on submit
- [ ] Both new pages use the SOYL logo mark in the nav

**Animation**
- [ ] Every page uses `variants={fadeUp}` entrance animation
- [ ] Feature cards, booking list items, and housekeeping cards use stagger animation
- [ ] Motion variants are imported from `src/lib/motion.ts` — no inline initial/animate objects
- [ ] Landing page hero uses `whileInView` for sections below the fold

---

*End of prompt. Implement in order: Section 2 (tokens) → Section 3 (motion) → Section 4 (shared components) → Section 5 (layouts) → Section 6 (pages) → Section 7 (new pages) → Section 8 (onboarding) → Section 9 (checklist).*
