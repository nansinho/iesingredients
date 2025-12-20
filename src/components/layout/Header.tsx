import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { HeaderSearch } from './HeaderSearch';
import { CartButton } from '@/components/cart/CartButton';

interface HeaderProps {
  lang: Language;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(({ lang }, ref) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation(lang);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.company, href: `/${lang}/entreprise` },
    { label: t.nav.catalog, href: `/${lang}/catalogue` },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
      )}
    >
      {/* Top utility bar */}
      <div className={cn(
        "transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-border/50" 
          : "bg-forest-950/80 backdrop-blur-sm border-white/10"
      )}>
        <div className="container flex items-center justify-between h-10 sm:h-11">
          {/* Left: Search */}
          <div className="flex items-center gap-2">
            <HeaderSearch lang={lang} isScrolled={isScrolled} compact />
            <span className={cn(
              "hidden sm:inline text-xs font-medium",
              isScrolled ? "text-muted-foreground" : "text-white/60"
            )}>
              {lang === 'fr' ? 'Rechercher' : 'Search'}
            </span>
          </div>

          {/* Right: Cart + Language */}
          <div className="flex items-center gap-1">
            <CartButton className={cn(
              "rounded-full w-8 h-8 transition-colors",
              isScrolled 
                ? "text-foreground hover:bg-muted" 
                : "text-white hover:bg-white/10"
            )} />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn(
                "gap-1.5 rounded-full font-medium h-8 px-2.5 text-xs transition-colors duration-200",
                isScrolled 
                  ? "text-foreground hover:bg-muted" 
                  : "text-white hover:bg-white/10"
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className={cn(
        "transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-sm py-2" 
          : "bg-forest-950/60 backdrop-blur-sm py-3"
      )}>
        <div className="container">
          <nav className="flex items-center justify-between lg:justify-center gap-6">
            {/* Logo - Left on mobile, part of center group on desktop */}
            <Link to={`/${lang}`} className="flex items-center gap-2 lg:absolute lg:left-6">
              <span className={cn(
                "text-xl sm:text-2xl font-serif font-bold transition-colors tracking-tight",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                IES
              </span>
              <span className={cn(
                "text-[10px] sm:text-xs uppercase tracking-widest font-medium transition-colors hidden xs:block",
                isScrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                Ingredients
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className={cn(
              "hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors duration-300",
              isScrolled ? "bg-muted" : "bg-white/10"
            )}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <div
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200",
                        isActive
                          ? isScrolled 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-gold-500 text-forest-950"
                          : isScrolled
                            ? "text-foreground hover:bg-background"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CTA Button - Right on desktop */}
            <Link to={`/${lang}/catalogue`} className="hidden lg:block lg:absolute lg:right-6">
              <Button 
                className={cn(
                  "rounded-full font-bold h-10 px-5 transition-colors duration-200 shadow-lg text-sm",
                  isScrolled
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-gold-500/25"
                )}
              >
                {t.hero.cta}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "rounded-full w-9 h-9 transition-colors",
                    isScrolled 
                      ? "text-foreground hover:bg-muted" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm bg-forest-950 border-forest-800 p-0">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-serif font-bold text-white">IES</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/50">Ingredients</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'py-4 px-5 rounded-2xl text-base font-semibold transition-colors duration-200',
                          location.pathname === item.href
                            ? 'bg-gold-500 text-forest-950'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  
                  <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl bg-gold-500 text-forest-950 hover:bg-gold-400 font-bold text-lg">
                      {t.hero.cta}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
});
Header.displayName = 'Header';
