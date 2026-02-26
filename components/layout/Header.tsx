"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Search, ArrowRight, User, LogOut, Shield, Sun, Moon } from "lucide-react";
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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) checkAdmin(currentUser.id);
        else setIsUserAdmin(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsUserAdmin(false);
    router.refresh();
  };

  const navItems = [
    { label: t("catalog"), href: "/catalogue" as const },
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

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-nav shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1400px] w-[90%] mx-auto">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo-ies.png"
                alt="IES Ingredients"
                width={130}
                height={52}
                priority
                className="h-9 md:h-10 w-auto transition-all duration-300"
              />
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={cn(
                        "px-4 py-2 text-sm transition-all duration-200 rounded-full",
                        isScrolled
                          ? isActive
                            ? "font-semibold text-dark dark:text-cream-light"
                            : "text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
                          : isActive
                            ? "font-semibold text-dark dark:text-cream-light"
                            : "text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full transition-colors duration-200 text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Dark Mode Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-colors duration-200 text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <Sun className="w-[18px] h-[18px]" />
                  ) : (
                    <Moon className="w-[18px] h-[18px]" />
                  )}
                </button>
              )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
              >
                {locale === "fr" ? "EN" : "FR"}
              </button>

              {/* Sample Cart */}
              <div className="[&_button]:text-dark/60 [&_button]:hover:text-dark dark:[&_button]:text-cream-light/60 dark:[&_button]:hover:text-cream-light">
                <SampleCartSheet />
              </div>

              {/* User Button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full transition-colors duration-200 text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5">
                      <User className="w-[18px] h-[18px]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl bg-white dark:bg-dark-card border-brown/10">
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
                <Link href="/login">
                  <button className="p-2 rounded-full transition-colors duration-200 text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5">
                    <User className="w-[18px] h-[18px]" />
                  </button>
                </Link>
              )}

              {/* CTA Button - Desktop */}
              <Link href="/contact" className="hidden lg:block ml-2">
                <Button
                  className="rounded-full h-9 px-6 text-sm font-medium bg-peach text-dark hover:bg-peach-dark shadow-sm shadow-peach/20"
                >
                  {t("requestQuote")}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <button
                    className="p-2 rounded-full transition-colors duration-200 ml-1 text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
                    aria-label="Menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[85vw] max-w-sm bg-cream-light dark:bg-dark border-brown/10 p-0"
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-8">
                      <Image
                        src="/images/logo-ies.png"
                        alt="IES Ingredients"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                      />
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-dark/40 hover:text-dark dark:text-cream-light/40 dark:hover:text-cream-light rounded-full hover:bg-brown/5 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Nav */}
                    <nav className="flex flex-col gap-1 flex-1">
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
                                  ? "bg-peach/15 text-dark dark:text-cream-light border border-peach/30"
                                  : "text-dark/60 hover:text-dark hover:bg-brown/5 dark:text-cream-light/60 dark:hover:text-cream-light dark:hover:bg-cream-light/5"
                              )}
                            >
                              <span>{item.label}</span>
                              <ArrowRight
                                className={cn(
                                  "w-4 h-4 transition-all duration-200",
                                  isActive
                                    ? "opacity-100 text-peach-dark"
                                    : "opacity-0 group-hover:opacity-50 group-hover:translate-x-1"
                                )}
                              />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>

                    {/* Mobile Footer */}
                    <div className="pt-6 border-t border-brown/10">
                      {user ? (
                        <div className="space-y-2">
                          <Link href="/mon-compte" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full h-11 rounded-xl border-brown/20 text-dark/70 hover:bg-brown/5 dark:text-cream-light/70 dark:border-brown/15"
                            >
                              <User className="w-4 h-4 mr-2" />
                              {t("myProfile")}
                            </Button>
                          </Link>
                          {isUserAdmin && (
                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                              <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl border-brown/20 text-dark/70 hover:bg-brown/5 dark:text-cream-light/70 dark:border-brown/15"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                {t("admin")}
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => { handleSignOut(); setIsOpen(false); }}
                            className="w-full h-11 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            {t("signOut")}
                          </Button>
                        </div>
                      ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full h-11 rounded-xl border-brown/20 text-dark/70 hover:bg-brown/5 dark:text-cream-light/70 dark:border-brown/15"
                          >
                            <User className="w-4 h-4 mr-2" />
                            {t("signIn")}
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Mobile CTA */}
                    <div className="pt-4">
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-12 rounded-full bg-peach text-dark hover:bg-peach-dark font-medium text-sm shadow-lg shadow-peach/20">
                          {t("requestQuote")}
                        </Button>
                      </Link>

                      <div className="flex items-center justify-center gap-4 mt-3">
                        <button
                          onClick={() => {
                            toggleLanguage();
                            setIsOpen(false);
                          }}
                          className="py-2 text-sm text-dark/40 hover:text-dark/60 dark:text-cream-light/40 dark:hover:text-cream-light/60 transition-colors"
                        >
                          {locale === "fr" ? t("englishVersion") : t("frenchVersion")}
                        </button>

                        {mounted && (
                          <button
                            onClick={toggleTheme}
                            className="p-2 text-dark/40 hover:text-dark/60 dark:text-cream-light/40 dark:hover:text-cream-light/60 transition-colors rounded-full"
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
          </nav>
        </div>
      </motion.header>

      {/* Command Palette Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-[60]"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[61] px-4"
            >
              <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-brown/10 overflow-hidden">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-brown/50" />
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="w-full h-14 pl-12 pr-4 text-base bg-transparent outline-none placeholder:text-brown/40 text-dark dark:text-cream-light"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value) {
                        router.push(`/catalogue?search=${encodeURIComponent(e.currentTarget.value)}` as any); // eslint-disable-line @typescript-eslint/no-explicit-any
                        setSearchOpen(false);
                      }
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                      }
                    }}
                  />
                  <kbd className="absolute right-4 text-xs text-brown/40 bg-cream dark:bg-dark-lighter px-2 py-1 rounded-md font-mono">
                    ESC
                  </kbd>
                </div>
                <div className="border-t border-brown/10 px-4 py-3">
                  <p className="text-xs text-brown/40">
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
