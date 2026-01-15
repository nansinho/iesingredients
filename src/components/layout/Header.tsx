import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ArrowRight, User, LogOut, Settings, ShoppingBag, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { CartButton } from '@/components/cart/CartButton';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import logoIes from '@/assets/logo-ies.png';

interface HeaderProps {
  lang: Language;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(({ lang }, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation(lang);
  const { user, profile, isLoading: authLoading, signOut, isAdmin } = useAuth();

  // Check if we're on a page with dark hero (including homepage)
  const isHomePage = location.pathname === '/fr' || location.pathname === '/en' || location.pathname === '/';
  const hasDarkHero = isHomePage ||
                      location.pathname.includes('/produit/') || 
                      location.pathname.includes('/contact') ||
                      location.pathname.includes('/entreprise') ||
                      location.pathname.includes('/equipe') ||
                      location.pathname.includes('/actualites') ||
                      location.pathname.includes('/catalogue');
  const isDarkHero = hasDarkHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.catalog, href: `/${lang}/catalogue` },
    { label: t.nav.company, href: `/${lang}/entreprise` },
    { label: t.nav.team, href: `/${lang}/equipe` },
    { label: t.nav.news, href: `/${lang}/actualites` },
    { label: t.nav.podcast, href: `/${lang}/podcast` },
    { label: t.nav.contact, href: `/${lang}/contact` },
  ];

  const toggleLanguage = () => {
    const newLang = lang === 'fr' ? 'en' : 'fr';
    const currentPath = location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(currentPath || `/${newLang}`);
  };

  return (
    <motion.header
      ref={ref}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-forest-100' 
          : isDarkHero 
            ? 'bg-transparent' 
            : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <nav className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center">
            <img 
              src={logoIes} 
              alt="IES Ingredients" 
              className={cn(
                "transition-all duration-300",
                isScrolled ? "h-10 md:h-12" : "h-12 md:h-14",
                // Apply filter for dark backgrounds when not scrolled
                !isScrolled && isDarkHero ? "brightness-0 invert" : ""
              )}
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                >
                  <Link to={item.href}>
                    <span
                      className={cn(
                        "px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 relative",
                        isScrolled 
                          ? isActive ? "text-forest-900" : "text-forest-600 hover:text-forest-900"
                          : isDarkHero
                            ? isActive ? "text-gold-400" : "text-white/80 hover:text-white"
                            : isActive ? "text-forest-900" : "text-forest-600 hover:text-forest-900"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className={cn(
                            "absolute -bottom-1 left-4 right-4 h-0.5 rounded-full",
                            isDarkHero && !isScrolled ? "bg-gold-400" : "bg-gold-500"
                          )}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Icon */}
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

            {/* Cart */}
            <CartButton className={cn(
              "rounded-full transition-colors duration-300",
              isScrolled 
                ? "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
                : isDarkHero 
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-forest-600 hover:text-forest-900 hover:bg-forest-50"
            )} />

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
              {lang === 'fr' ? 'EN' : 'FR'}
            </motion.button>

            {/* User Button */}
            {!authLoading && (
              user ? (
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
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium text-sm">{profile?.full_name || 'Mon compte'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={lang === 'fr' ? '/fr/mon-compte' : '/en/my-account'} className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        {lang === 'fr' ? 'Mon profil' : 'My profile'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={lang === 'fr' ? '/fr/mon-compte' : '/en/my-account'} className="cursor-pointer">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {lang === 'fr' ? 'Mes demandes' : 'My requests'}
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            <Shield className="w-4 h-4 mr-2" />
                            Administration
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut()} 
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {lang === 'fr' ? 'Déconnexion' : 'Sign out'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
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
              )
            )}

            {/* CTA Button - Desktop only */}
            <Link to={`/${lang}/contact`} className="hidden lg:block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className={cn(
                  "rounded-full h-10 px-6 text-xs font-medium uppercase tracking-wider transition-all duration-300",
                  isDarkHero && !isScrolled
                    ? "bg-gold-400 text-forest-900 hover:bg-gold-300"
                    : "bg-forest-900 text-white hover:bg-forest-800"
                )}>
                  {lang === 'fr' ? 'DEMANDER UN DEVIS' : 'REQUEST QUOTE'}
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
              <SheetContent side="right" className="w-[85vw] max-w-sm bg-forest-950 border-forest-800 p-0">
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <img 
                      src={logoIes} 
                      alt="IES Ingredients" 
                      className="h-8 sm:h-10 brightness-0 invert"
                    />
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item, index) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'py-3 sm:py-4 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-medium uppercase tracking-widest transition-all duration-300 flex items-center justify-between group',
                              isActive
                                ? 'bg-gold-500 text-forest-950'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            )}
                          >
                            <span>{item.label}</span>
                            <ArrowRight className={cn(
                              "w-5 h-5 transition-transform duration-300",
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                            )} />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                  
                  {/* Mobile User Section */}
                  <div className="pt-6 border-t border-white/10">
                    {user ? (
                      <div className="space-y-2">
                        <div className="px-2 py-3">
                          <p className="text-sm font-medium text-white">{profile?.full_name || 'Mon compte'}</p>
                          <p className="text-xs text-white/50">{user.email}</p>
                        </div>
                        <Link
                          to={lang === 'fr' ? '/fr/mon-compte' : '/en/my-account'}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          {lang === 'fr' ? 'Mon profil' : 'My profile'}
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Shield className="w-5 h-5" />
                            Administration
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setIsOpen(false); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          {lang === 'fr' ? 'Déconnexion' : 'Sign out'}
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white/10">
                          <User className="w-5 h-5 mr-2" />
                          {lang === 'fr' ? 'Connexion' : 'Sign in'}
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Mobile CTA */}
                  <div className="pt-4">
                    <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-xl bg-gold-500 text-forest-950 hover:bg-gold-400 font-medium text-sm uppercase tracking-wider">
                        {lang === 'fr' ? 'DEMANDER UN DEVIS' : 'REQUEST QUOTE'}
                      </Button>
                    </Link>
                    
                    {/* Language toggle in mobile */}
                    <button
                      onClick={() => { toggleLanguage(); setIsOpen(false); }}
                      className="w-full mt-4 py-3 text-xs font-medium uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                    >
                      {lang === 'fr' ? 'ENGLISH VERSION' : 'VERSION FRANÇAISE'}
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
                placeholder={lang === 'fr' ? 'Rechercher un ingrédient...' : 'Search ingredients...'}
                className="w-full h-12 pl-12 pr-4 rounded-full text-sm bg-forest-50 border border-forest-200 outline-none focus:border-forest-400 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    navigate(`/${lang}/catalogue?search=${encodeURIComponent(e.currentTarget.value)}`);
                    setSearchOpen(false);
                  }
                  if (e.key === 'Escape') {
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
});
Header.displayName = 'Header';
