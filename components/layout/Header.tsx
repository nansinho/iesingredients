"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Menu,
  Search,
  ArrowRight,
  User,
  LogOut,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  ArrowUpRight,
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
import { socialLinks, catalogColumns } from "@/components/layout/header-nav";

// Lazy-loaded overlays: their code only ships once the user actually opens them.
const HeaderMobileMenu = dynamic(
  () => import("./HeaderMobileMenu").then((m) => m.HeaderMobileMenu),
  { ssr: false },
);
const HeaderSearchOverlay = dynamic(
  () => import("./HeaderSearchOverlay").then((m) => m.HeaderSearchOverlay),
  { ssr: false },
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // Only mount lazy overlays after their first open to keep initial JS small.
  const [hasMobileMenuLoaded, setHasMobileMenuLoaded] = useState(false);
  const [hasSearchOverlayLoaded, setHasSearchOverlayLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
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
          setHasSearchOverlayLoaded(true);
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
                onClick={() => {
                  setHasSearchOverlayLoaded(true);
                  setSearchOpen((prev) => !prev);
                }}
                className="lg:hidden p-2 rounded-full transition-colors duration-200 text-white/50 hover:text-white hover:bg-white/10"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => {
                  setHasMobileMenuLoaded(true);
                  setIsOpen(true);
                }}
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
              <div className="bg-brand-primary/98 backdrop-blur-2xl border-t border-b border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
                <div className="w-[94%] mx-auto py-10">
                  {/* ═══ TOP — 3 universe cards (ThreeUniverses style, compact) ═══ */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {catalogColumns.map((col) => {
                      const Icon = col.icon;
                      const href = col.id === "cosmetique" ? "/catalogue/cosmetique" : col.id === "parfum" ? "/catalogue/parfumerie" : "/catalogue/aromes";
                      return (
                        <Link
                          key={col.id}
                          href={href}
                          onClick={closeMenus}
                          className="group/card block relative rounded-2xl overflow-hidden h-[150px] flex"
                        >
                          {/* Vertical strip */}
                          <div
                            className="relative z-10 w-10 shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: col.accent }}
                          >
                            <span
                              className="text-white text-[11px] font-bold uppercase tracking-[0.25em] select-none whitespace-nowrap"
                              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                            >
                              {cat(col.titleKey)}
                            </span>
                          </div>

                          {/* Image + content */}
                          <div className="relative flex-1 overflow-hidden">
                            <Image
                              src={col.image}
                              alt={cat(col.titleKey)}
                              fill
                              sizes="(max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                              <div>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-base font-semibold text-white leading-tight">
                                  {cat(col.titleKey)}
                                </div>
                                <div className="text-[11px] text-white/60 uppercase tracking-wider mt-0.5">
                                  {col.totalFamilies} familles
                                </div>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-white/70 group-hover/card:text-white group-hover/card:rotate-45 transition-all duration-300" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* ═══ BOTTOM — family lists under each universe ═══ */}
                  <div className="grid grid-cols-3 gap-4">
                    {catalogColumns.map((col) => {
                      const href = col.id === "cosmetique" ? "/catalogue/cosmetique" : col.id === "parfum" ? "/catalogue/parfumerie" : "/catalogue/aromes";
                      return (
                        <div key={col.id} className="px-2">
                          <ul className="space-y-px">
                            {col.families.slice(0, 5).map((family) => (
                              <li key={family.name}>
                                <Link
                                  href={href}
                                  onClick={closeMenus}
                                  className="group/item flex items-center justify-between py-2 text-[14px] text-white/60 hover:text-white transition-colors border-b border-white/[0.06]"
                                >
                                  <span>{family.name}</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-white/25 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={href}
                            onClick={closeMenus}
                            className="group/all inline-flex items-center gap-1.5 text-xs font-semibold mt-3 transition-colors"
                            style={{ color: col.accent }}
                          >
                            <span>Voir les {col.totalFamilies} familles</span>
                            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/all:translate-x-0.5" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* ═══ FOOTER — global CTAs ═══ */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <Link
                        href="/catalogue"
                        onClick={closeMenus}
                        className="group/cta inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-accent transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        <span>Voir tout le catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                      </Link>
                      <Link
                        href="/contact"
                        onClick={closeMenus}
                        className="group/cta inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                      >
                        <span>Demander un échantillon</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                      </Link>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold">
                      500+ références · 28 familles
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile full-screen menu — lazy-loaded on first open */}
      {hasMobileMenuLoaded && (
        <HeaderMobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          user={user}
          isUserAdmin={isUserAdmin}
          onSignOut={handleSignOut}
          onToggleLanguage={toggleLanguage}
        />
      )}
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

      {/* Mobile search overlay — lazy-loaded on first open */}
      {hasSearchOverlayLoaded && (
        <HeaderSearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}
