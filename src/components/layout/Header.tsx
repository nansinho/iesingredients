import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Globe, Leaf } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-elegant">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl forest-gradient flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold text-foreground tracking-tight">
                IES
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground -mt-0.5">
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
                  'px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg',
                  location.pathname === item.href
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/${lang}/catalogue`)}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </Button>

            <Link to={`/${lang}/contact`} className="hidden md:block">
              <Button className="forest-gradient text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg transition-all">
                {t.hero.cta}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-border">
                <div className="flex flex-col gap-2 mt-8">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 animate-fade-up',
                        location.pathname === item.href
                          ? 'text-primary bg-primary/8'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-4" />
                  <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full forest-gradient text-primary-foreground">
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
