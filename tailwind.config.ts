import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Forest green palette
        forest: {
          50: "hsl(var(--forest-50))",
          100: "hsl(var(--forest-100))",
          200: "hsl(var(--forest-200))",
          300: "hsl(var(--forest-300))",
          400: "hsl(var(--forest-400))",
          500: "hsl(var(--forest-500))",
          600: "hsl(var(--forest-600))",
          700: "hsl(var(--forest-700))",
          800: "hsl(var(--forest-800))",
          900: "hsl(var(--forest-900))",
          950: "hsl(var(--forest-950))",
        },
        // Gold palette
        gold: {
          50: "hsl(var(--gold-100))",
          100: "hsl(var(--gold-100))",
          200: "hsl(var(--gold-200))",
          300: "hsl(var(--gold-300))",
          400: "hsl(var(--gold-400))",
          500: "hsl(var(--gold-500))",
          600: "hsl(var(--gold-600))",
          700: "hsl(var(--gold-700))",
          800: "hsl(var(--gold-800))",
          900: "hsl(var(--gold-900))",
          950: "hsl(var(--gold-950))",
        },
        // Category colors with light variants
        cosmetique: {
          light: "hsl(var(--cosmetique-light))",
          DEFAULT: "hsl(var(--cosmetique))",
          dark: "hsl(var(--cosmetique-dark))",
        },
        parfum: {
          light: "hsl(var(--parfum-light))",
          DEFAULT: "hsl(var(--parfum))",
          dark: "hsl(var(--parfum-dark))",
        },
        arome: {
          light: "hsl(var(--arome-light))",
          DEFAULT: "hsl(var(--arome))",
          dark: "hsl(var(--arome-dark))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display-lg": ["4rem", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1", letterSpacing: "-0.01em" }],
        "display-sm": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        luxury: "0.15em",
        widest: "0.1em",
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
        reveal: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        kenburns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.15)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        reveal: "reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        kenburns: "kenburns 8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
