import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "info" | "cosmetique" | "parfum" | "arome";
  to?: string | null;
  isLoading?: boolean;
}

const variantStyles = {
  default: {
    card: "bg-card",
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  warning: {
    card: "bg-orange-500/5 dark:bg-orange-500/10",
    icon: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
    value: "text-orange-700 dark:text-orange-400",
  },
  success: {
    card: "bg-green-500/5 dark:bg-green-500/10",
    icon: "bg-green-500/20 text-green-600 dark:text-green-400",
    value: "text-green-700 dark:text-green-400",
  },
  info: {
    card: "bg-blue-500/5 dark:bg-blue-500/10",
    icon: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-400",
  },
  cosmetique: {
    card: "bg-cosmetique/5 dark:bg-cosmetique/10",
    icon: "bg-cosmetique/20 text-cosmetique",
    value: "text-cosmetique",
  },
  parfum: {
    card: "bg-parfum/5 dark:bg-parfum/10",
    icon: "bg-parfum/20 text-parfum",
    value: "text-parfum",
  },
  arome: {
    card: "bg-arome/5 dark:bg-arome/10",
    icon: "bg-arome/20 text-arome",
    value: "text-arome",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  to,
  isLoading = false,
}: StatCardProps) {
  const styles = variantStyles[variant];

  const content = (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 md:p-5 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        styles.card
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          ) : (
            <p className={cn("text-2xl md:text-3xl font-bold tracking-tight", styles.value)}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg shrink-0", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <NavLink to={to} className="block focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl">
        {content}
      </NavLink>
    );
  }

  return content;
}
