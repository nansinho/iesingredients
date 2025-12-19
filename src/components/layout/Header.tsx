import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { HeaderSearch } from './HeaderSearch';
import { CartButton } from '@/components/cart/CartButton';

interface HeaderProps {
  lang: Language;
}

export const Header = ({ lang }: HeaderProps) => {
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
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'py-3' : 'py-5'
      )}
    >
      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-300",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
            : "bg-transparent"
        )}
      />

      <div className="container-luxe relative z-10">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <div 
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-300",
                isScrolled ? "bg-primary" : "bg-gold-500"
              )}
            >
              <Leaf className={cn(
                "h-5 w-5 sm:h-6 sm:w-6 transition-colors",
                isScrolled ? "text-primary-foreground" : "text-forest-950"
              )} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-xl sm:text-2xl font-serif font-bold transition-colors",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                IES
              </span>
              <span className={cn(
                "text-[9px] sm:text-[10px] uppercase tracking-[0.2em] -mt-1 font-semibold transition-colors",
                isScrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                Ingredients
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors duration-300",
            isScrolled ? "bg-muted" : "bg-white/10 backdrop-blur-sm"
          )}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <div
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200",
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

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <HeaderSearch lang={lang} isScrolled={isScrolled} />

            {/* Cart Button */}
            <CartButton className={cn(
              "rounded-full w-9 h-9 sm:w-11 sm:h-11 transition-colors",
              isScrolled 
                ? "text-foreground hover:bg-muted" 
                : "text-white hover:bg-white/10"
            )} />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn(
                "gap-1.5 sm:gap-2 rounded-full font-semibold h-9 sm:h-11 px-2.5 sm:px-4 transition-colors duration-200",
                isScrolled 
                  ? "text-foreground hover:bg-muted border border-border" 
                  : "text-white hover:bg-white/10 border border-white/20"
              )}
            >
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </Button>

            <Link to={`/${lang}/catalogue`} className="hidden md:block">
              <Button 
                className={cn(
                  "rounded-full font-bold h-10 sm:h-12 px-4 sm:px-6 transition-colors duration-200 shadow-lg",
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
                    "rounded-full w-9 h-9 sm:w-11 sm:h-11 transition-colors",
                    isScrolled 
                      ? "text-foreground hover:bg-muted" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm bg-forest-950 border-forest-800 p-0">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-forest-950" />
                    </div>
                    <div>
                      <span className="text-xl font-serif font-bold text-white">IES</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/50 block">Ingredients</span>
                    </div>
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
          </div>
        </nav>
      </div>
    </header>
  );
};