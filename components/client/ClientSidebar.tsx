"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ClientShell";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const navGroups = [
  {
    label: null,
    items: [
      { label: "Tableau de bord", href: "/espace-client", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Mon espace",
    items: [
      { label: "Mes demandes", href: "/espace-client/demandes", icon: ClipboardList },
      { label: "Support", href: "/espace-client/support", icon: LifeBuoy },
    ],
  },
];

export function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push("/" as any);
  };

  const isActive = (href: string, end?: boolean) => {
    if (end) return pathname === href;
    return pathname.startsWith(href);
  };

  const navLink = (item: { label: string; href: string; icon: React.ElementType; end?: boolean }) => {
    const active = isActive(item.href, item.end);
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
            setIsOpen(false);
            startTransition(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              router.push(item.href as any);
            });
          } else {
            setIsOpen(false);
          }
        }}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
          collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
          active
            ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
            : loading
              ? "bg-white/15 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        <item.icon className={cn("w-5 h-5 shrink-0", loading && "animate-pulse")} />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex flex-col h-full bg-brand-primary text-white">
      {/* Logo */}
      <div className={cn("border-b border-white/10", isCollapsed ? "p-3 flex justify-center" : "p-6")}>
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-ies.png"
            alt="IES"
            width={isCollapsed ? 32 : 120}
            height={isCollapsed ? 32 : 40}
            className={cn(isCollapsed ? "h-7 w-7 object-contain" : "h-8 w-auto", "brightness-0 invert")}
          />
        </Link>
        {!isCollapsed && (
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-brand-accent-light">
            Espace client
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")}>
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={cn(groupIndex > 0 && "mt-6")}>
            {group.label && !isCollapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {group.label}
              </p>
            )}
            {group.label && isCollapsed && (
              <div className="my-3 mx-2 border-t border-white/10" />
            )}
            <div className="space-y-1">
              {group.items.map((item) => navLink(item))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block px-2 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          title={collapsed ? "Agrandir" : "Réduire"}
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Footer */}
      <div className={cn("border-t border-white/10 space-y-1", isCollapsed ? "p-2" : "p-4")}>
        <Link
          href="/"
          className={cn(
            "flex items-center rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors group",
            isCollapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2.5"
          )}
          title={isCollapsed ? "Retour au site" : undefined}
        >
          <ExternalLink className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          {!isCollapsed && <span>Retour au site</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full",
            isCollapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2.5"
          )}
          title={isCollapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent(collapsed)}
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-brand-primary text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay — always expanded */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50">
            <div className="relative h-full">
              {sidebarContent(false)}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
