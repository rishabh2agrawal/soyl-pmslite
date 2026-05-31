# soyl-pmslite — Complete UI Redesign Prompt

> Paste this entire prompt into Claude (or your AI tool of choice). It is self-contained and requires no additional context beyond what the codebase already has.

---

## Context

You are redesigning the full frontend of **soyl-pmslite**, a Next.js 15 hotel property management system (`/frontend/src`). The app uses:
- Next.js 15 App Router with `[locale]` i18n routing
- Tailwind CSS v3 with shadcn/ui component library
- Framer Motion for animations
- `next-intl` for translations
- Zustand (`useAppStore`) for global state
- React Hook Form + Zod for forms
- `date-fns` for date logic

The codebase is fully functional with mock data. **Do not change any business logic, routing, data fetching, or TypeScript types.** You are only changing visual presentation: CSS variables, Tailwind config, component markup/classNames, and adding new pages (landing, login).

---

## 1 — New Design System

### 1.1 Color Palette

Replace the existing warm-brown palette entirely. Implement this **dark-navy + electric-indigo + emerald** system in `src/app/globals.css`:

```css
:root {
  /* Core surfaces */
  --background: 222 47% 6%;          /* #080D1A  — near-black navy page bg */
  --foreground: 210 40% 96%;         /* #EEF2F9  — off-white text */
  --card: 222 40% 10%;               /* #101826  — elevated card */
  --card-foreground: 210 40% 96%;

  /* Primary — Electric Indigo */
  --primary: 245 80% 62%;            /* #5B4FE8 */
  --primary-foreground: 0 0% 100%;

  /* Secondary — Emerald */
  --secondary: 162 72% 40%;          /* #19A97B */
  --secondary-foreground: 0 0% 100%;

  /* Accent — Amber */
  --accent: 38 92% 55%;              /* #F5A623 */
  --accent-foreground: 222 47% 6%;

  /* Destructive */
  --destructive: 0 68% 56%;          /* #E04545 */
  --destructive-foreground: 0 0% 100%;

  /* UI chrome */
  --muted: 222 30% 14%;              /* #161F2E */
  --muted-foreground: 215 20% 55%;   /* #7A8BA6 */
  --border: 222 30% 18%;             /* #1C2840 */
  --input: 222 30% 14%;
  --ring: 245 80% 62%;
  --radius: 0.75rem;

  /* Custom tokens */
  --surface-2: 222 35% 13%;          /* slightly raised from card */
  --surface-3: 222 28% 17%;          /* hover state */
  --glow-primary: rgba(91, 79, 232, 0.20);
  --glow-secondary: rgba(25, 169, 123, 0.18);
  --glow-accent: rgba(245, 166, 35, 0.18);

  /* Semantic status colors */
  --status-confirmed-bg: rgba(91, 79, 232, 0.18);
  --status-confirmed-text: #8B82F0;
  --status-checkedin-bg: rgba(25, 169, 123, 0.20);
  --status-checkedin-text: #2DD4A0;
  --status-checkout-bg: rgba(122, 139, 166, 0.15);
  --status-checkout-text: #7A8BA6;
  --status-cancelled-bg: rgba(224, 69, 69, 0.15);
  --status-cancelled-text: #F07070;
  --status-noshow-bg: rgba(245, 166, 35, 0.15);
  --status-noshow-text: #F5A623;

  /* Room status */
  --room-available-bg: rgba(25, 169, 123, 0.18);
  --room-available-text: #2DD4A0;
  --room-occupied-bg: rgba(91, 79, 232, 0.18);
  --room-occupied-text: #8B82F0;
  --room-dirty-bg: rgba(245, 166, 35, 0.18);
  --room-dirty-text: #F5A623;
  --room-cleaning-bg: rgba(56, 189, 248, 0.18);
  --room-cleaning-text: #38BDF8;
  --room-maintenance-bg: rgba(224, 69, 69, 0.15);
  --room-maintenance-text: #F07070;
  --room-blocked-bg: rgba(122, 139, 166, 0.15);
  --room-blocked-text: #7A8BA6;
  --room-inspected-bg: rgba(25, 169, 123, 0.12);
  --room-inspected-text: #19A97B;

  /* Shadows */
  --shadow-glow: 0 0 24px var(--glow-primary);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.35);
  --shadow-raised: 0 8px 32px rgba(0, 0, 0, 0.45);
}
```

Remove the dark mode block — this IS the dark theme as default. If you want a light mode toggle, add it later; for now ship one polished dark theme.

### 1.2 Typography

In `tailwind.config.ts`, change the font stack:
```ts
fontFamily: {
  sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
  mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
  display: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
},
```

In `src/app/layout.tsx`, switch from the current font import to Geist:
```tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
```

Apply `className={`${GeistSans.variable} ${GeistMono.variable}`}` to the `<html>` element.

### 1.3 Body Background

Replace the current body background in `globals.css` with:
```css
body {
  @apply bg-background text-foreground;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(91,79,232,0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(25,169,123,0.08), transparent);
  background-attachment: fixed;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  min-height: 100dvh;
}
```

### 1.4 Tailwind Config Additions

Add these to `tailwind.config.ts` under `extend`:
```ts
colors: {
  /* keep existing hsl(var(--...)) mappings, ADD: */
  navy: {
    900: "#080D1A",
    800: "#0D1424",
    700: "#101826",
    600: "#131E30",
    500: "#161F2E",
    400: "#1C2840",
    300: "#243250",
  },
  indigo: {
    DEFAULT: "#5B4FE8",
    light: "#8B82F0",
    glow: "rgba(91,79,232,0.20)",
  },
  emerald: {
    DEFAULT: "#19A97B",
    light: "#2DD4A0",
    glow: "rgba(25,169,123,0.18)",
  },
  amber: {
    DEFAULT: "#F5A623",
    light: "#F7C05A",
  },
},
boxShadow: {
  glow: "0 0 24px var(--glow-primary)",
  "glow-sm": "0 0 12px var(--glow-primary)",
  "glow-emerald": "0 0 20px var(--glow-secondary)",
  card: "var(--shadow-card)",
  raised: "var(--shadow-raised)",
},
backgroundImage: {
  "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
  "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
},
```

---

## 2 — Shared Component Overhaul

### 2.1 `src/components/layouts/top-bar.tsx`

Redesign to a frosted-glass dark bar:
```tsx
<header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-navy-900/80 px-4 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl safe-area-pt">
  <h1 className="text-base font-semibold tracking-tight text-foreground">
    {title}
  </h1>
  <div className="flex items-center gap-2">
    {rightAction}
    {/* Bell / Settings icons — style with text-muted-foreground hover:text-foreground */}
  </div>
</header>
```

### 2.2 `src/components/layouts/bottom-nav.tsx`

Redesign with glowing active indicator:
```tsx
/* active item */
className="relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-all text-indigo-light bg-indigo/10"

/* active icon — add glow */
/* isActive && "drop-shadow-[0_0_8px_rgba(91,79,232,0.8)]" */

/* inactive */
className="text-muted-foreground hover:text-foreground"

/* nav container */
className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-navy-900/85 backdrop-blur-2xl safe-area-pb"
```

### 2.3 `src/components/shared/status-badge.tsx`

Replace ALL status colors with CSS variable–based system for clear visual differentiation:

```tsx
const bookingVariants: Record<BookingStatus, { bg: string; text: string }> = {
  confirmed:   { bg: "bg-[var(--status-confirmed-bg)]",  text: "text-[var(--status-confirmed-text)]"  },
  checked_in:  { bg: "bg-[var(--status-checkedin-bg)]",  text: "text-[var(--status-checkedin-text)] ring-1 ring-emerald/40"  },
  checked_out: { bg: "bg-[var(--status-checkout-bg)]",   text: "text-[var(--status-checkout-text)]"  },
  cancelled:   { bg: "bg-[var(--status-cancelled-bg)]",  text: "text-[var(--status-cancelled-text)]" },
  no_show:     { bg: "bg-[var(--status-noshow-bg)]",     text: "text-[var(--status-noshow-text)]"    },
};

const roomVariants: Record<RoomStatus, { bg: string; text: string }> = {
  available:   { bg: "bg-[var(--room-available-bg)]",   text: "text-[var(--room-available-text)]"   },
  occupied:    { bg: "bg-[var(--room-occupied-bg)]",    text: "text-[var(--room-occupied-text)]"    },
  dirty:       { bg: "bg-[var(--room-dirty-bg)]",       text: "text-[var(--room-dirty-text)]"       },
  cleaning:    { bg: "bg-[var(--room-cleaning-bg)]",    text: "text-[var(--room-cleaning-text)]"    },
  maintenance: { bg: "bg-[var(--room-maintenance-bg)]", text: "text-[var(--room-maintenance-text)]" },
  blocked:     { bg: "bg-[var(--room-blocked-bg)]",     text: "text-[var(--room-blocked-text)]"     },
  inspected:   { bg: "bg-[var(--room-inspected-bg)]",   text: "text-[var(--room-inspected-text)]"   },
};
```

The badge element should have `border border-current/20` to give a subtle colored ring matching the text.

### 2.4 `src/components/shared/metric-card.tsx`

Redesign with glowing icon and animated number:

```tsx
<Card className="border-white/[0.06] bg-card/80 backdrop-blur-sm shadow-card overflow-hidden relative">
  {/* Subtle gradient shine overlay */}
  <div className="absolute inset-0 bg-card-shine pointer-events-none" />
  <CardContent className="flex items-start justify-between gap-3 p-4">
    <div className="flex flex-1 flex-col gap-1">
      <span className="text-[2rem] font-semibold tracking-tight text-foreground leading-none">
        {value}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
      {trend && <TrendChip direction={trend.direction} delta={trend.delta} />}
    </div>
    <div className={cn(
      "rounded-xl p-2.5",
      variant === "success"  && "bg-emerald/10 text-emerald-light shadow-glow-emerald",
      variant === "warning"  && "bg-amber/10 text-amber",
      variant === "danger"   && "bg-destructive/10 text-destructive",
      variant === "default"  && "bg-indigo/10 text-indigo-light",
    )}>
      {icon}
    </div>
  </CardContent>
</Card>
```

### 2.5 `src/components/shared/list-row.tsx`

Strengthen information hierarchy — guest name bold, details muted:
```tsx
<div className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-navy-500/50 hover:shadow-glow-sm active:scale-[0.99]">
  {/* Avatar: larger, colored by first letter */}
  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo/15 text-sm font-semibold text-indigo-light ring-1 ring-indigo/20">
    {avatar}
  </div>
  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
    <span className="truncate text-sm font-semibold text-foreground leading-tight">
      {title}
    </span>
    <span className="truncate text-xs text-muted-foreground leading-tight">
      {subtitle}
    </span>
  </div>
  <div className="flex-shrink-0">{right}</div>
</div>
```

### 2.6 `src/components/shared/page-header.tsx`

Add a subtle gradient underline:
```tsx
<div className="flex items-center justify-between py-4">
  <div className="flex items-center gap-3">
    {showBack && (
      <button onClick={onBack} className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-navy-500/50 text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="size-5" />
      </button>
    )}
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
  {action}
</div>
```

### 2.7 `src/components/shared/filter-chips.tsx`

Active chip should use indigo with glow:
```tsx
/* active */
"border-indigo/50 bg-indigo/15 text-indigo-light shadow-glow-sm"
/* inactive */
"border-white/[0.08] bg-navy-500/50 text-muted-foreground hover:border-white/20 hover:text-foreground"
```

### 2.8 `src/components/shared/sticky-cta.tsx`

Make the primary button use a gradient:
```tsx
<Button className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo to-[#7B6EF6] text-white font-semibold text-sm shadow-glow hover:shadow-raised hover:from-indigo/90 hover:to-[#7B6EF6]/90 transition-all active:scale-[0.98]">
  {loading ? <Spinner /> : primaryLabel}
</Button>
```

The container:
```tsx
<div className="fixed bottom-0 inset-x-0 border-t border-white/[0.06] bg-navy-900/90 backdrop-blur-2xl px-4 py-3 safe-area-pb">
```

---

## 3 — Page Redesigns

### 3.1 All pages — motion config

All `motion.div` page wrappers should use:
```tsx
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
```

For staggered list items, add:
```tsx
// wrap each list item
<motion.div
  initial={{ opacity: 0, x: -8 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.2, delay: index * 0.04 }}
>
```

### 3.2 Manager Dashboard (`app/manager/page.tsx`)

- The "rooms available" card should be a full-width hero with a large number and a mini horizontal bar chart showing occupied vs available vs dirty (simple colored `<div>` segments).
- Cards should have `border border-white/[0.06] bg-card/80 backdrop-blur-sm shadow-card`.
- The FAB (`+` button) in layout.tsx should be: `bg-gradient-to-br from-indigo to-[#7B6EF6] shadow-glow hover:shadow-raised`.

### 3.3 Owner Dashboard (`app/owner/page.tsx`)

- The `2×2` metrics grid should have a `motion.div` stagger: index 0 appears at 0ms, 1 at 60ms, 2 at 120ms, 3 at 180ms.
- The greeting should be larger: `text-3xl font-bold` with a gradient text treatment: `bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent`.
- The attention banner: `border border-amber/30 bg-amber/8 shadow-[0_0_20px_var(--glow-accent)]`.

### 3.4 Bookings List (`app/manager/bookings/page.tsx`)

- The search input should have a glowing focus ring: `focus-visible:ring-2 focus-visible:ring-indigo/50 focus-visible:ring-offset-0 bg-navy-500/50 border-white/[0.08]`.
- Each booking card should have a subtle left-border color matching its status:
  - `confirmed` → `border-l-2 border-l-indigo/60`
  - `checked_in` → `border-l-2 border-l-emerald/60`
  - `checked_out` → `border-l-2 border-l-muted-foreground/30`
  - `cancelled` → `border-l-2 border-l-destructive/50`

### 3.5 Calendar (`app/manager/calendar/page.tsx`)

Status colors for booking bars:
```ts
const statusColors: Record<BookingStatus, string> = {
  confirmed:   "bg-indigo/80",
  checked_in:  "bg-emerald/80",
  checked_out: "bg-navy-400",
  cancelled:   "bg-destructive/60",
  no_show:     "bg-amber/70",
};
```

Header / room label cells:
```
bg-navy-700/80 border-white/[0.06]
```

### 3.6 Housekeeping (`app/manager/housekeeping/page.tsx`)

Left border colors by status:
```ts
const statusCardBorder: Record<RoomStatus, string> = {
  available:   "border-l-emerald",
  occupied:    "border-l-indigo/60",
  dirty:       "border-l-amber",
  cleaning:    "border-l-sky-400",
  maintenance: "border-l-destructive",
  blocked:     "border-l-muted-foreground/50",
  inspected:   "border-l-emerald/60",
};
```

Action button colors should change by `next` status:
```ts
const actionButtonClass: Record<string, string> = {
  cleaning:  "bg-amber/15 text-amber border border-amber/30 hover:bg-amber/25",
  inspected: "bg-sky-400/15 text-sky-400 border border-sky-400/30 hover:bg-sky-400/25",
  available: "bg-emerald/15 text-emerald-light border border-emerald/30 hover:bg-emerald/25",
};
```

### 3.7 New Booking Form (`app/manager/bookings/new/page.tsx`)

- Group the 8 cards into 3 visual sections using section headers with a colored left indicator:
  ```tsx
  <div className="flex items-center gap-2 mb-3">
    <div className="h-4 w-0.5 rounded-full bg-indigo" />
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      Stay Details
    </span>
  </div>
  /* Section 1: Dates + Room */
  /* Section 2: Guest Info (Name, Phone, ID) + Occupancy */
  /* Section 3: Pricing + Source + Payment + Invoice */
  ```

- Source selector pills: selected pill uses `bg-gradient-to-r from-indigo to-[#7B6EF6] text-white shadow-glow-sm`.

---

## 4 — Responsive / Desktop Layout

The app currently has no desktop layout — everything is a single-column mobile stack. Add a responsive shell that works from 320px to 1400px+.

### 4.1 Manager Layout (`app/manager/layout.tsx`)

Replace the current layout with a responsive sidebar + content shell:

```tsx
export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const propertyName = useAppStore((s) => s.propertyName);

  const items = managerNavItems.map((item) => ({
    href: item.href,
    icon: item.icon,
    label: t(item.labelKey),
  }));

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-white/[0.06] lg:bg-navy-800/80 lg:backdrop-blur-xl">
        {/* Logo / Property name */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo/20">
            <Building2 className="size-4 text-indigo-light" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{propertyName || "Property"}</p>
            <p className="text-xs text-muted-foreground">Manager</p>
          </div>
        </div>
        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </nav>
        {/* Bottom: Settings + User */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <SidebarNavItem item={{ href: "/app/settings", icon: Settings, label: "Settings" }} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden">
        <TopBar
          title={propertyName || "Property"}
          rightAction={<Badge variant="secondary" className="text-xs">Manager</Badge>}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-60 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 lg:pt-8 lg:pb-8">
          {children}
        </div>
      </main>

      {/* FAB — mobile only */}
      <Link href="/app/manager/bookings/new" className="lg:hidden fixed bottom-20 right-4 z-50 ...">
        <Plus className="h-6 w-6" />
      </Link>

      {/* Bottom nav — mobile only */}
      <div className="lg:hidden">
        <BottomNav items={items} mode="manager" />
      </div>
    </div>
  );
}
```

Create a `SidebarNavItem` component inside the layout file:
```tsx
function SidebarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href ||
    (item.href !== "/app/manager" && item.href !== "/app/owner" && pathname.startsWith(item.href));

  return (
    <Link href={item.href} className={cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
      isActive
        ? "bg-indigo/15 text-indigo-light shadow-[inset_0_0_0_1px_rgba(91,79,232,0.25)]"
        : "text-muted-foreground hover:bg-navy-500/50 hover:text-foreground"
    )}>
      <item.icon className={cn("size-4.5", isActive && "drop-shadow-[0_0_6px_rgba(91,79,232,0.7)]")} />
      <span>{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
}
```

### 4.2 Owner Layout (`app/owner/layout.tsx`)

Apply the same responsive sidebar pattern but with `mode="owner"`, indigo → emerald color for the active state, and "Owner" badge.

### 4.3 Dashboard grid — desktop

On `lg+` screens, the Owner and Manager dashboards should use a 2-column layout where the metric grid and arrivals/departures are side-by-side. Wrap the dashboard content:

```tsx
<div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
  <div className="space-y-4">
    {/* Left: Metrics grid + attention banner */}
  </div>
  <div className="space-y-4">
    {/* Right: Arrivals + Departures + In-house */}
  </div>
</div>
```

On mobile keep the existing single-column stacking.

---

## 5 — New Pages

### 5.1 Landing Page — `src/app/[locale]/page.tsx`

Replace the current redirect with a full marketing landing page. This is the public-facing entry point.

**Structure:**

```
/
├── <NavBar />          — logo + "Sign in" + "Get started" CTAs
├── <HeroSection />     — headline, subline, animated preview mockup
├── <FeaturesSection /> — 6 feature cards in 3×2 grid
├── <HowItWorks />      — 3-step horizontal flow
├── <TestimonialsSection /> — 3 quote cards
├── <CTABanner />       — "Ready to modernize your property?"
└── <Footer />          — links + copyright
```

**NavBar:**
```tsx
<nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-navy-900/80 backdrop-blur-xl">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo to-[#7B6EF6]">
        <Building2 className="size-4 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-foreground">soyl<span className="text-indigo-light">PMS</span></span>
    </div>
    <div className="flex items-center gap-3">
      <Link href="/en/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
        Sign in
      </Link>
      <Link href="/en/onboarding" className="rounded-xl bg-gradient-to-r from-indigo to-[#7B6EF6] px-4 py-2 text-sm font-semibold text-white shadow-glow hover:shadow-raised transition-all">
        Get started free
      </Link>
    </div>
  </div>
</nav>
```

**HeroSection:**
```tsx
<section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16">
  {/* Background blobs */}
  <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
    <div className="h-[600px] w-[900px] rounded-full bg-indigo/10 blur-[120px]" />
  </div>
  <div className="pointer-events-none absolute right-0 bottom-0">
    <div className="h-[400px] w-[600px] rounded-full bg-emerald/8 blur-[100px]" />
  </div>

  {/* Badge pill */}
  <motion.div
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo/30 bg-indigo/10 px-4 py-1.5"
  >
    <span className="flex size-1.5 rounded-full bg-emerald-light animate-pulse" />
    <span className="text-xs font-medium text-indigo-light">Built for Indian hotels & homestays</span>
  </motion.div>

  {/* Headline */}
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="max-w-3xl text-center text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
  >
    Manage your property.{" "}
    <span className="bg-gradient-to-r from-indigo-light via-[#A89CF8] to-emerald-light bg-clip-text text-transparent">
      Effortlessly.
    </span>
  </motion.h1>

  {/* Subline */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="mt-6 max-w-xl text-center text-lg text-muted-foreground"
  >
    A modern, mobile-first PMS for hotels, homestays, and guesthouses. 
    Check-ins in under 30 seconds. Real-time housekeeping. Owner analytics.
    Works offline.
  </motion.p>

  {/* CTA buttons */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
  >
    <Link href="/en/onboarding" className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo to-[#7B6EF6] px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-raised hover:scale-[1.02]">
      Start for free
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
    <Link href="/en/login" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-white/[0.08] transition-all">
      Sign in to your account
    </Link>
  </motion.div>

  {/* Animated mockup preview — a simplified version of the dashboard UI rendered as HTML */}
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.5, ease: [0.25,0.1,0.25,1] }}
    className="relative mt-16 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-navy-800/80 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm"
  >
    {/* Fake browser chrome */}
    <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.06] bg-navy-700/80 px-4">
      <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
      <div className="h-2.5 w-2.5 rounded-full bg-amber/60" />
      <div className="h-2.5 w-2.5 rounded-full bg-emerald/60" />
      <div className="mx-auto flex items-center gap-2 rounded-md border border-white/[0.06] bg-navy-600/60 px-3 py-1">
        <span className="text-[10px] text-muted-foreground">soylpms.app/dashboard</span>
      </div>
    </div>
    {/* Dashboard preview — use the actual Owner dashboard page component here but wrapped in a non-interactive preview container */}
    <div className="pointer-events-none overflow-hidden" style={{ height: 480 }}>
      {/* Import and render <OwnerPulsePage /> or <ManagerTodayPage /> here as a static preview */}
      {/* Alternatively, render a styled static HTML mockup of the dashboard */}
      {/* This creates the "product screenshot" effect common on SaaS landing pages */}
    </div>
    {/* Gradient fade at the bottom */}
    <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-navy-900 to-transparent" />
  </motion.div>
</section>
```

**FeaturesSection:**
```tsx
const features = [
  { icon: Zap, title: "30-second check-in", desc: "Walk-in to room key in under 30 seconds. Optimised for front desk speed.", color: "indigo" },
  { icon: BedDouble, title: "Visual room grid", desc: "See every room's status at a glance. Housekeeping updates in real-time.", color: "emerald" },
  { icon: BarChart3, title: "Owner analytics", desc: "Occupancy, revenue, ARR, and trends — all visible without asking the manager.", color: "amber" },
  { icon: CalendarDays, title: "Availability calendar", desc: "Colour-coded Gantt view across all rooms. Click any cell to create a booking.", color: "indigo" },
  { icon: MessageSquare, title: "Guest requests", desc: "Housekeeping, maintenance, F&B requests — routed and tracked end-to-end.", color: "emerald" },
  { icon: Globe, title: "Works offline", desc: "All critical operations work without internet. Syncs when you're back online.", color: "amber" },
];
```

Each feature card: `border border-white/[0.06] bg-navy-700/60 rounded-2xl p-6 hover:bg-navy-600/60 hover:border-white/[0.1] hover:shadow-card transition-all group`

Icon container: colored glow div matching the feature color.

**HowItWorks:** Three numbered steps with a connecting dashed line on desktop.

**Footer:**
```tsx
<footer className="border-t border-white/[0.06] bg-navy-800/60 py-12 px-6">
  <div className="mx-auto max-w-7xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
    <span className="text-sm text-muted-foreground">© 2025 soylPMS. Made for Indian hospitality.</span>
    <div className="flex gap-6 text-sm text-muted-foreground">
      <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
      <a href="#" className="hover:text-foreground transition-colors">Terms</a>
      <a href="#" className="hover:text-foreground transition-colors">Contact</a>
    </div>
  </div>
</footer>
```

### 5.2 Login Page — `src/app/[locale]/login/page.tsx`

Create this file (new route). It does not need a real backend — use the existing Zustand store to set role and navigate to the correct app section.

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/lib/store";
import { Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"owner" | "manager">("manager");
  const [loading, setLoading] = useState(false);
  const { setOnboardingComplete, setPropertyName } = useAppStore();

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    setPropertyName("Sunset Lodge");
    setOnboardingComplete(true);
    router.replace(role === "owner" ? "/app/owner" : "/app/manager");
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-indigo/8 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo to-[#7B6EF6] shadow-glow">
            <Building2 className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your property</p>
          </div>
        </div>

        {/* Role toggle */}
        <div className="mb-6 flex rounded-xl border border-white/[0.08] bg-navy-700/50 p-1">
          {(["manager", "owner"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                role === r
                  ? "bg-indigo/20 text-indigo-light shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-navy-700/60 p-6 shadow-raised backdrop-blur-sm">
          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-navy-500/60 focus-within:border-indigo/50 focus-within:ring-2 focus-within:ring-indigo/20 transition-all">
                <span className="flex items-center border-r border-white/[0.08] px-3 text-sm text-muted-foreground">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  inputMode="tel"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-navy-500/60 focus-within:border-indigo/50 focus-within:ring-2 focus-within:ring-indigo/20 transition-all">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading || phone.length < 10}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo to-[#7B6EF6] py-3.5 text-sm font-semibold text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-raised hover:scale-[1.01] transition-all active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>Sign in <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo: any 10-digit number + any password
          </p>
        </div>

        {/* Register link */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New property?{" "}
          <Link href="/en/onboarding" className="font-medium text-indigo-light hover:underline">
            Set up your account →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
```

---

## 6 — Animation System

Add these global animation utilities to `globals.css`:

```css
@layer utilities {
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 12px var(--glow-primary); }
    50% { box-shadow: 0 0 28px var(--glow-primary); }
  }

  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
}
```

Add Framer Motion variants for reuse across pages. Create `src/lib/motion.ts`:

```ts
export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const slideFromRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};
```

Import these variants on every page and use `motion.div variants={fadeUp}` instead of inline initial/animate props.

For the bookings list, housekeeping cards, and any list — wrap each item in:
```tsx
<motion.div
  variants={staggerItem}
  initial="initial"
  animate="animate"
  custom={index}
  transition={{ duration: 0.2, delay: index * 0.04 }}
>
```

And wrap the list container in:
```tsx
<motion.div variants={staggerContainer} initial="initial" animate="animate">
```

---

## 7 — Onboarding Page Update (`src/app/[locale]/onboarding/page.tsx`)

Apply the new design system to the existing onboarding flow:

- Progress bar: change color from `bg-primary` to `bg-gradient-to-r from-indigo to-emerald`.
- Step card backgrounds: `bg-navy-700/60 border border-white/[0.08]`.
- Language picker buttons: active state uses the indigo gradient with glow.
- Navigation bar at bottom: `bg-navy-900/90 border-t border-white/[0.06] backdrop-blur-xl`.
- Back button: `border border-white/[0.08] bg-navy-500/50`.
- Next/Finish button: `bg-gradient-to-r from-indigo to-[#7B6EF6] shadow-glow`.
- Inputs: `bg-navy-500/60 border-white/[0.08] focus:border-indigo/50 text-foreground`.
- Room type cards: `rounded-xl border border-white/[0.08] bg-navy-600/60 p-4`.

---

## 8 — Final Checklist

Before finishing, verify:

- [ ] `globals.css` has the new CSS variables and body gradient.
- [ ] `tailwind.config.ts` has the navy/indigo/emerald color tokens.
- [ ] Font is Geist (or falls back to Inter) across all pages.
- [ ] `StatusBadge` produces clearly visually distinct results for `confirmed` vs `checked_in`.
- [ ] All 8 booking form cards are grouped into 3 labelled sections.
- [ ] Desktop sidebar appears at `lg:` breakpoint in both Manager and Owner layouts.
- [ ] `src/app/[locale]/page.tsx` renders the landing page (not a redirect).
- [ ] `src/app/[locale]/login/page.tsx` exists and is reachable from the landing nav.
- [ ] `src/lib/motion.ts` exists and is used in at least the landing page, owner dashboard, and bookings list.
- [ ] Housekeeping action buttons change color based on the next status state.
- [ ] All pages have page-entry animations using `fadeUp` from `motion.ts`.
- [ ] The FAB button on manager layout uses the indigo gradient.
- [ ] The bottom nav active state uses the indigo glow effect.
- [ ] No hardcoded `#B85518`, `#1F5C3F`, `#C9971F`, `#F5F4F0` values remain anywhere in the codebase.

---

*End of prompt. This document covers every file that needs changes. Implement section by section — design system first (Section 1), then shared components (Section 2), then pages (Sections 3–5), then animations (Section 6), then onboarding (Section 7), then run the final checklist (Section 8).*
