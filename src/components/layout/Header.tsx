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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-luxe">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
              isScrolled 
                ? "bg-primary" 
                : "bg-primary"
            )}>
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-xl font-semibold tracking-tight transition-colors",
                isScrolled ? "text-foreground" : "text-foreground"
              )}>
                IES
              </span>
              <span className={cn(
                "text-[9px] uppercase tracking-[0.15em] -mt-0.5 transition-colors",
                isScrolled ? "text-muted-foreground" : "text-muted-foreground"
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
                  'px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg',
                  location.pathname === item.href
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
              className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </Button>

            <Link to={`/${lang}/contact`} className="hidden md:block">
              <Button className="rounded-lg font-medium h-10 px-5 bg-primary text-primary-foreground hover:bg-forest-700">
                {t.hero.cta}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-lg hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white border-border p-0">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold">IES</span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300',
                          location.pathname === item.href
                            ? 'text-primary bg-primary/8'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="h-px bg-border my-6" />
                  
                  <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-11 bg-primary text-white rounded-lg">
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
