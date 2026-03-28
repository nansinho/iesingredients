"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICON_COMPONENTS } from "@/lib/security/icons";

interface IconGridProps {
  grid: string[];
  onSelect: (iconId: string) => void;
  disabled: boolean;
  variant?: "light" | "dark";
}

export function IconGrid({ grid, onSelect, disabled, variant = "light" }: IconGridProps) {
  const isDark = variant === "dark";

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {grid.map((iconId, index) => {
        const IconComponent = ICON_COMPONENTS[iconId];
        if (!IconComponent) return null;

        return (
          <motion.button
            key={`${iconId}-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(iconId)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className={cn(
              "aspect-square rounded-xl flex items-center justify-center",
              "transition-all duration-200 cursor-pointer",
              "border-2",
              isDark
                ? "bg-white/[0.05] border-white/10 hover:bg-white/[0.1] hover:border-brand-accent/40"
                : "bg-white/80 border-brand-primary/[0.07] hover:bg-brand-accent/[0.06] hover:border-brand-accent/30",
              "hover:shadow-sm",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <IconComponent
              className={cn(
                "w-6 h-6",
                isDark
                  ? "text-white/50"
                  : "text-brand-primary/50"
              )}
              strokeWidth={1.5}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
