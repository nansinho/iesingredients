import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Leaf, X } from 'lucide-react';
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-2' : 'py-4'
      )}
    >
      {/* Background - Always visible for readability */}
      <motion.div
        className={cn(
          "absolute inset-0 transition-all duration-500",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
            : "bg-foreground/90 backdrop-blur-xl"
        )}
      />

      <div className="container-luxe relative z-10">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${lang}`} className="flex items-center gap-3 group">
            <motion.div 
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden relative transition-colors duration-500",
                isScrolled ? "bg-accent" : "bg-white"
              )}
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className={cn(
                "h-6 w-6 relative z-10 transition-colors duration-500",
                isScrolled ? "text-white" : "text-foreground"
              )} />
            </motion.div>
            <div className="flex flex-col">
              <motion.span 
                className={cn(
                  "text-2xl font-bold tracking-tight transition-colors duration-500 font-sans",
                  isScrolled ? "text-foreground" : "text-white"
                )}
              >
                IES
              </motion.span>
              <span className={cn(
                "text-[10px] uppercase tracking-[0.2em] -mt-1 transition-colors duration-500 font-medium",
                isScrolled ? "text-muted-foreground" : "text-white/70"
              )}>
                Ingredients
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative"
                >
                  <motion.div
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? isScrolled 
                          ? "bg-accent text-white" 
                          : "bg-white text-foreground"
                        : isScrolled
                          ? "text-foreground hover:bg-muted"
                          : "text-white/90 hover:text-white hover:bg-white/20"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.label}
                    
                    {/* Shine effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={hoveredItem === item.href ? { x: '100%' } : { x: '-100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/${lang}/catalogue`)}
                className={cn(
                  "rounded-full w-11 h-11 transition-all duration-300",
                  isScrolled 
                    ? "text-foreground hover:bg-muted" 
                    : "text-white hover:bg-white/20"
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
                  "gap-2 rounded-full font-bold h-11 px-4 transition-all duration-300",
                  isScrolled 
                    ? "text-foreground hover:bg-muted border border-border" 
                    : "text-white hover:bg-white/20 border border-white/30"
                )}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
              </Button>
            </motion.div>

            <Link to={`/${lang}/catalogue`} className="hidden md:block">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className={cn(
                    "rounded-full font-bold h-12 px-8 transition-all duration-300 shadow-lg hover:shadow-xl",
                    isScrolled
                      ? "bg-accent text-white hover:bg-accent/90"
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
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "rounded-full w-11 h-11 transition-colors",
                      isScrolled 
                        ? "text-foreground hover:bg-muted" 
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm bg-foreground border-none p-0">
                <motion.div 
                  className="p-8 h-full flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-bold block text-white">IES</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/60">Ingredients</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 flex-1">
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
                            'py-4 px-6 rounded-2xl text-lg font-semibold transition-all duration-300 block',
                            location.pathname === item.href
                              ? 'text-foreground bg-white'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          )}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-14 bg-accent hover:bg-accent/90 text-white rounded-2xl font-bold text-lg">
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
