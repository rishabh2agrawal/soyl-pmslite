# SOYL PMS Lite — Full UI Redesign Prompt

> **Purpose:** Drop this file into any AI coding agent (Claude, Cursor, GitHub Copilot Workspace, etc.) and it will redesign the `soyl-pmslite` frontend to match the reference app at `https://frontend-production-3123.up.railway.app/` in design quality, UX polish, and feature parity — while adding theme toggle and language switching.

---

## 0. Context

- **Repo:** `https://github.com/rishabh2agrawal/soyl-pmslite.git`
- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, next-intl, Zustand
- **Reference app (live):** `https://frontend-production-3123.up.railway.app/`  
  - Login: `ryangomez9965@gmail.com` / `admin@123`
- **Working directory:** `frontend/`

---

## 1. Design System — Adopt the Reference App's Aesthetic

### 1.1 Typography

The reference app uses **DM Sans** as its primary typeface. Install and configure it:

```bash
npm install @next/font
```

In `src/app/layout.tsx`:

```tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});
```

Apply `dmSans.variable` to the `<html>` tag. Update `tailwind.config.ts` font-sans to `["DM Sans", "var(--font-sans)", ...]`.

### 1.2 Color Palette — Dual Theme

The reference app uses a **light-first** palette (purple primary, soft grays, white cards). The current codebase is dark-only. We will support **both** via CSS variables.

Add these to `globals.css` alongside the existing `:root` dark block:

```css
/* ── LIGHT THEME ─────────────────────────────── */
[data-theme="light"] {
  --background: 0 0% 97%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --primary: 262 83% 65%;          /* #7c5aed — reference app purple */
  --primary-foreground: 0 0% 100%;
  --secondary: 220 14% 95%;
  --secondary-foreground: 222 47% 11%;
  --muted: 220 14% 93%;
  --muted-foreground: 215 16% 47%;
  --accent: 262 83% 65%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 13% 88%;
  --input: 220 13% 88%;
  --ring: 262 83% 65%;
  --radius: 0.75rem;

  /* Brand surface overrides */
  --soyl-ink: #f7f7fb;
  --soyl-white: #1a1a2e;
  --soyl-teal: #7c5aed;
  --soyl-plum: #8b8fa8;
  --soyl-surface: #ffffff;
  --soyl-surface-2: #f0f0f8;
  --soyl-surface-3: #e8e8f4;
  --soyl-border: rgba(124, 90, 237, 0.12);
  --soyl-border-strong: rgba(124, 90, 237, 0.22);
  --glass-fill: rgba(124, 90, 237, 0.04);
  --glass-fill-hover: rgba(124, 90, 237, 0.08);
  --glass-border: rgba(124, 90, 237, 0.12);
  --glass-border-hover: rgba(124, 90, 237, 0.22);
}

/* ── DARK THEME (existing, keep as-is, alias via data-theme) ── */
[data-theme="dark"],
:root {
  /* ... existing dark variables stay here ... */
}
```

Also add the purple to `tailwind.config.ts` colors:

```ts
purple: {
  DEFAULT: '#7c5aed',
  dim: 'rgba(124,90,237,0.12)',
  glow: 'rgba(124,90,237,0.22)',
},
```

### 1.3 Glassmorphism & Surfaces

The reference app uses **white card surfaces with soft shadows**, not dark glass. In light mode:

- Cards: `bg-white shadow-sm border border-purple/10 rounded-2xl`
- Inputs: `bg-gray-50 border border-gray-200 rounded-xl`
- Sidebar: `bg-white border-r border-gray-100`

Add utility class to `globals.css`:

```css
.surface-card {
  @apply bg-card border border-border/60 rounded-2xl shadow-sm;
}
.surface-card-hover {
  @apply hover:border-primary/20 hover:shadow-md transition-all duration-200;
}
```

---

## 2. Theme Toggle — Add to Settings & Top Bar

### 2.1 Store — add `theme`

In `src/lib/store.ts`, add theme state:

```ts
theme: 'dark' | 'light' | 'system';
setTheme: (theme: 'dark' | 'light' | 'system') => void;
```

Default: `'light'` (to match the reference app's default).

### 2.2 ThemeProvider

Create `src/components/providers/theme-provider.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme;
    root.setAttribute('data-theme', resolved);
  }, [theme]);

  return <>{children}</>;
}
```

Add `<ThemeProvider>` inside `<Providers>` in `providers.tsx`.

### 2.3 ThemeToggle Component

Create `src/components/shared/theme-toggle.tsx`:

```tsx
'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const options = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useAppStore();

  if (compact) {
    // Single icon button that cycles through modes
    const current = options.find((o) => o.value === theme) ?? options[0];
    const next = options[(options.indexOf(current) + 1) % options.length];
    return (
      <button
        onClick={() => setTheme(next.value)}
        className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent/10 hover:text-primary transition-all"
        title={`Switch to ${next.label} mode`}
      >
        <current.icon className="size-4" />
      </button>
    );
  }

  return (
    <div className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all',
            theme === value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
```

Add `<ThemeToggle compact />` to `TopBar` next to the Settings icon.

---

## 3. Language Switcher — Wire to next-intl Router

The current codebase already has `next-intl` configured with `en`, `hi`, `kn` locales (see `src/i18n/routing.ts`). The Settings page has a static language switcher that doesn't actually change the locale. Fix it:

### 3.1 LanguageSwitcher Component

Create `src/components/shared/language-switcher.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useAppStore((s) => s.setLocale);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const handleChange = (code: string) => {
    setLocale(code as 'en' | 'hi' | 'kn');
    router.replace(pathname, { locale: code });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-accent/10 hover:text-primary transition-all border border-transparent hover:border-border">
          <Globe className="size-3.5" />
          <span>{current.flag} {current.label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={locale === lang.code ? 'text-primary font-medium' : ''}
          >
            {lang.flag} {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

Add `<LanguageSwitcher />` to `TopBar` and the desktop `Sidebar` footer.

### 3.2 Update Settings Page Language Section

Replace the static language buttons in `src/app/[locale]/app/settings/page.tsx` with `<LanguageSwitcher />` (full variant, not dropdown) by importing and rendering it in the Language card.

---

## 4. Login Page — Match Reference App Exactly

Rewrite `src/app/[locale]/login/page.tsx` to match the reference design:

**Visual spec (from reference app screenshots):**
- White/light background with a subtle radial gradient (purple tint at center)
- Centered card with: logo (circular), hotel name in bold, subtitle in gray
- Input fields: white background, light gray border, icon prefix (envelope for email, lock for password), rounded-xl
- Password field: eye toggle on right
- "Remember me" checkbox row with "Forgot password?" link
- Large primary CTA button — solid purple `#7c5aed`, full width, "Sign in to Dashboard"
- Footer: "Need access? Contact your hotel administrator."
- Copyright line at bottom
- In **dark mode**, flip to the existing dark glass aesthetic

```tsx
// Key structure:
<div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-purple/5 via-background to-background px-4">
  <div className="w-full max-w-sm">
    {/* Logo + Name */}
    <div className="flex flex-col items-center mb-8 gap-3">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center ring-4 ring-border shadow-md">
        <img src="/icon.png" alt="Logo" className="size-10 rounded-full" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{propertyName}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Property Management System</p>
      </div>
    </div>

    {/* Card */}
    <div className="surface-card p-6 space-y-5">
      {/* Email field */}
      <div className="space-y-1.5">
        <Label>Email Address</Label>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Mail className="size-4 text-muted-foreground shrink-0" />
          <input type="email" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" placeholder="your@email.com" />
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Label>Password</Label>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-3 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Lock className="size-4 text-muted-foreground shrink-0" />
          <input type={showPass ? "text" : "password"} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
          <button onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground">
            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox disabled /> Remember me
        </label>
        <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
      </div>

      {/* CTA */}
      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20">
        Sign in to Dashboard
      </Button>

      <p className="text-center text-xs text-muted-foreground">Need access? Contact your hotel administrator.</p>
    </div>

    {/* Footer */}
    <p className="mt-6 text-center text-xs text-muted-foreground">
      © 2026 SOYL AI Private Limited · Story Of Your Life
    </p>

    {/* Theme + Language toggles on login page */}
    <div className="mt-4 flex justify-center gap-2">
      <ThemeToggle compact />
      <LanguageSwitcher />
    </div>
  </div>
</div>
```

---

## 5. Navigation — Match Reference App's Sidebar & Top Bar

### 5.1 Desktop Sidebar

The reference app uses a **white left sidebar** (in light mode) with:
- Hotel logo + name at top
- Navigation items with purple active state (filled pill, purple icon + text)
- User profile section at bottom (avatar, name, role, logout)
- Settings and Help links above profile

Update `src/app/[locale]/app/manager/layout.tsx` and `owner/layout.tsx`:

```tsx
// Sidebar item active state (light mode)
isActive
  ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[calc(0.75rem-2px)]'
  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
```

Add user profile section at sidebar bottom:

```tsx
<div className="border-t border-border px-3 py-4">
  <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
      {getInitials(propertyName)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{propertyName}</p>
      <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
    </div>
    <ThemeToggle compact />
  </div>
  <LanguageSwitcher />
</div>
```

### 5.2 Top Bar (Mobile)

Add `<ThemeToggle compact />` and `<LanguageSwitcher />` as icon buttons in the top bar's right slot.

### 5.3 Bottom Nav (Mobile)

Keep existing design but apply theme-aware colors:
- Active: `text-primary bg-primary/10`
- Inactive: `text-muted-foreground hover:text-foreground`
- Active dot: `bg-primary`

---

## 6. Dashboard & Cards — Lift to Reference Quality

### 6.1 Metric Cards

The reference app's metric cards use:
- White background (light) / dark glass (dark)
- Large bold number
- Subtitle in gray
- Colored icon in a soft pill
- Subtle border
- Hover: slight lift (`hover:-translate-y-0.5 hover:shadow-md`)

Update `src/components/shared/metric-card.tsx`:

```tsx
<div className="surface-card surface-card-hover p-5 hover:-translate-y-0.5 transition-all duration-200">
  <div className="flex items-start justify-between mb-3">
    <div className={cn("size-10 rounded-xl flex items-center justify-center", variantClasses)}>
      {icon}
    </div>
    {trend && <TrendBadge value={trend} />}
  </div>
  <p className="text-2xl font-bold text-foreground">{value}</p>
  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
</div>
```

### 6.2 Booking / List Rows

Update `src/components/shared/list-row.tsx` for the reference app's style:
- White card with subtle border
- Avatar: colored initials circle
- Status badge: pill with colored background
- Hover: `hover:bg-muted/40`
- Chevron right icon on far right

### 6.3 Status Badges

Match reference app's badge style:

```tsx
// Confirmed: green-tinted
'bg-emerald-50 text-emerald-700 border border-emerald-200'
// Checked in: blue-tinted
'bg-blue-50 text-blue-700 border border-blue-200'
// Checked out: gray
'bg-gray-100 text-gray-600 border border-gray-200'
// Cancelled: red-tinted
'bg-red-50 text-red-600 border border-red-200'
```

---

## 7. Settings Page Enhancements

Add two new sections to `src/app/[locale]/app/settings/page.tsx`:

### 7.1 Appearance Section

```tsx
<Card className="surface-card">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-base">
      <Palette className="size-4 text-primary" />
      Appearance
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label className="text-sm font-medium mb-2 block">Theme</Label>
      <ThemeToggle />
    </div>
  </CardContent>
</Card>
```

### 7.2 Language Section (replace static buttons)

```tsx
<Card className="surface-card">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-base">
      <Globe className="size-4 text-primary" />
      Language
    </CardTitle>
    <CardDescription>Choose your preferred language for the interface</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-xl border p-3 text-sm font-medium transition-all',
            activeLang === lang.code
              ? 'border-primary bg-primary/10 text-primary shadow-sm'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          )}
        >
          <span className="text-xl">{lang.flag}</span>
          <span className="text-xs">{lang.label}</span>
        </button>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## 8. Onboarding Page

The reference app shows a polished multi-step onboarding. Match it in `src/app/[locale]/onboarding/page.tsx`:

- Step indicator: horizontal pill progress bar (purple filled segments)
- Each step in a white card
- Language selection on step 1 with flag buttons
- Animated transitions between steps using Framer Motion `AnimatePresence`
- Final step: confirmation screen with checkmark animation

```tsx
// Step progress indicator
<div className="flex gap-1.5 mb-8">
  {steps.map((_, i) => (
    <div
      key={i}
      className={cn(
        'h-1.5 flex-1 rounded-full transition-all duration-500',
        i <= currentStep ? 'bg-primary' : 'bg-muted'
      )}
    />
  ))}
</div>
```

---

## 9. Micro-interactions & Polish

Apply these globally:

### 9.1 Page Transitions

Keep existing `pageTransitionProps` from `src/lib/motion.ts` but tune for light mode:

```ts
export const pageTransitionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
};
```

### 9.2 Button Hover States

All primary buttons:
```css
@apply hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all duration-150;
```

### 9.3 Input Focus Ring

```css
@apply focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50;
```

### 9.4 Empty States

Update `src/components/shared/empty-state.tsx`:
- Centered illustration (SVG or emoji in large rounded square)
- Bold heading
- Muted subtitle
- Optional CTA button

### 9.5 Loading Skeleton

Update `src/components/shared/loading-skeleton.tsx` to use `animate-pulse bg-muted rounded-lg` blocks that match the actual content shape.

---

## 10. Responsive Layout Improvements

The reference app is **mobile-first** with a desktop sidebar. Ensure:

1. **Mobile** (`< lg`): full-width stack, top bar, bottom nav, FAB for new booking
2. **Desktop** (`≥ lg`): 224px fixed sidebar, main content fills remaining space, max-width 1280px with padding
3. **Form pages**: max-width 640px centered, always
4. **Dashboard grids**: 1 col mobile → 2 col desktop (already implemented, keep)

Add safe-area support for notched phones:
```css
.safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }
.safe-area-pt { padding-top: env(safe-area-inset-top); }
```

---

## 11. Accessibility

- All icon-only buttons must have `aria-label` or `title`
- Color contrast: ensure primary purple `#7c5aed` on white meets WCAG AA (it does: 5.1:1)
- Focus visible: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`
- Keyboard navigation: dropdowns and modals must trap focus
- `prefers-reduced-motion`: wrap all Framer Motion animations with:

```tsx
// In motion.ts
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const pageTransitionProps = prefersReducedMotion
  ? {}
  : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, ... };
```

---

## 12. Implementation Order (Recommended)

Execute in this sequence to avoid cascading breaks:

1. **CSS variables** — add light theme to `globals.css` (non-breaking)
2. **Tailwind config** — add `purple` color and update font stack
3. **Store** — add `theme` field and `setTheme` action
4. **ThemeProvider** — create and add to `Providers`
5. **ThemeToggle component** — create
6. **LanguageSwitcher component** — create and wire to next-intl
7. **Login page** — full rewrite matching reference design
8. **TopBar + Sidebar** — add theme/language controls, update active state styles
9. **Surface utilities** — add `.surface-card` CSS classes
10. **Metric cards, list rows, badges** — update to use new surface utilities
11. **Settings page** — add Appearance card, fix Language card
12. **Onboarding** — add step progress indicator and animated transitions
13. **Polish pass** — micro-interactions, empty states, loading skeletons
14. **Accessibility audit** — aria-labels, focus rings, reduced motion

---

## 13. Files to Create / Modify

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/globals.css` |
| Modify | `frontend/tailwind.config.ts` |
| Modify | `frontend/src/app/layout.tsx` |
| Modify | `frontend/src/lib/store.ts` |
| Modify | `frontend/src/app/[locale]/providers.tsx` |
| Modify | `frontend/src/app/[locale]/login/page.tsx` |
| Modify | `frontend/src/app/[locale]/app/manager/layout.tsx` |
| Modify | `frontend/src/app/[locale]/app/owner/layout.tsx` |
| Modify | `frontend/src/app/[locale]/app/settings/page.tsx` |
| Modify | `frontend/src/app/[locale]/onboarding/page.tsx` |
| Modify | `frontend/src/components/layouts/top-bar.tsx` |
| Modify | `frontend/src/components/layouts/bottom-nav.tsx` |
| Modify | `frontend/src/components/shared/metric-card.tsx` |
| Modify | `frontend/src/components/shared/list-row.tsx` |
| Modify | `frontend/src/components/shared/status-badge.tsx` |
| Modify | `frontend/src/components/shared/empty-state.tsx` |
| Modify | `frontend/src/components/shared/loading-skeleton.tsx` |
| Modify | `frontend/src/lib/motion.ts` |
| **Create** | `frontend/src/components/providers/theme-provider.tsx` |
| **Create** | `frontend/src/components/shared/theme-toggle.tsx` |
| **Create** | `frontend/src/components/shared/language-switcher.tsx` |

---

## 14. Quality Checklist

Before considering the redesign complete, verify:

- [ ] Light mode is the default and matches reference app's whitespace and purple palette
- [ ] Dark mode matches existing SOYL brand (teal + ink)
- [ ] System mode follows OS preference
- [ ] Theme persists across page refreshes (Zustand persist)
- [ ] Language switcher actually changes the URL locale (`/en/`, `/hi/`, `/kn/`)
- [ ] Language preference persists in Zustand store
- [ ] Login page visually matches the reference app screenshot
- [ ] Desktop sidebar shows theme toggle and language switcher
- [ ] Mobile top bar shows compact theme toggle and language dropdown
- [ ] All pages transition smoothly with Framer Motion
- [ ] No layout shift on initial load (use `suppressHydrationWarning` on `<html>`)
- [ ] All icon-only buttons have `aria-label`
- [ ] Keyboard navigation works in dropdowns and dialogs
- [ ] Tested at 375px (iPhone SE), 390px (iPhone 15), 768px (tablet), 1280px (desktop)

---

## 15. Notes for the AI Agent

- **Do not** change any backend API calls or data shapes in `src/lib/mock-data.ts` or `src/lib/db.ts`
- **Do not** modify `src/i18n/routing.ts` or `src/middleware.ts` — the locale routing is already correct
- **Do not** change the existing dark-mode CSS variable values — only add the light-mode override block
- When writing Tailwind classes for theme-aware colors, prefer semantic tokens (`text-foreground`, `bg-card`, `border-border`, `text-primary`) over hard-coded color classes so both themes work automatically
- The `liquid-glass` and `glass-heavy` utility classes should be **preserved for dark mode only** — in light mode they should resolve to `bg-white shadow-sm border border-border/60` (you can do this with a CSS `@media` or `[data-theme]` selector override)
- Keep all existing `next-intl` translation keys — only add new ones for new UI strings (e.g., `settings.appearance`, `settings.theme.light`, `settings.theme.dark`, `settings.theme.system`)
- Add new i18n keys to all three files: `messages/en.json`, `messages/hi.json`, `messages/kn.json`
