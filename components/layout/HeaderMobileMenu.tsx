"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  X,
  ArrowRight,
  User,
  LogOut,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { catalogColumns, socialLinks } from "@/components/layout/header-nav";

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  isUserAdmin: boolean;
  onSignOut: () => void;
  onToggleLanguage: () => void;
}

export function HeaderMobileMenu({
  isOpen,
  onClose,
  user,
  isUserAdmin,
  onSignOut,
  onToggleLanguage,
}: HeaderMobileMenuProps) {
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const cat = useTranslations("categories");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = theme === "dark";

  const homeItem = { label: t("home"), href: "/" as const };

  const navItems = [
    { label: t("company"), href: "/entreprise" as const },
    { label: t("team"), href: "/equipe" as const },
    { label: t("news"), href: "/actualites" as const },
    { label: t("podcast"), href: "/podcast" as const },
    { label: t("contact"), href: "/contact" as const },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 350 }}
            className="absolute inset-y-0 right-0 w-full sm:max-w-[440px] bg-brand-primary flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 h-16 shrink-0 border-b border-white/10">
              <Image
                src="/images/logo-ies.png"
                alt="IES Ingredients"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
                aria-label="Fermer le menu"
                autoFocus
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <nav className="px-6 pt-2 pb-6">
                {/* Accueil */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={homeItem.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between py-4 border-b border-white/10 transition-colors",
                      pathname === homeItem.href
                        ? "text-white font-semibold"
                        : "text-white/70 active:text-white"
                    )}
                  >
                    <span className="text-lg">{homeItem.label}</span>
                    {pathname === homeItem.href && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    )}
                  </Link>
                </motion.div>

                {/* Catalogue (expandable) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() =>
                      setMobileExpandedCat(mobileExpandedCat === "catalogue" ? null : "catalogue")
                    }
                    className={cn(
                      "w-full flex items-center justify-between py-4 border-b border-white/10 transition-colors",
                      pathname?.startsWith("/catalogue")
                        ? "text-white font-semibold"
                        : "text-white/70 active:text-white"
                    )}
                  >
                    <span className="text-lg">{t("catalog")}</span>
                    <motion.div
                      animate={{ rotate: mobileExpandedCat === "catalogue" ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {mobileExpandedCat === "catalogue" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pb-4 space-y-2.5">
                          {/* All products link */}
                          <Link
                            href="/catalogue"
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-brand-accent rounded-xl hover:bg-white/5 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            {t("allProducts")}
                          </Link>

                          {/* Category Cards */}
                          {catalogColumns.map((col, i) => {
                            const Icon = col.icon;
                            return (
                              <motion.div
                                key={col.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: i * 0.06,
                                  duration: 0.3,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                <Link
                                  href={
                                    col.id === "cosmetique"
                                      ? "/catalogue/cosmetique"
                                      : col.id === "parfum"
                                        ? "/catalogue/parfumerie"
                                        : "/catalogue/aromes"
                                  }
                                  onClick={onClose}
                                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/8 border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-200 active:scale-[0.98]"
                                >
                                  <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${col.accent}30` }}
                                  >
                                    <Icon className="w-5 h-5" style={{ color: col.accent }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold block text-white">
                                      {cat(col.titleKey)}
                                    </span>
                                    <span className="text-xs text-white/50 mt-0.5 block truncate">
                                      {col.subKeys.slice(0, 2).map((k) => t(k)).join(" · ")}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Other nav items */}
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.16 + index * 0.04,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between py-4 transition-colors",
                          index < navItems.length - 1 && "border-b border-white/10",
                          isActive
                            ? "text-white font-semibold"
                            : "text-white/70 active:text-white"
                        )}
                      >
                        <span className="text-lg">{item.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* ── User Section ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="mt-6 pt-4 border-t border-white/10"
                >
                  {user ? (
                    <div className="space-y-1">
                      <Link
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        href={"/espace-client" as any}
                        onClick={onClose}
                        className="flex items-center gap-3 py-3 px-1 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {t("myProfile")}
                      </Link>
                      {isUserAdmin && (
                        <Link
                          href="/admin"
                          onClick={onClose}
                          className="flex items-center gap-3 py-3 px-1 text-sm text-white/60 hover:text-white transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          {t("admin")}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          onSignOut();
                          onClose();
                        }}
                        className="flex items-center gap-3 py-3 px-1 text-sm text-red-300/70 hover:text-red-200 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("signOut")}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex items-center gap-3 py-3 px-1 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t("signIn")}
                    </Link>
                  )}
                </motion.div>
              </nav>
            </div>

            {/* ── Fixed Footer ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 px-6 pt-4 pb-6 border-t border-white/10"
              style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            >
              <Link href="/contact" onClick={onClose}>
                <button className="w-full h-14 rounded-2xl bg-brand-accent text-white hover:bg-brand-accent-hover font-semibold text-sm shadow-lg shadow-brand-accent/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]">
                  {t("requestQuote")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <div className="flex items-center justify-between mt-4">
                {/* Social links */}
                <div className="flex items-center gap-0.5">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="p-2 rounded-full text-white/40 hover:text-white/70 transition-colors"
                      >
                        <SocialIcon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>

                {/* Language & Theme */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => {
                      onToggleLanguage();
                      onClose();
                    }}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
                  >
                    {locale === "fr" ? "EN" : "FR"}
                  </button>
                  {mounted && (
                    <button
                      onClick={() => setTheme(isDark ? "light" : "dark")}
                      className="p-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
                      aria-label={isDark ? "Mode clair" : "Mode sombre"}
                    >
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
