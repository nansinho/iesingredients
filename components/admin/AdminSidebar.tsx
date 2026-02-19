"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Newspaper,
  Mail,
  Sparkles,
  Droplets,
  Cookie,
  Users,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const navGroups = [
  {
    label: null,
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Gestion",
    items: [
      { label: "Demandes", href: "/admin/demandes", icon: ClipboardList },
      { label: "Messages", href: "/admin/contacts", icon: Mail },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Cosmétiques", href: "/admin/cosmetiques", icon: Sparkles },
      { label: "Parfums", href: "/admin/parfums", icon: Droplets },
      { label: "Arômes", href: "/admin/aromes", icon: Cookie },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Équipe", href: "/admin/equipe", icon: Users },
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: UserCog },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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

  const sidebar = (
    <div className="flex flex-col h-full bg-forest-950 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo-ies.png"
            alt="IES"
            width={120}
            height={40}
            className="h-8 w-auto brightness-0 invert"
          />
        </Link>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-gold-500/70">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={cn(groupIndex > 0 && "mt-6")}>
            {group.label && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={item.href as any}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.href, "end" in item ? item.end : undefined)
                      ? "bg-gold-500 text-forest-950 shadow-lg shadow-gold-500/20"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors group"
        >
          <ExternalLink className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Retour au site</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
        {sidebar}
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-forest-900 text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50">
            <div className="relative h-full">
              {sidebar}
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
