import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface StarRatingInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showNumericInput?: boolean;
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
  showNumericInput = true,
}: StarRatingInputProps) {
  const handleClick = (rating: number) => {
    if (disabled) return;
    // If clicking the same rating, clear it
    onChange(rating === value ? null : rating);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      onChange(null);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= max) {
      onChange(num);
    } else if (!isNaN(num) && num < 1) {
      onChange(1);
    } else if (!isNaN(num) && num > max) {
      onChange(max);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showNumericInput && (
        <Input
          type="number"
          min={1}
          max={max}
          value={value ?? ""}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-14 h-8 text-center text-sm"
          placeholder="-"
        />
      )}
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
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/50"
                )}
              />
            </button>
          );
        })}
      </div>
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
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/50"
            )}
          />
        );
      })}
    </div>
  );
}
