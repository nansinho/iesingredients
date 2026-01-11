import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = "md",
  disabled = false,
}: StarRatingInputProps) {
  const handleClick = (rating: number) => {
    if (disabled) return;
    // If clicking the same rating, clear it
    onChange(rating === value ? null : rating);
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const rating = i + 1;
        const isFilled = value !== null && rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            disabled={disabled}
            className={cn(
              "p-0.5 rounded transition-all",
              !disabled && "hover:scale-110 cursor-pointer",
              disabled && "cursor-default opacity-60"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled
                  ? "fill-gold text-gold"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// Display-only version for read-only contexts
export function StarRatingDisplay({
  value,
  max = 5,
  size = "md",
}: {
  value: number | null;
  max?: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const rating = i + 1;
        const isFilled = value !== null && rating <= value;

        return (
          <Star
            key={rating}
            className={cn(
              sizeClasses[size],
              isFilled
                ? "fill-gold text-gold"
                : "fill-transparent text-muted-foreground/40"
            )}
          />
        );
      })}
    </div>
  );
}
