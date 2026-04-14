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
  Instagram,
  Linkedin,
} from "lucide-react";
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
const socialLinks = [
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/ies_ingredients/", color: "#E1306C" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/company/ies-ingredients/", color: "#0A66C2" },
];

const catalogColumns = [
  {
    id: "cosmetique",
    titleKey: "cosmetic" as const,
    icon: Leaf,
    accent: "#5B7B6B",
    subKeys: ["cosmeticSub1", "cosmeticSub2", "cosmeticSub3", "cosmeticSub4"] as const,
  },
  {
    id: "parfum",
    titleKey: "perfume" as const,
    icon: FlaskConical,
    accent: "#8B6A80",
    subKeys: ["perfumeSub1", "perfumeSub2", "perfumeSub3", "perfumeSub4"] as const,
  },
  {
    id: "arome",
    titleKey: "aroma" as const,
    icon: Droplets,
    accent: "#D4907E",
    subKeys: ["aromaSub1", "aromaSub2", "aromaSub3", "aromaSub4"] as const,
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
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
        setIsOpen(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const homeItem = { label: t("home"), href: "/" as const };

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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-brand-primary",
          isScrolled && "shadow-[0_1px_12px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* ═══════════════════════════════════════
           Row 1 — Logo | Search Bar | Actions
           ═══════════════════════════════════════ */}
        <div className="w-[94%] mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4 lg:gap-8">
            {/* Logo + Social icons */}
            <div className="flex items-center gap-3 shrink-0 lg:w-[220px]">
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
              <div className="hidden lg:flex items-center gap-0.5 ml-1">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="p-1.5 rounded-full text-white/30 hover:text-white transition-all duration-200 hover:bg-white/10"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Search Bar — truly centered */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="relative w-full max-w-2xl group">
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
                    "focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent/40",
                    "hover:bg-white/10",
                    "transition-all duration-300"
                  )}
                />
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 bg-white/8 px-2 py-0.5 rounded-md font-mono pointer-events-none">
                  {"\u2318"}K
                </kbd>
              </div>
            </div>

            {/* Right — CTA only on desktop + mobile buttons */}
            <div className="flex items-center gap-1.5 shrink-0 lg:w-[220px] lg:justify-end">
              {/* CTA buttons (desktop) */}
              <Link href="/catalogue" className="hidden lg:flex">
                <button className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-full border border-white/20 text-white hover:bg-white/10 transition-all duration-300">
                  {t("catalog")}
                </button>
              </Link>
              <Link href="/contact" className="hidden lg:flex">
                <button className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium rounded-full bg-brand-accent text-white hover:bg-brand-accent-hover transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-brand-accent/20">
                  {t("requestQuote")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              {/* Cart (mobile only — desktop cart moves to Row 2) */}
              <div className="lg:hidden [&_button]:text-white/40 [&_button]:hover:text-white">
                <SampleCartSheet />
              </div>

              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-2 rounded-full transition-colors duration-200 text-white/50 hover:text-white hover:bg-white/10"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 rounded-full transition-colors duration-200 ml-0.5 text-white/50 hover:text-white hover:bg-white/10"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
           Row 2 — Centered Navigation Links
           ═══════════════════════════════════════ */}
        <div
          className="hidden lg:block border-t border-white/8 transition-all duration-300"
        >
          <div className="w-[94%] mx-auto flex items-center justify-between h-11">
            {/* Left spacer for centering */}
            <div className="w-[180px]" />

            {/* Center — Nav links */}
            <nav className="flex items-center gap-1" onMouseLeave={() => setHoveredNav(null)}>
              {/* Accueil — before Catalogue */}
              <Link href={homeItem.href} onMouseEnter={() => setHoveredNav(homeItem.href)}>
                <span
                  className={cn(
                    "relative px-4 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-full inline-block",
                    pathname === homeItem.href || hoveredNav === homeItem.href
                      ? "text-white font-semibold"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {homeItem.label}
                  {(hoveredNav ? hoveredNav === homeItem.href : pathname === homeItem.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-accent rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </span>
              </Link>

              {/* Catalogue — mega-menu trigger */}
              <div
                className="relative"
                onMouseEnter={() => { openMega(); setHoveredNav("/catalogue"); }}
                onMouseLeave={() => { closeMega(); setHoveredNav(null); }}
              >
                <button
                  ref={megaTriggerRef}
                  className={cn(
                    "inline-flex items-center gap-1 px-4 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-full relative",
                    megaOpen || pathname === "/catalogue" || hoveredNav === "/catalogue"
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
                  {(hoveredNav ? hoveredNav === "/catalogue" : (megaOpen || pathname === "/catalogue")) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-accent rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const showIndicator = hoveredNav ? hoveredNav === item.href : isActive;
                return (
                  <Link key={item.href} href={item.href} onMouseEnter={() => setHoveredNav(item.href)}>
                    <span
                      className={cn(
                        "relative px-4 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-full inline-block",
                        isActive || hoveredNav === item.href
                          ? "text-white font-semibold"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      {item.label}
                      {showIndicator && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-accent rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right — Utility icons */}
            <div className="flex items-center gap-1 w-[180px] justify-end">
              {/* Language */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 text-white/40 hover:text-white hover:bg-white/10"
              >
                {locale === "fr" ? "EN" : "FR"}
              </button>

              {/* Dark Mode */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-all duration-200 text-white/35 hover:text-white hover:bg-white/10"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* User */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full transition-all duration-200 text-white/35 hover:text-white hover:bg-white/10">
                      <User className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link href={"/espace-client" as any} className="cursor-pointer">
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
                <Link href="/login">
                  <button className="p-2 rounded-full transition-all duration-200 text-white/35 hover:text-white hover:bg-white/10">
                    <User className="w-4 h-4" />
                  </button>
                </Link>
              )}

              {/* Cart */}
              <div className="[&_button]:text-white/40 [&_button]:hover:text-white">
                <SampleCartSheet />
              </div>
            </div>
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
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-nav-active hover:opacity-80 transition-colors"
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
                            href={col.id === "cosmetique" ? "/catalogue/cosmetique" : col.id === "parfum" ? "/catalogue/parfumerie" : "/catalogue/aromes"}
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
                                  href={col.id === "cosmetique" ? "/catalogue/cosmetique" : col.id === "parfum" ? "/catalogue/parfumerie" : "/catalogue/aromes"}
                                  onClick={closeMenus}
                                  className="block py-2 px-3 -mx-3 rounded-lg text-[13.5px] text-dark/45 hover:text-dark hover:bg-dark/[0.03] transition-all duration-150"
                                >
                                  {t(subKey)}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href={col.id === "cosmetique" ? "/catalogue/cosmetique" : col.id === "parfum" ? "/catalogue/parfumerie" : "/catalogue/aromes"}
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

      {/* ═══════════════════════════════════════
         Mobile Full-Screen Menu
         ═══════════════════════════════════════ */}
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
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 350 }}
              className="absolute inset-y-0 right-0 w-full sm:max-w-[440px] bg-cream-light flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-6 h-16 shrink-0 border-b border-dark/5">
                <Image
                  src="/images/logo-ies.png"
                  alt="IES Ingredients"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-dark/5 text-dark/40 hover:bg-dark/10 hover:text-dark transition-all duration-200"
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
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-4 border-b border-dark/5 transition-colors",
                        pathname === homeItem.href
                          ? "text-brand-nav-active font-semibold"
                          : "text-dark/70 active:text-dark"
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
                        "w-full flex items-center justify-between py-4 border-b border-dark/5 transition-colors",
                        pathname?.startsWith("/catalogue")
                          ? "text-brand-nav-active font-semibold"
                          : "text-dark/70 active:text-dark"
                      )}
                    >
                      <span className="text-lg">{t("catalog")}</span>
                      <motion.div
                        animate={{ rotate: mobileExpandedCat === "catalogue" ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown className="w-5 h-5 text-dark/30" />
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
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-brand-nav-active rounded-xl hover:bg-dark/5 transition-colors"
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
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-dark/5 hover:shadow-md hover:border-dark/10 transition-all duration-200 active:scale-[0.98]"
                                  >
                                    <div
                                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                      style={{ backgroundColor: `${col.accent}15` }}
                                    >
                                      <Icon className="w-5 h-5" style={{ color: col.accent }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span
                                        className="text-sm font-semibold block"
                                        style={{ color: col.accent }}
                                      >
                                        {cat(col.titleKey)}
                                      </span>
                                      <span className="text-xs text-dark/40 mt-0.5 block truncate">
                                        {col.subKeys.slice(0, 2).map((k) => t(k)).join(" · ")}
                                      </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-dark/20 shrink-0" />
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
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-4 transition-colors",
                            index < navItems.length - 1 && "border-b border-dark/5",
                            isActive
                              ? "text-brand-nav-active font-semibold"
                              : "text-dark/70 active:text-dark"
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
                    className="mt-6 pt-4 border-t border-dark/8"
                  >
                    {user ? (
                      <div className="space-y-1">
                        <Link
                          href={"/espace-client" as any}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-3 px-1 text-sm text-dark/50 hover:text-dark transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {t("myProfile")}
                        </Link>
                        {isUserAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-3 px-1 text-sm text-dark/50 hover:text-dark transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            {t("admin")}
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 py-3 px-1 text-sm text-red-500/60 hover:text-red-600 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("signOut")}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-3 px-1 text-sm text-dark/50 hover:text-dark transition-colors"
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
                className="shrink-0 px-6 pt-4 pb-6 border-t border-dark/8"
                style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
              >
                <Link href="/contact" onClick={() => setIsOpen(false)}>
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
                          className="p-2 rounded-full text-dark/25 hover:text-dark/50 transition-colors"
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
                        toggleLanguage();
                        setIsOpen(false);
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-full text-dark/30 hover:text-dark/60 hover:bg-dark/5 transition-all"
                    >
                      {locale === "fr" ? "EN" : "FR"}
                    </button>
                    {mounted && (
                      <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-dark/30 hover:text-dark/60 hover:bg-dark/5 transition-all"
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
