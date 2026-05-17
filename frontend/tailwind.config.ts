import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        ink: "#030709",
        chalk: "#f8fcfd",
        teal: {
          DEFAULT: "#afd0cc",
          dim: "rgba(175,208,204,0.12)",
          glow: "rgba(175,208,204,0.20)",
        },
        plum: {
          DEFAULT: "#635467",
          dim: "rgba(99,84,103,0.18)",
        },
        surface: {
          1: "#0d1419",
          2: "#111d22",
          3: "#162028",
        },
        /* Legacy names → brand (v1 classnames still resolve) */
        navy: {
          900: "#030709",
          800: "#0d1419",
          700: "#111d22",
          600: "#162028",
          500: "#162028",
          400: "#1c2838",
          300: "#243844",
        },
        indigo: {
          DEFAULT: "#afd0cc",
          light: "#d4ebe8",
          glow: "rgba(175,208,204,0.20)",
        },
        emerald: {
          DEFAULT: "#afd0cc",
          light: "#d4ebe8",
          glow: "rgba(175,208,204,0.18)",
        },
        amber: {
          DEFAULT: "#c9a84c",
          light: "#dec07a",
        },
        purple: {
          DEFAULT: "#7c5aed",
          dim: "rgba(124,90,237,0.12)",
          glow: "rgba(124,90,237,0.22)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-indic)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "var(--font-indic)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.8rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["2rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.5rem", { lineHeight: "1.1" }],
        "5xl": ["3.25rem", { lineHeight: "1.05" }],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      spacing: {
        touch: "48px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        raised: "var(--shadow-raised)",
        glow: "var(--shadow-glow)",
        "glow-sm": "var(--shadow-glow-sm)",
        "glow-emerald": "0 0 20px rgba(175,208,204,0.16)",
        glass: "inset 0 1px 0 rgba(248,252,253,0.06), 0 4px 24px rgba(3,7,9,0.45)",
        soft: "0 12px 30px rgba(3,7,9,0.35)",
      },
      backgroundImage: {
        "teal-glow":
          "radial-gradient(ellipse at center, rgba(175,208,204,0.15) 0%, transparent 70%)",
        liquid:
          "linear-gradient(135deg, rgba(248,252,253,0.05) 0%, rgba(175,208,204,0.04) 50%, rgba(99,84,103,0.03) 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
