import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, ChevronRight, Play, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';

interface HomePageProps {
  lang: Language;
}

// Magnetic Button Component
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

// Animated Text Reveal
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

// Floating Orb Component
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
    className={`absolute rounded-full blur-[100px] ${color}`}
    style={{ width: size, height: size, ...position }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// Scroll Progress Line
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-parfum to-arome origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// Animated Counter with Spring
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

// Scroll Reveal with Multiple Directions
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const variants = {
    up: { y: 60, opacity: 0 },
    down: { y: -60, opacity: 0 },
    left: { x: 60, opacity: 0 },
    right: { x: -60, opacity: 0 },
    scale: { scale: 0.9, opacity: 0 },
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

// Parallax Image Section
const ParallaxSection = ({ 
  image, 
  children,
  overlay = true
}: { 
  image: string; 
  children: React.ReactNode;
  overlay?: boolean;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div 
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{ y, scale }}
      >
        <img src={image} alt="" className="w-full h-full object-cover" />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-wood-950/80 via-wood-950/60 to-wood-950/90" />
        )}
      </motion.div>
      <motion.div 
        className="relative z-10 min-h-screen flex items-center"
        style={{ opacity }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Bento Grid Item
const BentoItem = ({ 
  children, 
  className = '',
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => (
  <ScrollReveal delay={delay} direction="scale">
    <motion.div 
      className={`relative overflow-hidden rounded-3xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  </ScrollReveal>
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
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "100%"]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 30);
      mouseY.set((clientY - innerHeight / 2) / 30);
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
      color: 'from-cosmetique/20 to-cosmetique/5',
      accent: 'bg-cosmetique',
      textColor: 'text-cosmetique',
      image: creamJar,
      link: `/${lang}/catalogue?category=cosmetique`
    },
    {
      icon: FlaskConical,
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery',
      count: '1500+',
      color: 'from-parfum/20 to-parfum/5',
      accent: 'bg-parfum',
      textColor: 'text-parfum',
      image: essentialOil,
      link: `/${lang}/catalogue?category=parfum`
    },
    {
      icon: Droplets,
      name: lang === 'fr' ? 'Arômes' : 'Flavors',
      count: '1500+',
      color: 'from-arome/20 to-arome/5',
      accent: 'bg-arome',
      textColor: 'text-arome',
      image: blueberriesHerbs,
      link: `/${lang}/catalogue?category=arome`
    }
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      <ScrollProgress />

      {/* HERO - Immersive Full Screen */}
      <section ref={heroRef} className="h-screen relative overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img src={leavesHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-wood-950/70 via-wood-950/50 to-wood-950/90" />
        </motion.div>

        {/* Floating Orbs */}
        <motion.div style={{ x: smoothMouseX, y: smoothMouseY }}>
          <FloatingOrb color="bg-accent" size={400} position={{ top: '20%', right: '20%' }} />
        </motion.div>
        <motion.div style={{ x: useTransform(smoothMouseX, v => -v * 1.5), y: useTransform(smoothMouseY, v => -v * 1.5) }}>
          <FloatingOrb color="bg-primary" size={300} position={{ bottom: '30%', left: '15%' }} delay={2} />
        </motion.div>
        <FloatingOrb color="bg-parfum" size={200} position={{ top: '60%', right: '40%' }} delay={4} />

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 h-full flex flex-col justify-center"
          style={{ opacity: heroOpacity, y: heroTextY }}
        >
          <div className="container-luxe">
            <div className="max-w-5xl">
              {/* Overline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-px w-12 bg-accent" />
                <span className="text-sm uppercase tracking-[0.3em] text-white/60 font-medium">
                  {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
                </span>
              </motion.div>
              
              {/* Main Heading with Animated Words */}
              <h1 className="mb-8">
                <TextReveal 
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif text-white leading-[0.9] tracking-tight"
                  delay={0.4}
                >
                  {lang === 'fr' ? 'Ingrédients' : 'Ingredients'}
                </TextReveal>
                <div className="h-[1.1em] overflow-hidden mt-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWord}
                      initial={{ y: 80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -80, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                      className="block text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif italic text-accent leading-[0.9]"
                    >
                      {words[currentWord]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
              
              {/* Description */}
              <motion.p 
                className="text-white/50 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {lang === 'fr'
                  ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Over 5000 premium references for cosmetics, perfumery and food flavors.'}
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap gap-4"
              >
                <MagneticButton>
                  <Link to={`/${lang}/catalogue`}>
                    <Button className="bg-accent hover:bg-accent/90 text-white h-16 px-10 rounded-full text-lg font-medium shadow-2xl shadow-accent/30 group">
                      {lang === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to={`/${lang}/entreprise`}>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 px-10 rounded-full text-lg font-medium backdrop-blur-sm group">
                      <Play className="mr-3 w-5 h-5" />
                      {lang === 'fr' ? 'Notre histoire' : 'Our Story'}
                    </Button>
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS - Floating Cards */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-wood-950 via-transparent to-transparent h-32" />
        
        <div className="container-luxe relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 5000, suffix: '+', label: lang === 'fr' ? 'Références' : 'References', color: 'from-cosmetique to-cosmetique/50' },
              { value: 30, suffix: '+', label: lang === 'fr' ? 'Années d\'expertise' : 'Years of expertise', color: 'from-parfum to-parfum/50' },
              { value: 500, suffix: '+', label: lang === 'fr' ? 'Clients satisfaits' : 'Happy clients', color: 'from-arome to-arome/50' },
              { value: 100, suffix: '%', label: lang === 'fr' ? 'Ingrédients naturels' : 'Natural ingredients', color: 'from-primary to-primary/50' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="scale">
                <motion.div 
                  className="relative p-8 rounded-3xl bg-card border border-border/50 overflow-hidden group"
                  whileHover={{ y: -5, borderColor: 'hsl(var(--accent) / 0.3)' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
                  <span className="text-5xl md:text-6xl font-serif font-semibold text-foreground block mb-3">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Bento Grid */}
      <section className="py-24 md:py-32 bg-background relative">
        <div className="container-luxe">
          <ScrollReveal className="text-center mb-20">
            <span className="text-accent uppercase tracking-[0.3em] text-sm font-medium mb-6 block">
              {lang === 'fr' ? 'Nos Univers' : 'Our Worlds'}
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-foreground mb-6">
              {lang === 'fr' ? 'Trois expertises,' : 'Three expertises,'}
            </h2>
            <p className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-accent">
              {lang === 'fr' ? 'une passion' : 'one passion'}
            </p>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <BentoItem key={cat.name} delay={i * 0.15} className="h-[450px] group">
                <Link to={cat.link} className="block h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-90`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-wood-950/90 via-wood-950/40 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                    <div className={`w-14 h-14 ${cat.accent} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <cat.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white/60 text-sm font-medium mb-2">{cat.count} {lang === 'fr' ? 'références' : 'references'}</span>
                    <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">{cat.name}</h3>
                    <div className="flex items-center text-white/80 font-medium group-hover:text-accent transition-colors">
                      <span>{lang === 'fr' ? 'Découvrir' : 'Discover'}</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </BentoItem>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX STORY SECTION */}
      <ParallaxSection image={botanicalsFlat}>
        <div className="container-luxe py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <span className="text-accent uppercase tracking-[0.3em] text-sm font-medium mb-8 block">
                {lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-[1.1]">
                {lang === 'fr' ? "L'excellence" : 'Excellence'}
                <br />
                <span className="italic text-accent">{lang === 'fr' ? 'depuis 1994' : 'since 1994'}</span>
              </h2>
              <p className="text-white/60 text-xl md:text-2xl mb-10 leading-relaxed font-light">
                {lang === 'fr'
                  ? "Depuis trois décennies, IES accompagne les formulateurs les plus exigeants avec une sélection rigoureuse d'ingrédients naturels et une expertise reconnue dans l'industrie."
                  : "For three decades, IES has been supporting the most demanding formulators with a rigorous selection of natural ingredients and recognized industry expertise."}
              </p>
              <MagneticButton>
                <Link to={`/${lang}/entreprise`}>
                  <Button className="bg-accent hover:bg-accent/90 text-white h-14 px-10 rounded-full text-lg font-medium group">
                    {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '100%', label: lang === 'fr' ? 'Traçabilité' : 'Traceability' },
                  { value: '50+', label: lang === 'fr' ? 'Pays' : 'Countries' },
                  { value: '24h', label: lang === 'fr' ? 'Réactivité' : 'Response time' },
                  { value: 'ISO', label: lang === 'fr' ? 'Certifié' : 'Certified' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <span className="text-3xl md:text-4xl font-serif text-accent block mb-2">{item.value}</span>
                    <span className="text-white/60 text-sm">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-secondary/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container-luxe relative z-10">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <span className="text-accent uppercase tracking-[0.3em] text-sm font-medium mb-4 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground">
                {lang === 'fr' ? 'Produits' : 'Featured'}
                <span className="italic text-accent ml-4">{lang === 'fr' ? 'vedettes' : 'products'}</span>
              </h2>
            </div>
            <MagneticButton>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="rounded-full h-14 px-8 text-base group">
                  {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </MagneticButton>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <ProductCard product={product} lang={lang} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Final Section */}
      <section className="py-32 md:py-48 bg-wood-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={essentialOil} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-wood-950/80 to-wood-950" />
        </div>
        
        <FloatingOrb color="bg-accent" size={500} position={{ top: '10%', right: '10%' }} />
        <FloatingOrb color="bg-primary" size={400} position={{ bottom: '20%', left: '5%' }} delay={3} />
        
        <div className="container-luxe relative z-10">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <span className="text-accent uppercase tracking-[0.3em] text-sm font-medium mb-8 block">
              {lang === 'fr' ? 'Commencez maintenant' : 'Start now'}
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
              {lang === 'fr' ? 'Prêt à découvrir' : 'Ready to discover'}
              <br />
              <span className="italic text-accent">{lang === 'fr' ? 'l\'excellence naturelle ?' : 'natural excellence?'}</span>
            </h2>
            <p className="text-white/50 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              {lang === 'fr'
                ? "Notre équipe d'experts vous accompagne dans tous vos projets de formulation."
                : "Our team of experts supports you in all your formulation projects."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link to={`/${lang}/contact`}>
                  <Button className="bg-accent hover:bg-accent/90 text-white h-16 px-12 rounded-full text-lg font-medium shadow-2xl shadow-accent/30 group">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to={`/${lang}/catalogue`}>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 px-12 rounded-full text-lg font-medium backdrop-blur-sm">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
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
