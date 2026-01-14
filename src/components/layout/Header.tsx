import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { CartButton } from '@/components/cart/CartButton';

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
    <header
      ref={ref}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/50' 
          : 'bg-transparent'
      )}
    >
      <div className="container-luxe">
        <nav className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <span className={cn(
              "text-2xl md:text-3xl font-serif font-semibold transition-colors duration-300",
              isScrolled ? "text-foreground" : "text-white"
            )}>
              IES
            </span>
            <div className="hidden sm:block">
              <span className={cn(
                "text-[10px] uppercase tracking-luxury font-medium transition-colors duration-300 block",
                isScrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                INGREDIENTS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered - UPPERCASE */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <span
                    className={cn(
                      "px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors duration-300 link-underline",
                      isActive
                        ? isScrolled 
                          ? "text-foreground" 
                          : "text-white"
                        : isScrolled
                          ? "text-muted-foreground hover:text-foreground"
                          : "text-white/70 hover:text-white"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={cn(
                "p-2 rounded-full transition-colors duration-300",
                isScrolled 
                  ? "text-foreground hover:bg-muted" 
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <CartButton className={cn(
              "rounded-full transition-colors duration-300",
              isScrolled 
                ? "text-foreground hover:bg-muted" 
                : "text-white/80 hover:text-white hover:bg-white/10"
            )} />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={cn(
                "px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-300 rounded-full border",
                isScrolled 
                  ? "border-border text-foreground hover:bg-muted" 
                  : "border-white/30 text-white/80 hover:text-white hover:border-white/50"
              )}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* CTA Button - Desktop only */}
            <Link to={`/${lang}/contact`} className="hidden lg:block">
              <Button 
                className={cn(
                  "rounded-full h-10 px-6 text-xs font-medium uppercase tracking-wider transition-all duration-300",
                  isScrolled
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white text-foreground hover:bg-white/90"
                )}
              >
                {lang === 'fr' ? 'DEMANDER UN DEVIS' : 'REQUEST QUOTE'}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <button
                  className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isScrolled 
                      ? "text-foreground hover:bg-muted" 
                      : "text-white hover:bg-white/10"
                  )}
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-md bg-forest-950 border-forest-800 p-0">
                <div className="p-8 h-full flex flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-serif font-semibold text-white">IES</span>
                      <span className="text-[10px] uppercase tracking-luxury text-white/50">INGREDIENTS</span>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Mobile Navigation - UPPERCASE */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'py-4 px-5 rounded-xl text-sm font-medium uppercase tracking-widest transition-all duration-300 flex items-center justify-between group',
                            isActive
                              ? 'bg-white/10 text-white'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <span>{item.label}</span>
                          <ArrowRight className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                          )} />
                        </Link>
                      );
                    })}
                  </nav>
                  
                  {/* Mobile CTA */}
                  <div className="pt-8 border-t border-white/10">
                    <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 rounded-xl bg-white text-forest-950 hover:bg-white/90 font-medium text-sm uppercase tracking-wider">
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
        <div className={cn(
          "absolute top-full left-0 right-0 p-4 transition-all duration-300",
          isScrolled ? "bg-background border-b border-border" : "bg-forest-950/95 backdrop-blur-xl"
        )}>
          <div className="container-luxe">
            <div className="relative max-w-2xl mx-auto">
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                isScrolled ? "text-muted-foreground" : "text-white/50"
              )} />
              <input
                type="text"
                placeholder={lang === 'fr' ? 'RECHERCHER UN INGRÉDIENT...' : 'SEARCH INGREDIENTS...'}
                className={cn(
                  "w-full h-12 pl-12 pr-4 rounded-full text-sm uppercase tracking-wider outline-none transition-colors",
                  isScrolled 
                    ? "bg-muted text-foreground placeholder:text-muted-foreground" 
                    : "bg-white/10 text-white placeholder:text-white/50 border border-white/20"
                )}
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
        </div>
      )}
    </header>
  );
});
Header.displayName = 'Header';
