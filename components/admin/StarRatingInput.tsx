"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number | null;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md";
  color?: string;
}

export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = "md",
  color = "#D4907E",
}: StarRatingInputProps) {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = value !== null && i < value;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1 === value ? 0 : i + 1)}
            className={cn(
              "transition-colors",
              starSize,
              filled ? "text-current" : "text-gray-200 hover:text-gray-300"
            )}
            style={filled ? { color } : undefined}
          >
            <Star className={cn("w-full h-full", filled && "fill-current")} />
          </button>
        );
      })}
    </div>
  );
}
