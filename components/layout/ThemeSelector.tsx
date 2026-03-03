"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const COLOR_THEMES = [
  {
    id: "default",
    label: "Classique",
    colors: ["#2E1F3D", "#5B5470", "#D4907E", "#F0C5B3", "#FAF8F6"],
  },
  {
    id: "nature-vert",
    label: "Nature Vert",
    colors: ["#3B4F2F", "#8CB43D", "#8AAB17", "#C5CCA3", "#D4D4C8"],
  },
  {
    id: "botanique",
    label: "Botanique",
    colors: ["#2D6A4F", "#52B788", "#FEFAE0", "#F4C2C2", "#D4A373"],
  },
  {
    id: "sauge-douce",
    label: "Sauge Douce",
    colors: ["#4A6B5A", "#7C9885", "#A3B8A0", "#C5D5C5", "#E8F0E8"],
  },
] as const;

type ColorThemeId = (typeof COLOR_THEMES)[number]["id"];

function getStoredTheme(): ColorThemeId {
  if (typeof window === "undefined") return "default";
  return (localStorage.getItem("color-theme") as ColorThemeId) || "default";
}

function applyColorTheme(themeId: ColorThemeId) {
  const el = document.documentElement;
  if (themeId === "default") {
    el.removeAttribute("data-color-theme");
  } else {
    el.setAttribute("data-color-theme", themeId);
  }
  localStorage.setItem("color-theme", themeId);
}

export function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ColorThemeId>(getStoredTheme);
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selectTheme = useCallback((id: ColorThemeId) => {
    setActiveTheme(id);
    applyColorTheme(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]" ref={panelRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-[260px] bg-white dark:bg-[#222] rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 dark:text-white/40">
                Choisir un th&egrave;me
              </p>
            </div>
            <div className="px-2 pb-3 space-y-1">
              {COLOR_THEMES.map((theme) => {
                const isActive = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => selectTheme(theme.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-black/5 dark:bg-white/10"
                        : "hover:bg-black/[0.03] dark:hover:bg-white/5"
                    )}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-0.5 shrink-0">
                      {theme.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-7 first:rounded-l-md last:rounded-r-md"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {/* Label */}
                    <span className={cn(
                      "text-sm font-medium flex-1 text-left",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-black/60 dark:text-white/60"
                    )}>
                      {theme.label}
                    </span>
                    {/* Checkmark */}
                    {isActive && (
                      <Check className="w-4 h-4 text-black/50 dark:text-white/50 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-white dark:bg-[#222] shadow-lg border border-black/5 dark:border-white/10",
          "hover:shadow-xl hover:scale-105",
          open && "ring-2 ring-black/10 dark:ring-white/20"
        )}
        aria-label="Sélecteur de thème"
      >
        <Palette className="w-5 h-5 text-black/50 dark:text-white/50" />
      </button>
    </div>
  );
}
