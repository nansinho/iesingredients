import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

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
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-3' : 'py-5'
      )}
    >
      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-500",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border/50" 
            : "bg-transparent"
        )}
      />

      <div className="container-luxe relative z-10">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <motion.div 
              className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-semibold text-foreground">
                IES
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] -mt-0.5 text-muted-foreground font-medium">
                Ingredients
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                >
                  <motion.div
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/${lang}/catalogue`)}
              className="rounded-full w-10 h-10 text-foreground/70 hover:text-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2 rounded-full font-medium h-10 px-4 text-foreground/70 hover:text-foreground hover:bg-muted"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
            </Button>

            <Link to={`/${lang}/catalogue`} className="hidden md:block">
              <Button className="rounded-full font-medium h-11 px-6">
                {t.hero.cta}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full w-10 h-10 text-foreground/70 hover:text-foreground hover:bg-muted"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm bg-background border-border p-0">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-xl font-serif font-semibold text-foreground">IES</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Ingredients</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'py-4 px-5 rounded-2xl text-base font-medium transition-all duration-300',
                          location.pathname === item.href
                            ? 'text-primary-foreground bg-primary'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  
                  <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 rounded-2xl font-medium">
                      {t.hero.cta}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
