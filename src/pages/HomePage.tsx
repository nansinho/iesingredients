import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, ChevronRight, Play, ArrowDown, Calendar, Clock, TrendingUp } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';

interface HomePageProps {
  lang: Language;
}

// Magnetic Button
const MagneticButton = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Text Reveal Animation
const TextReveal = ({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Floating Orb
const FloatingOrb = ({ 
  color, 
  size, 
  position, 
  delay = 0 
}: { 
  color: string; 
  size: number; 
  position: { top?: string; bottom?: string; left?: string; right?: string }; 
  delay?: number;
}) => (
  <motion.div
    className={`absolute rounded-full blur-[120px] ${color}`}
    style={{ width: size, height: size, ...position }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.4, 0.6, 0.4],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// Scroll Progress
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-parfum to-cosmetique origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// Animated Counter
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
};

// Scroll Reveal
const ScrollReveal = ({ 
  children, 
  className = '', 
  direction = 'up', 
  delay = 0,
  duration = 0.8
}: { 
  children: React.ReactNode; 
  className?: string; 
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const variants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
    scale: { scale: 0.95, opacity: 0 },
  };
  
  return (
    <motion.div
      ref={ref}
      initial={variants[direction]}
      animate={isInView ? { y: 0, x: 0, scale: 1, opacity: 1 } : variants[direction]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Marquee Component
const Marquee = ({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) => (
  <div className="overflow-hidden whitespace-nowrap">
    <motion.div
      className="inline-flex"
      animate={{ x: [0, -1000] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {children}
      {children}
    </motion.div>
  </div>
);

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  const [currentWord, setCurrentWord] = useState(0);
  
  const words = lang === 'fr' 
    ? ['Naturels', 'Précieux', 'Authentiques', 'Durables']
    : ['Natural', 'Precious', 'Authentic', 'Sustainable'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "50%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.3]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 25);
      mouseY.set((clientY - innerHeight / 2) / 25);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const featuredProducts = mockProducts.slice(0, 4);

  const categories = [
    {
      icon: Leaf,
      name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic',
      count: '2000+',
      accent: 'bg-cosmetique',
      textColor: 'text-cosmetique',
      borderColor: 'border-cosmetique/30',
      image: creamJar,
      link: `/${lang}/catalogue?category=cosmetique`
    },
    {
      icon: FlaskConical,
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery',
      count: '1500+',
      accent: 'bg-parfum',
      textColor: 'text-parfum',
      borderColor: 'border-parfum/30',
      image: essentialOil,
      link: `/${lang}/catalogue?category=parfum`
    },
    {
      icon: Droplets,
      name: lang === 'fr' ? 'Arômes' : 'Flavors',
      count: '1500+',
      accent: 'bg-arome',
      textColor: 'text-arome',
      borderColor: 'border-arome/30',
      image: blueberriesHerbs,
      link: `/${lang}/catalogue?category=arome`
    }
  ];

  const news = [
    {
      id: 1,
      title: lang === 'fr' ? 'Nouveaux extraits botaniques certifiés COSMOS' : 'New COSMOS certified botanical extracts',
      date: '12 Déc 2024',
      category: lang === 'fr' ? 'Produits' : 'Products',
      image: botanicalsFlat,
      featured: true
    },
    {
      id: 2,
      title: lang === 'fr' ? 'IES au salon In-Cosmetics Global 2025' : 'IES at In-Cosmetics Global 2025',
      date: '8 Déc 2024',
      category: lang === 'fr' ? 'Événements' : 'Events',
      image: essentialOil,
      featured: false
    },
    {
      id: 3,
      title: lang === 'fr' ? 'Tendances arômes alimentaires 2025' : 'Food flavor trends 2025',
      date: '2 Déc 2024',
      category: lang === 'fr' ? 'Tendances' : 'Trends',
      image: blueberriesHerbs,
      featured: false
    }
  ];

  const stats = [
    { value: 5000, suffix: '+', label: lang === 'fr' ? 'Références' : 'References' },
    { value: 30, suffix: '+', label: lang === 'fr' ? 'Années' : 'Years' },
    { value: 500, suffix: '+', label: 'Clients' },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      <ScrollProgress />

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen relative overflow-hidden flex items-center">
        {/* Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img src={leavesHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-wood-950/80 via-wood-950/60 to-wood-900/80" />
        </motion.div>

        {/* Floating Orbs */}
        <motion.div style={{ x: smoothMouseX, y: smoothMouseY }}>
          <FloatingOrb color="bg-accent" size={500} position={{ top: '10%', right: '15%' }} />
        </motion.div>
        <motion.div style={{ x: useTransform(smoothMouseX, v => -v * 1.2), y: useTransform(smoothMouseY, v => -v * 1.2) }}>
          <FloatingOrb color="bg-cosmetique" size={350} position={{ bottom: '20%', left: '10%' }} delay={2} />
        </motion.div>

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full py-32"
          style={{ opacity: heroOpacity }}
        >
          <div className="container-luxe">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <motion.div 
                    className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-accent" />
                  </motion.div>
                  <span className="text-sm uppercase tracking-[0.25em] text-white/60 font-medium">
                    {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
                  </span>
                </motion.div>
                
                <h1 className="mb-8">
                  <TextReveal 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95] tracking-tight"
                    delay={0.3}
                  >
                    {lang === 'fr' ? 'Ingrédients' : 'Ingredients'}
                  </TextReveal>
                  <div className="h-[1.1em] overflow-hidden mt-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentWord}
                        initial={{ y: 80, opacity: 0, rotateX: -40 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -80, opacity: 0, rotateX: 40 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-accent leading-[0.95]"
                      >
                        {words[currentWord]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </h1>
                
                <motion.p 
                  className="text-white/50 text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {lang === 'fr'
                    ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires.'
                    : 'Over 5000 premium references for cosmetics, perfumery and food flavors.'}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex flex-wrap gap-4"
                >
                  <MagneticButton>
                    <Link to={`/${lang}/catalogue`}>
                      <Button className="bg-accent hover:bg-accent/90 text-white h-14 px-8 rounded-full text-base font-medium shadow-2xl shadow-accent/30 group">
                        {lang === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link to={`/${lang}/contact`}>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-full text-base font-medium backdrop-blur-sm">
                        {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                      </Button>
                    </Link>
                  </MagneticButton>
                </motion.div>
              </div>

              {/* Right - Stats Floating */}
              <div className="lg:col-span-5">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {/* Decorative Circle */}
                  <div className="absolute -inset-8 rounded-full border border-white/10" />
                  <div className="absolute -inset-16 rounded-full border border-white/5" />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    <div className="grid grid-cols-3 gap-6">
                      {stats.map((stat, i) => (
                        <motion.div 
                          key={i}
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          <span className="text-3xl md:text-4xl font-serif text-white block mb-1">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                          </span>
                          <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">100% {lang === 'fr' ? 'Naturel' : 'Natural'}</span>
                        <div className="flex gap-2">
                          {['COSMOS', 'BIO', 'ISO'].map((cert, i) => (
                            <span key={i} className="px-2 py-1 text-[10px] rounded-full bg-white/10 text-white/70">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE BRANDS */}
      <section className="py-6 bg-wood-900 border-y border-white/5 overflow-hidden">
        <Marquee speed={40}>
          {['COSMOS', 'ECOCERT', 'BIO', 'HALAL', 'CASHER', 'ISO 9001', 'IFRA', 'REACH', 'VEGAN', 'FAIR TRADE'].map((brand, i) => (
            <span key={i} className="mx-12 text-white/30 text-sm uppercase tracking-widest font-medium">
              {brand}
            </span>
          ))}
        </Marquee>
      </section>

      {/* NEWS SECTION - Prominent */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent" />
        
        <div className="container-luxe relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold">
                  {lang === 'fr' ? 'Actualités' : 'News'}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Restez informé' : 'Stay informed'}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Link to={`/${lang}/actualites`}>
                <Button variant="outline" className="rounded-full h-12 px-6 group">
                  {lang === 'fr' ? 'Toutes les actualités' : 'All news'}
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured News */}
            <ScrollReveal className="lg:row-span-2">
              <Link to={`/${lang}/actualites/1`}>
                <motion.article 
                  className="group relative h-full min-h-[500px] rounded-3xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img 
                    src={news[0].image} 
                    alt={news[0].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-wood-950/50 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-medium">
                        {news[0].category}
                      </span>
                      <span className="text-white/60 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {news[0].date}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-accent transition-colors leading-tight">
                      {news[0].title}
                    </h3>
                  </div>
                </motion.article>
              </Link>
            </ScrollReveal>

            {/* Other News */}
            {news.slice(1).map((item, i) => (
              <ScrollReveal key={item.id} delay={0.1 * (i + 1)}>
                <Link to={`/${lang}/actualites/${item.id}`}>
                  <motion.article 
                    className="group flex gap-5 p-5 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-accent text-xs font-medium">{item.category}</span>
                        <span className="text-muted-foreground text-xs">{item.date}</span>
                      </div>
                      <h3 className="text-lg font-serif text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </motion.article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Dynamic Grid */}
      <section className="py-20 md:py-28 bg-secondary/30 relative">
        <div className="container-luxe">
          <ScrollReveal className="text-center mb-16">
            <span className="text-accent uppercase tracking-[0.25em] text-sm font-semibold mb-4 block">
              {lang === 'fr' ? 'Nos Univers' : 'Our Worlds'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground">
              {lang === 'fr' ? 'Trois expertises, ' : 'Three expertises, '}
              <span className="italic text-accent">{lang === 'fr' ? 'une passion' : 'one passion'}</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 0.1}>
                <Link to={cat.link}>
                  <motion.article 
                    className={`group relative h-[420px] rounded-3xl overflow-hidden border-2 ${cat.borderColor} bg-card`}
                    whileHover={{ y: -8, borderColor: 'hsl(var(--accent))' }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      <motion.img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-30"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/50" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col">
                      <motion.div 
                        className={`w-16 h-16 ${cat.accent} rounded-2xl flex items-center justify-center mb-auto`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <cat.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <div>
                        <span className={`text-sm font-medium ${cat.textColor} block mb-2`}>
                          {cat.count} {lang === 'fr' ? 'références' : 'references'}
                        </span>
                        <h3 className="text-3xl font-serif text-foreground mb-4">{cat.name}</h3>
                        <div className={`flex items-center ${cat.textColor} font-medium group-hover:gap-3 transition-all`}>
                          <span>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 md:py-28 bg-background relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="container-luxe relative z-10">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-accent uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Produits ' : 'Featured '}
                <span className="italic text-accent">{lang === 'fr' ? 'vedettes' : 'products'}</span>
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="rounded-full h-12 px-6 group">
                {lang === 'fr' ? 'Voir tout' : 'View all'}
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.08}>
                <ProductCard product={product} lang={lang} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 md:py-40 bg-wood-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={botanicalsFlat} alt="" className="w-full h-full object-cover opacity-15" />
        </div>
        
        <FloatingOrb color="bg-accent" size={600} position={{ top: '-20%', right: '-10%' }} />
        <FloatingOrb color="bg-cosmetique" size={400} position={{ bottom: '-10%', left: '5%' }} delay={2} />
        
        <div className="container-luxe relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <motion.div 
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
              {lang === 'fr' ? 'Prêt à créer' : 'Ready to create'}
              <br />
              <span className="italic text-accent">{lang === 'fr' ? 'l\'exceptionnel ?' : 'the exceptional?'}</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              {lang === 'fr'
                ? "Nos experts vous accompagnent dans tous vos projets de formulation."
                : "Our experts support you in all your formulation projects."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link to={`/${lang}/contact`}>
                  <Button className="bg-accent hover:bg-accent/90 text-white h-14 px-10 rounded-full text-lg font-medium shadow-2xl shadow-accent/30 group">
                    {lang === 'fr' ? 'Demander un devis' : 'Request a quote'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};
