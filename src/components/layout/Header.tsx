import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  lang: Language;
}

export const Header = ({ lang }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation(lang);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        isScrolled
          ? 'py-3'
          : 'py-6'
      )}
    >
      {/* Glassmorphism background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
      />

      <div className="container-luxe relative z-10">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <motion.div 
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary overflow-hidden relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-forest-600"
                initial={{ y: '100%' }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Leaf className="h-5 w-5 text-white relative z-10" />
            </motion.div>
            <div className="flex flex-col">
              <motion.span 
                className={cn(
                  "text-xl font-semibold tracking-tight transition-colors duration-500",
                  isScrolled ? "text-foreground" : "text-white"
                )}
              >
                IES
              </motion.span>
              <span className={cn(
                "text-[9px] uppercase tracking-[0.15em] -mt-0.5 transition-colors duration-500",
                isScrolled ? "text-muted-foreground" : "text-white/60"
              )}>
                Ingredients
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative px-4 py-2"
              >
                {/* Hover background */}
                <AnimatePresence>
                  {hoveredItem === item.href && (
                    <motion.div
                      layoutId="navbar-hover"
                      className={cn(
                        "absolute inset-0 rounded-full",
                        isScrolled ? "bg-primary/10" : "bg-white/10"
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Active indicator */}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <span className={cn(
                  'relative z-10 text-sm font-medium transition-colors duration-300',
                  location.pathname === item.href
                    ? 'text-primary'
                    : isScrolled 
                      ? 'text-muted-foreground hover:text-foreground' 
                      : 'text-white/70 hover:text-white'
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/${lang}/catalogue`)}
                className={cn(
                  "rounded-full transition-colors duration-300",
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className={cn(
                  "gap-1.5 rounded-full font-medium transition-colors duration-300",
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
              </Button>
            </motion.div>

            <Link to={`/${lang}/catalogue`} className="hidden md:block">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className={cn(
                    "rounded-full font-medium h-10 px-6 transition-all duration-300",
                    isScrolled
                      ? "bg-primary text-primary-foreground hover:bg-forest-700"
                      : "bg-white text-foreground hover:bg-white/90"
                  )}
                >
                  {t.hero.cta}
                </Button>
              </motion.div>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full transition-colors",
                      isScrolled 
                        ? "hover:bg-muted" 
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white border-border p-0">
                <motion.div 
                  className="p-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold block">IES</span>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Ingredients</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 block',
                            location.pathname === item.href
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          )}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="h-px bg-border my-8" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-12 bg-primary text-white rounded-xl font-medium">
                        {t.hero.cta}
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};
