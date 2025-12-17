import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';

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
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        isScrolled
          ? 'bg-background/90 backdrop-blur-xl shadow-lg py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container-luxe">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-4 group">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
              isScrolled 
                ? "forest-gradient shadow-md" 
                : "bg-white/15 backdrop-blur-sm border border-white/20"
            )}>
              <Leaf className={cn(
                "h-6 w-6 transition-colors",
                isScrolled ? "text-white" : "text-white"
              )} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-serif text-2xl font-semibold tracking-tight transition-colors",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                IES
              </span>
              <span className={cn(
                "text-[10px] uppercase tracking-[0.2em] -mt-0.5 transition-colors",
                isScrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                Ingredients
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl',
                  location.pathname === item.href
                    ? isScrolled 
                      ? 'text-primary bg-primary/8' 
                      : 'text-white bg-white/15'
                    : isScrolled
                      ? 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/${lang}/catalogue`)}
              className={cn(
                "rounded-xl transition-all",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-secondary" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn(
                "gap-2 rounded-xl font-medium transition-all",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-secondary" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </Button>

            <Link to={`/${lang}/contact`} className="hidden md:block">
              <Button 
                className={cn(
                  "rounded-xl font-medium h-11 px-6 transition-all duration-500",
                  isScrolled
                    ? "forest-gradient text-white shadow-md hover:shadow-lg"
                    : "bg-white/15 text-white border border-white/20 hover:bg-white/25 backdrop-blur-sm"
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
                    "rounded-xl",
                    isScrolled 
                      ? "hover:bg-secondary" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-border p-0">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl forest-gradient flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-serif text-xl font-semibold">IES</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'py-3.5 px-4 rounded-xl text-base font-medium transition-all duration-300 animate-fade-up',
                          location.pathname === item.href
                            ? 'text-primary bg-primary/8'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        )}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="h-px bg-border my-8" />
                  
                  <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 forest-gradient text-white rounded-xl">
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
