"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Search, ArrowRight, User, LogOut, ShoppingBag, Shield } from "lucide-react";
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
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { SampleCartSheet } from "@/components/cart/SampleCartSheet";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");

  const isHomePage = pathname === "/";
  const hasDarkHero =
    isHomePage ||
    pathname.includes("/catalogue") ||
    pathname.includes("/contact") ||
    pathname.includes("/entreprise") ||
    pathname.includes("/equipe") ||
    pathname.includes("/actualites");
  const isDarkHero = hasDarkHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
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
    router.replace(pathname as any, { locale: newLocale });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-forest-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <nav className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-ies.png"
              alt="IES Ingredients"
              width={140}
              height={56}
              priority
              className={cn(
                "transition-all duration-300 w-auto",
                isScrolled ? "h-10 md:h-12" : "h-12 md:h-14",
                !isScrolled && isDarkHero ? "brightness-0 invert" : ""
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <Link href={item.href}>
                    <span
                      className={cn(
                        "px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 relative",
                        isScrolled
                          ? isActive
                            ? "text-forest-900"
                            : "text-forest-600 hover:text-forest-900"
                          : isDarkHero
                            ? isActive
                              ? "text-gold-400"
                              : "text-white/80 hover:text-white"
                            : isActive
                              ? "text-forest-900"
                              : "text-forest-600 hover:text-forest-900"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className={cn(
                            "absolute -bottom-1 left-4 right-4 h-0.5 rounded-full",
                            isDarkHero ? "bg-gold-400" : "bg-gold-500"
                          )}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                "p-2.5 rounded-full transition-colors duration-300",
                isScrolled
                  ? "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                  : isDarkHero
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className={cn(
                "px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 rounded-full border",
                isScrolled
                  ? "text-forest-600 hover:text-forest-900 border-forest-200 hover:border-forest-300 hover:bg-forest-50"
                  : isDarkHero
                    ? "text-white/80 hover:text-white border-white/30 hover:border-white/50 hover:bg-white/10"
                    : "text-forest-600 hover:text-forest-900 border-forest-200 hover:border-forest-300 hover:bg-forest-50"
              )}
            >
              {locale === "fr" ? "EN" : "FR"}
            </motion.button>

            {/* Sample Cart */}
            <div className={cn(
              "rounded-full transition-colors duration-300",
              isScrolled
                ? "[&_button]:text-forest-600 [&_button]:hover:text-forest-900"
                : isDarkHero
                  ? "[&_button]:text-white/80 [&_button]:hover:text-white"
                  : "[&_button]:text-forest-600 [&_button]:hover:text-forest-900"
            )}>
              <SampleCartSheet />
            </div>

            {/* User Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "p-2.5 rounded-full transition-colors duration-300",
                      isScrolled
                        ? "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                        : isDarkHero
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                          : "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                    )}
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/mon-compte" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      {t("myProfile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2.5 rounded-full transition-colors duration-300",
                    isScrolled
                      ? "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                      : isDarkHero
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                  )}
                >
                  <User className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

            {/* CTA Button - Desktop */}
            <Link href="/contact" className="hidden lg:block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className={cn(
                    "rounded-full h-10 px-6 text-xs font-medium uppercase tracking-wider transition-all duration-300",
                    isDarkHero
                      ? "bg-gold-400 text-forest-900 hover:bg-gold-300"
                      : "bg-forest-900 text-white hover:bg-forest-800"
                  )}
                >
                  {t("requestQuote")}
                </Button>
              </motion.div>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isScrolled
                      ? "text-forest-900 hover:bg-forest-50"
                      : isDarkHero
                        ? "text-white hover:bg-white/10"
                        : "text-forest-900 hover:bg-forest-50"
                  )}
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm bg-forest-950 border-forest-800 p-0"
              >
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <Image
                      src="/images/logo-ies.png"
                      alt="IES Ingredients"
                      width={120}
                      height={40}
                      className="h-8 sm:h-10 w-auto brightness-0 invert"
                    />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  {/* Mobile Nav */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "py-3 sm:py-4 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-medium uppercase tracking-widest transition-all duration-300 flex items-center justify-between group",
                              isActive
                                ? "bg-gold-500 text-forest-950"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            )}
                          >
                            <span>{item.label}</span>
                            <ArrowRight
                              className={cn(
                                "w-5 h-5 transition-transform duration-300",
                                isActive
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                              )}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="pt-6 border-t border-white/10">
                    {user ? (
                      <div className="space-y-2">
                        <Link href="/mon-compte" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
                          >
                            <User className="w-5 h-5 mr-2" />
                            {t("myProfile")}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => { handleSignOut(); setIsOpen(false); }}
                          className="w-full h-12 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/5"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          {t("signOut")}
                        </Button>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
                        >
                          <User className="w-5 h-5 mr-2" />
                          {t("signIn")}
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Mobile CTA */}
                  <div className="pt-4">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-xl bg-gold-500 text-forest-950 hover:bg-gold-400 font-medium text-sm uppercase tracking-wider">
                        {t("requestQuote")}
                      </Button>
                    </Link>

                    <button
                      onClick={() => {
                        toggleLanguage();
                        setIsOpen(false);
                      }}
                      className="w-full mt-4 py-3 text-xs font-medium uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                    >
                      {locale === "fr" ? t("englishVersion") : t("frenchVersion")}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 p-4 bg-white border-b border-forest-100 shadow-lg"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full h-12 pl-12 pr-4 rounded-full text-sm bg-forest-50 border border-forest-200 outline-none focus:border-forest-400 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    router.push({
                      pathname: "/catalogue",
                      query: { search: e.currentTarget.value },
                    } as any);
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
