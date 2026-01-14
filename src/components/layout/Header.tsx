import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { CartButton } from '@/components/cart/CartButton';
import { motion } from 'framer-motion';

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
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-cream-200' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <span className="text-2xl md:text-3xl font-serif font-semibold text-foreground transition-colors duration-300">
              IES
            </span>
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase tracking-luxury font-medium text-muted-foreground block">
                INGREDIENTS
              </span>
            </div>
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
                        isActive
                          ? "text-navy-900"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute -bottom-1 left-4 right-4 h-0.5 bg-navy-900 rounded-full"
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
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-cream-100 transition-colors duration-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Cart */}
            <CartButton className="rounded-full text-muted-foreground hover:text-foreground hover:bg-cream-100 transition-colors duration-300" />

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300 rounded-full border border-cream-300 hover:border-cream-400 hover:bg-cream-50"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </motion.button>

            {/* CTA Button - Desktop only */}
            <Link to={`/${lang}/contact`} className="hidden lg:block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="rounded-full h-10 px-6 text-xs font-medium uppercase tracking-wider bg-navy-900 text-white hover:bg-navy-800 transition-all duration-300">
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
                  className="p-2 rounded-full text-foreground hover:bg-cream-100 transition-colors duration-300"
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-md bg-white border-cream-200 p-0">
                <div className="p-8 h-full flex flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-serif font-semibold text-foreground">IES</span>
                      <span className="text-[10px] uppercase tracking-luxury text-muted-foreground">INGREDIENTS</span>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-cream-100 transition-colors"
                    >
                      <X className="w-6 h-6" />
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
                              'py-4 px-5 rounded-xl text-sm font-medium uppercase tracking-widest transition-all duration-300 flex items-center justify-between group',
                              isActive
                                ? 'bg-navy-900 text-white'
                                : 'text-muted-foreground hover:text-foreground hover:bg-cream-100'
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
                  
                  {/* Mobile CTA */}
                  <div className="pt-8 border-t border-cream-200">
                    <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-xl bg-navy-900 text-white hover:bg-navy-800 font-medium text-sm uppercase tracking-wider">
                        {lang === 'fr' ? 'DEMANDER UN DEVIS' : 'REQUEST QUOTE'}
                      </Button>
                    </Link>
                    
                    {/* Language toggle in mobile */}
                    <button
                      onClick={() => { toggleLanguage(); setIsOpen(false); }}
                      className="w-full mt-4 py-3 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
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
          className="absolute top-full left-0 right-0 p-4 bg-white border-b border-cream-200 shadow-lg"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={lang === 'fr' ? 'Rechercher un ingrédient...' : 'Search ingredients...'}
                className="w-full h-12 pl-12 pr-4 rounded-full text-sm bg-cream-50 border border-cream-200 outline-none focus:border-navy-400 transition-colors"
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