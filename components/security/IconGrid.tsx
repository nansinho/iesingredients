"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICON_COMPONENTS } from "@/lib/security/icons";

interface IconGridProps {
  grid: string[];
  onSelect: (iconId: string) => void;
  disabled: boolean;
}

export function IconGrid({ grid, onSelect, disabled }: IconGridProps) {
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className={cn(
              "aspect-square rounded-2xl flex items-center justify-center",
              "transition-all duration-200 cursor-pointer",
              "bg-brand-primary/[0.04] hover:bg-brand-accent/10",
              "border-2 border-brand-primary/10 hover:border-brand-accent/40",
              "hover:shadow-md",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <IconComponent
              className="w-7 h-7 text-brand-primary/60"
              strokeWidth={1.5}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
