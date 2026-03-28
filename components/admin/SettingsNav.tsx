"use client";

import { usePathname, Link } from "@/i18n/routing";
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

  const isActive = (href: string, end?: boolean) => {
    if (end) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-1">
      {settingsItems.map((item) => (
        <Link
          key={item.href}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          href={item.href as any}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            isActive(item.href, "end" in item ? item.end : undefined)
              ? "bg-brand-primary text-white shadow-sm"
              : "text-brand-secondary/70 hover:text-brand-primary hover:bg-brand-primary/5"
          )}
        >
          <item.icon className="w-4 h-4 shrink-0" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
