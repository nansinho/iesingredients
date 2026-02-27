"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  ArrowRight,
  User,
  LogOut,
  Shield,
  Sun,
  Moon,
  Leaf,
  FlaskConical,
  Droplets,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SampleCartSheet } from "@/components/cart/SampleCartSheet";
import { useTheme } from "next-themes";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/* ────────────────────────────────────────
   Mega-menu data — 3 category columns
   ──────────────────────────────────────── */
const catalogColumns = [
  {
    id: "cosmetique",
    titleKey: "cosmetic" as const,
    icon: Leaf,
    accent: "#2D4A3E",
    subKeys: ["cosmeticSub1", "cosmeticSub2", "cosmeticSub3", "cosmeticSub4"] as const,
  },
  {
    id: "parfum",
    titleKey: "perfume" as const,
    icon: FlaskConical,
    accent: "#8B6A50",
    subKeys: ["perfumeSub1", "perfumeSub2", "perfumeSub3", "perfumeSub4"] as const,
  },
  {
    id: "arome",
    titleKey: "aroma" as const,
    icon: Droplets,
    accent: "#C4A882",
    subKeys: ["aromaSub1", "aromaSub2", "aromaSub3", "aromaSub4"] as const,
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");
  const cat = useTranslations("categories");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
          searchInputRef.current?.focus();
        } else {
          setSearchOpen((prev) => !prev);
        }
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const checkAdmin = async (userId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("user_roles") as any)
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsUserAdmin(data !== null);
    };
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) checkAdmin(user.id);
      else setIsUserAdmin(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) checkAdmin(currentUser.id);
      else setIsUserAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const closeMenus = useCallback(() => {
    setMegaOpen(false);
    setIsOpen(false);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsUserAdmin(false);
    router.refresh();
  };

  const navItems = [
    { label: t("company"), href: "/entreprise" as const },
    { label: t("team"), href: "/equipe" as const },
    { label: t("news"), href: "/actualites" as const },
    { label: t("podcast"), href: "/podcast" as const },
    { label: t("contact"), href: "/contact" as const },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: newLocale });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  const openMega = useCallback(() => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(megaTimeout.current);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(
        `/catalogue?search=${encodeURIComponent(searchValue.trim())}` as any // eslint-disable-line @typescript-eslint/no-explicit-any
      );
      setSearchValue("");
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1A1A1A]",
          isScrolled && "shadow-[0_1px_12px_rgba(0,0,0,0.3)] border-b border-white/5"
        )}
      >
        {/* ═══════════════════════════════════════
           Row 1 — Logo | Search Bar | Actions
           ═══════════════════════════════════════ */}
        <div className="w-[94%] mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo-ies.png"
                alt="IES Ingredients"
                width={130}
                height={52}
                priority
                className="h-9 md:h-10 w-auto transition-all duration-300 brightness-0 invert"
              />
            </Link>

            {/* Search Bar — prominent, centered */}
            <div className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30 group-focus-within:text-white/60 transition-colors duration-200" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t("searchPlaceholder")}
                  className={cn(
                    "w-full h-11 pl-11 pr-16 text-sm rounded-full",
                    "bg-white/8",
                    "border border-white/10",
                    "placeholder:text-white/30",
                    "text-white",
                    "focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive/40",
                    "hover:bg-white/10",
                    "transition-all duration-300"
                  )}
                />
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 bg-white/8 px-2 py-0.5 rounded-md font-mono pointer-events-none">
                  {"\u2318"}K
                </kbd>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Language */}
              <button
                onClick={toggleLanguage}
                className="hidden lg:flex px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 text-white/40 hover:text-white hover:bg-white/10"
              >
                {locale === "fr" ? "EN" : "FR"}
              </button>

              {/* Dark Mode */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="hidden lg:flex p-2 rounded-full transition-all duration-200 text-white/35 hover:text-white hover:bg-white/10"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* User */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden lg:flex p-2 rounded-full transition-all duration-200 text-white/35 hover:text-white hover:bg-white/10">
                      <User className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link href="/mon-compte" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        {t("myProfile")}
                      </Link>
                    </DropdownMenuItem>
                    {isUserAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Shield className="w-4 h-4 mr-2" />
                            {t("admin")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {!isUserAdmin && <DropdownMenuSeparator />}
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden lg:flex">
                  <button className="p-2 rounded-full transition-all duration-200 text-white/35 hover:text-white hover:bg-white/10">
                    <User className="w-4 h-4" />
                  </button>
                </Link>
              )}

              {/* Cart */}
              <div className="[&_button]:text-white/40 [&_button]:hover:text-white">
                <SampleCartSheet />
              </div>

              {/* CTA — elegant pill */}
              <Link href="/contact" className="hidden lg:flex ml-1">
                <button className="inline-flex items-center gap-2 h-10 px-6 text-sm font-medium rounded-full bg-olive text-white hover:bg-olive-dark transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-olive/15">
                  {t("requestQuote")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-2 rounded-full transition-colors duration-200 text-white/50 hover:text-white hover:bg-white/10"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <button
                    className="p-2 rounded-full transition-colors duration-200 ml-0.5 text-white/50 hover:text-white hover:bg-white/10"
                    aria-label="Menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm bg-cream-light border-dark/5 p-0">
                  <div className="p-6 h-full flex flex-col overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <Image
                        src="/images/logo-ies.png"
                        alt="IES Ingredients"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                      />
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-dark/30 hover:text-dark rounded-full hover:bg-dark/5 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                        <input
                          type="text"
                          placeholder={t("searchPlaceholder")}
                          className={cn(
                            "w-full h-11 pl-9 pr-4 text-sm rounded-xl",
                            "bg-white",
                            "border border-dark/8",
                            "placeholder:text-dark/35",
                            "text-dark",
                            "focus:outline-none focus:ring-2 focus:ring-olive/20"
                          )}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              router.push(
                                `/catalogue?search=${encodeURIComponent(e.currentTarget.value.trim())}` as any // eslint-disable-line @typescript-eslint/no-explicit-any
                              );
                              setIsOpen(false);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Mobile Nav */}
                    <nav className="flex flex-col gap-0.5 flex-1">
                      <div>
                        <button
                          onClick={() =>
                            setMobileExpandedCat(mobileExpandedCat === "catalogue" ? null : "catalogue")
                          }
                          className={cn(
                            "w-full py-3 px-4 rounded-xl text-base font-medium transition-all duration-200 flex items-center justify-between",
                            pathname === "/catalogue"
                              ? "bg-olive/10 text-olive border border-olive/20"
                              : "text-dark/60 hover:text-dark hover:bg-dark/5"
                          )}
                        >
                          <span>{t("catalog")}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              mobileExpandedCat === "catalogue" && "rotate-180"
                            )}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileExpandedCat === "catalogue" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pt-1 pb-2 space-y-3">
                                <Link
                                  href="/catalogue"
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-olive hover:bg-dark/5 transition-colors"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                  {t("allProducts")}
                                </Link>
                                {catalogColumns.map((col) => {
                                  const Icon = col.icon;
                                  return (
                                    <div key={col.id}>
                                      <Link
                                        href={{ pathname: "/catalogue", query: { category: col.id } }}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 py-1.5 px-3 text-[13px] font-semibold uppercase tracking-wider"
                                        style={{ color: col.accent }}
                                      >
                                        <Icon className="w-3.5 h-3.5" />
                                        {cat(col.titleKey)}
                                      </Link>
                                      <div className="ml-3 mt-1 space-y-0.5">
                                        {col.subKeys.map((subKey) => (
                                          <Link
                                            key={subKey}
                                            href={{ pathname: "/catalogue", query: { category: col.id } }}
                                            onClick={() => setIsOpen(false)}
                                            className="block py-1.5 px-3 text-sm text-dark/45 hover:text-dark transition-colors rounded-lg hover:bg-dark/5"
                                          >
                                            {t(subKey)}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "py-3 px-4 rounded-xl text-base font-medium transition-all duration-200 flex items-center justify-between group",
                                isActive
                                  ? "bg-olive/10 text-olive border border-olive/20"
                                  : "text-dark/60 hover:text-dark hover:bg-dark/5"
                              )}
                            >
                              <span>{item.label}</span>
                              <ArrowRight
                                className={cn(
                                  "w-4 h-4 transition-all duration-200",
                                  isActive
                                    ? "opacity-100 text-olive"
                                    : "opacity-0 group-hover:opacity-50 group-hover:translate-x-1"
                                )}
                              />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>

                    {/* Mobile Footer */}
                    <div className="pt-6 border-t border-dark/8">
                      {user ? (
                        <div className="space-y-2">
                          <Link href="/mon-compte" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full h-11 rounded-xl border-dark/10 text-dark/60 hover:bg-dark/5">
                              <User className="w-4 h-4 mr-2" />
                              {t("myProfile")}
                            </Button>
                          </Link>
                          {isUserAdmin && (
                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                              <Button variant="outline" className="w-full h-11 rounded-xl border-dark/10 text-dark/60 hover:bg-dark/5">
                                <Shield className="w-4 h-4 mr-2" />
                                {t("admin")}
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => { handleSignOut(); setIsOpen(false); }}
                            className="w-full h-11 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            {t("signOut")}
                          </Button>
                        </div>
                      ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full h-11 rounded-xl border-dark/10 text-dark/60 hover:bg-dark/5">
                            <User className="w-4 h-4 mr-2" />
                            {t("signIn")}
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div className="pt-4">
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <button className="w-full h-12 rounded-full bg-olive text-white hover:bg-olive-dark font-medium text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2">
                          {t("requestQuote")}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <button
                          onClick={() => { toggleLanguage(); setIsOpen(false); }}
                          className="py-2 text-sm text-dark/35 hover:text-dark/60 transition-colors"
                        >
                          {locale === "fr" ? t("englishVersion") : t("frenchVersion")}
                        </button>
                        {mounted && (
                          <button
                            onClick={toggleTheme}
                            className="p-2 text-dark/35 hover:text-dark/60 transition-colors rounded-full"
                          >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
           Row 2 — Centered Navigation Links
           ═══════════════════════════════════════ */}
        <div
          className="hidden lg:block border-t border-white/8 transition-all duration-300"
        >
          <div className="w-[94%] mx-auto">
            <nav className="flex items-center justify-center h-11 gap-1">
              {/* Catalogue — mega-menu trigger */}
              <div
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  ref={megaTriggerRef}
                  className={cn(
                    "inline-flex items-center gap-1 px-4 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-full relative",
                    megaOpen || pathname === "/catalogue"
                      ? "text-white font-semibold"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {t("catalog")}
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      megaOpen && "rotate-180"
                    )}
                  />
                  {(megaOpen || pathname === "/catalogue") && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-olive rounded-full"
                    />
                  )}
                </button>
              </div>

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "relative px-4 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-full inline-block",
                        isActive
                          ? "text-white font-semibold"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-olive rounded-full"
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ═══════════════════════════════════════
           Desktop Mega-menu
           ═══════════════════════════════════════ */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              ref={megaRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute top-full left-0 right-0 z-40"
              onMouseEnter={cancelClose}
              onMouseLeave={closeMega}
            >
              <div className="bg-white/98 backdrop-blur-xl border-t border-b border-dark/5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="w-[94%] mx-auto py-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark/5">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-dark/30">
                      {t("catalogueMenu")}
                    </span>
                    <Link
                      href="/catalogue"
                      onClick={closeMenus}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark transition-colors"
                    >
                      {t("allProducts")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    {catalogColumns.map((col) => {
                      const Icon = col.icon;
                      return (
                        <div key={col.id} className="group/col">
                          <Link
                            href={{ pathname: "/catalogue", query: { category: col.id } }}
                            onClick={closeMenus}
                            className="flex items-center gap-2.5 mb-4 group/link"
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover/link:scale-110"
                              style={{ background: `${col.accent}12` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: col.accent }} />
                            </div>
                            <span className="text-lg font-bold tracking-[-0.01em]" style={{ color: col.accent }}>
                              {cat(col.titleKey)}
                            </span>
                            <ChevronRight
                              className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/link:opacity-60 group-hover/link:translate-x-0 transition-all duration-200"
                              style={{ color: col.accent }}
                            />
                          </Link>
                          <ul className="space-y-0.5">
                            {col.subKeys.map((subKey) => (
                              <li key={subKey}>
                                <Link
                                  href={{ pathname: "/catalogue", query: { category: col.id } }}
                                  onClick={closeMenus}
                                  className="block py-2 px-3 -mx-3 rounded-lg text-[13.5px] text-dark/45 hover:text-dark hover:bg-dark/[0.03] transition-all duration-150"
                                >
                                  {t(subKey)}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href={{ pathname: "/catalogue", query: { category: col.id } }}
                                onClick={closeMenus}
                                className="inline-flex items-center gap-1 mt-2 py-1 text-[13px] font-medium transition-all duration-200 hover:gap-2"
                                style={{ color: col.accent }}
                              >
                                {t("viewAll")}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mega-menu overlay */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 hidden lg:block"
            style={{ top: isScrolled ? "72px" : "108px" }}
            onClick={closeMenus}
          />
        )}
      </AnimatePresence>

      {/* Search Overlay (mobile) */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-[60]"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[61] px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-dark/5 overflow-hidden">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-dark/30" />
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="w-full h-14 pl-12 pr-4 text-base bg-transparent outline-none placeholder:text-dark/35 text-dark"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        router.push(
                          `/catalogue?search=${encodeURIComponent(e.currentTarget.value)}` as any // eslint-disable-line @typescript-eslint/no-explicit-any
                        );
                        setSearchOpen(false);
                      }
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                  />
                  <kbd className="absolute right-4 text-xs text-dark/30 bg-cream px-2 py-1 rounded-md font-mono">
                    ESC
                  </kbd>
                </div>
                <div className="border-t border-dark/5 px-4 py-3">
                  <p className="text-xs text-dark/35">
                    {locale === "fr" ? "Appuyez sur Entrée pour rechercher" : "Press Enter to search"}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
