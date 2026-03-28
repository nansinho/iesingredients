"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Settings, Tag, Plug, Wrench } from "lucide-react";

const settingsItems = [
  { label: "Général", href: "/admin/settings", icon: Settings, end: true },
  { label: "Catégories", href: "/admin/settings/categories", icon: Tag },
  { label: "Connecteurs", href: "/admin/settings/connectors", icon: Plug },
  { label: "Maintenance", href: "/admin/settings/maintenance", icon: Wrench },
];

export function SettingsNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const isActive = (href: string, end?: boolean) => {
    if (end) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1">
      {settingsItems.map((item) => {
        const active = isActive(item.href, "end" in item ? item.end : undefined);
        const loading = isPending && pendingHref === item.href;
        return (
          <Link
            key={item.href}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            href={item.href as any}
            onClick={(e) => {
              if (!active) {
                e.preventDefault();
                setPendingHref(item.href);
                startTransition(() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  router.push(item.href as any);
                });
              }
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-brand-primary text-white shadow-sm"
                : loading
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-brand-secondary/70 hover:text-brand-primary hover:bg-brand-primary/5"
            )}
          >
            <item.icon className={cn("w-4 h-4 shrink-0", loading && "animate-pulse")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
