"use client";

import { useColorTheme, type ColorTheme } from "./ColorThemeProvider";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const themes: { id: ColorTheme; label: string; preview: string[] }[] = [
  {
    id: "classic",
    label: "Classique",
    preview: ["#a37b68", "#febe98", "#bcb0cf", "#808866"],
  },
  {
    id: "pastel",
    label: "Pastel Vibrant",
    preview: ["#B4A7D6", "#E8A0BF", "#F0E068", "#92AAD0"],
  },
  {
    id: "neon",
    label: "Neon",
    preview: ["#06B6D4", "#F472B6", "#10B981", "#A78BFA"],
  },
  {
    id: "rosegold",
    label: "Rose Gold",
    preview: ["#B76E79", "#F0B8A8", "#B8860B", "#D4A0B0"],
  },
];

export function ColorThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-[100]">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-brown text-cream-light hover:scale-110 hover:shadow-xl",
          "dark:bg-cream-light dark:text-dark"
        )}
        aria-label="Changer la palette de couleurs"
      >
        <Palette className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-brown/10 dark:border-cream-light/10 p-4 w-60 animate-scale-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-dark/40 dark:text-cream-light/40 mb-3">
            Palette de couleurs
          </p>
          <div className="space-y-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setColorTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  colorTheme === t.id
                    ? "bg-brown/10 dark:bg-cream-light/10 ring-1 ring-brown/20 dark:ring-cream-light/20"
                    : "hover:bg-brown/5 dark:hover:bg-cream-light/5"
                )}
              >
                <div className="flex gap-1">
                  {t.preview.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-dark/10 dark:border-cream-light/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-dark dark:text-cream-light">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
