"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number | null;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showEmpty?: boolean;
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  color = "#D4907E",
  showEmpty = true,
}: StarRatingProps) {
  if (rating === null || rating === undefined) return null;

  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-4.5 h-4.5";

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} sur ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < rating;
        if (!filled && !showEmpty) return null;
        return (
          <Star
            key={i}
            className={cn(
              sizeClass,
              filled ? "fill-current" : "text-gray-200"
            )}
            style={filled ? { color } : undefined}
          />
        );
      })}
    </div>
  );
}
