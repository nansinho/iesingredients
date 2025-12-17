import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';

interface HomePageProps {
  lang: Language;
}

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', color }: { value: number; suffix?: string; color: string }) => {
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
  
  return (
    <span ref={ref} className={color}>
      {displayValue}{suffix}
    </span>
  );
};

// Parallax Image Component
const ParallaxImage = ({ src, alt, className, speed = 0.5 }: { src: string; alt: string; className?: string; speed?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-30 * speed}%`, `${30 * speed}%`]);
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img 
        src={src} 
        alt={alt} 
        className="w-full h-[120%] object-cover"
        style={{ y }}
      />
    </div>
  );
};

// Reveal on Scroll Component
const ScrollReveal = ({ children, className = '', direction = 'up', delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const directions = {
    up: { y: 80, x: 0 },
    down: { y: -80, x: 0 },
    left: { y: 0, x: 80 },
    right: { y: 0, x: -80 },
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale on Scroll Component
const ScaleOnScroll = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  
  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
};

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: categoriesProgress } = useScroll({
    target: categoriesRef,
    offset: ["start end", "end start"]
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  
  // Smooth spring for mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      {/* HERO SECTION */}
      <section ref={heroRef} className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background image with parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900" />
        </motion.div>

        {/* Floating elements with mouse parallax */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-parfum/20 rounded-full blur-[100px]"
          style={{ x: smoothMouseX, y: smoothMouseY }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-cosmetique/20 rounded-full blur-[80px]"
          style={{ x: useTransform(smoothMouseX, v => -v * 1.5), y: useTransform(smoothMouseY, v => -v * 1.5) }}
        />

        {/* Content */}
        <motion.div 
          className="relative z-10 min-h-screen flex flex-col justify-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="container-luxe py-32">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-parfum" />
                </motion.div>
                <span className="text-base uppercase tracking-[0.2em] text-white/60">
                  {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
                </span>
              </motion.div>
              
              <div className="overflow-hidden">
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1] tracking-tight mb-8"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {lang === 'fr' ? 'Ingrédients' : 'Natural'}
                  <br />
                  <motion.span 
                    className="italic text-parfum inline-block"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {lang === 'fr' ? 'Naturels' : 'Ingredients'}
                  </motion.span>
                  <br />
                  <motion.span 
                    className="text-white/80 inline-block"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Premium
                  </motion.span>
                </motion.h1>
              </div>
              
              <motion.p 
                className="text-white/60 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {lang === 'fr'
                  ? 'Plus de 5000 références pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Over 5000 references for cosmetics, perfumery and food flavors.'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link to={`/${lang}/catalogue`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-parfum text-white hover:bg-parfum-dark h-14 px-10 rounded-full text-base font-medium shadow-lg shadow-parfum/30">
                      {lang === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="h-14 px-10 rounded-full text-base border-white/30 text-white hover:bg-white/10">
                      {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Stats bar with animated counters */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="container-luxe py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: 5000, suffix: '+', label: lang === 'fr' ? 'Références' : 'References', color: 'text-cosmetique' },
                  { value: 30, suffix: '+', label: lang === 'fr' ? 'Années d\'expertise' : 'Years of Expertise', color: 'text-parfum' },
                  { value: 500, suffix: '+', label: 'Clients', color: 'text-arome' },
                  { value: 100, suffix: '%', label: lang === 'fr' ? 'Naturel' : 'Natural', color: 'text-primary' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    <span className={`text-4xl md:text-5xl font-light block mb-1`}>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} color={stat.color} />
                    </span>
                    <span className="text-sm uppercase tracking-wider text-white/50">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CATEGORIES SECTION */}
      <section ref={categoriesRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Animated background shapes */}
        <motion.div 
          className="absolute top-20 -left-32 w-64 h-64 bg-cosmetique/5 rounded-full blur-3xl"
          style={{ 
            y: useTransform(categoriesProgress, [0, 1], [100, -100]),
          }}
        />
        <motion.div 
          className="absolute bottom-20 -right-32 w-96 h-96 bg-parfum/5 rounded-full blur-3xl"
          style={{ 
            y: useTransform(categoriesProgress, [0, 1], [-100, 100]),
          }}
        />

        <div className="container-luxe relative z-10">
          <ScrollReveal className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
              {lang === 'fr' ? 'Nos Domaines' : 'Our Domains'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              {lang === 'fr' ? 'Trois univers,' : 'Three worlds,'}
              <br />
              <span className="italic">{lang === 'fr' ? 'une expertise' : 'one expertise'}</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              {lang === 'fr'
                ? 'Découvrez notre expertise à travers trois catégories distinctes d\'ingrédients naturels.'
                : 'Discover our expertise through three distinct categories of natural ingredients.'}
            </p>
          </ScrollReveal>

          {/* Category Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cosmétique */}
            <ScrollReveal delay={0.1} direction="up">
              <Link to={`/${lang}/catalogue?category=cosmetique`} className="block group h-full">
                <motion.div 
                  className="bg-cosmetique-light rounded-3xl p-8 md:p-10 min-h-[480px] flex flex-col transition-all duration-500 border border-cosmetique/10 relative overflow-hidden h-full"
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 30px 60px -15px rgba(200,100,120,0.3)",
                  }}
                >
                  <motion.div 
                    className="absolute top-0 right-0 w-48 h-48 bg-cosmetique/10 rounded-full blur-3xl"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-cosmetique flex items-center justify-center mb-6"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <Leaf className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <span className="text-sm uppercase tracking-widest text-cosmetique font-semibold mb-3">
                    {lang === 'fr' ? 'Cosmétique' : 'Cosmetic'}
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl text-foreground mb-4 leading-tight">
                    {lang === 'fr' ? 'Actifs & Extraits' : 'Actives & Extracts'}
                    <br />
                    <span className="italic text-cosmetique">{lang === 'fr' ? 'Naturels' : 'Natural'}</span>
                  </h3>
                  
                  <p className="text-muted-foreground text-base md:text-lg mb-8 flex-1 leading-relaxed">
                    {lang === 'fr'
                      ? 'Extraits botaniques, huiles végétales et actifs naturels certifiés pour vos formulations cosmétiques professionnelles.'
                      : 'Botanical extracts, vegetable oils and certified natural actives for your professional cosmetic formulations.'}
                  </p>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-cosmetique font-medium text-lg"
                    whileHover={{ x: 10 }}
                  >
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </ScrollReveal>

            {/* Parfumerie */}
            <ScrollReveal delay={0.2} direction="up">
              <Link to={`/${lang}/catalogue?category=parfum`} className="block group h-full">
                <motion.div 
                  className="bg-parfum-light rounded-3xl p-8 md:p-10 min-h-[480px] flex flex-col transition-all duration-500 border border-parfum/10 relative overflow-hidden h-full"
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 30px 60px -15px rgba(200,150,50,0.3)",
                  }}
                >
                  <motion.div 
                    className="absolute top-0 right-0 w-48 h-48 bg-parfum/10 rounded-full blur-3xl"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-parfum flex items-center justify-center mb-6"
                    whileHover={{ rotate: -10, scale: 1.1 }}
                  >
                    <FlaskConical className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <span className="text-sm uppercase tracking-widest text-parfum font-semibold mb-3">
                    {lang === 'fr' ? 'Parfumerie' : 'Perfumery'}
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl text-foreground mb-4 leading-tight">
                    {lang === 'fr' ? 'Essences &' : 'Essences &'}
                    <br />
                    <span className="italic text-parfum">{lang === 'fr' ? 'Matières Nobles' : 'Noble Materials'}</span>
                  </h3>
                  
                  <p className="text-muted-foreground text-base md:text-lg mb-8 flex-1 leading-relaxed">
                    {lang === 'fr'
                      ? 'Matières premières nobles et essences rares pour la parfumerie fine et les créations olfactives d\'exception.'
                      : 'Noble raw materials and rare essences for fine perfumery and exceptional olfactory creations.'}
                  </p>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-parfum font-medium text-lg"
                    whileHover={{ x: 10 }}
                  >
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </ScrollReveal>

            {/* Arômes */}
            <ScrollReveal delay={0.3} direction="up">
              <Link to={`/${lang}/catalogue?category=arome`} className="block group h-full">
                <motion.div 
                  className="bg-arome-light rounded-3xl p-8 md:p-10 min-h-[480px] flex flex-col transition-all duration-500 border border-arome/10 relative overflow-hidden h-full"
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 30px 60px -15px rgba(220,100,80,0.3)",
                  }}
                >
                  <motion.div 
                    className="absolute top-0 right-0 w-48 h-48 bg-arome/10 rounded-full blur-3xl"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-arome flex items-center justify-center mb-6"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <Droplets className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <span className="text-sm uppercase tracking-widest text-arome font-semibold mb-3">
                    {lang === 'fr' ? 'Arômes' : 'Flavors'}
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl text-foreground mb-4 leading-tight">
                    {lang === 'fr' ? 'Arômes' : 'Food'}
                    <br />
                    <span className="italic text-arome">{lang === 'fr' ? 'Alimentaires' : 'Flavors'}</span>
                  </h3>
                  
                  <p className="text-muted-foreground text-base md:text-lg mb-8 flex-1 leading-relaxed">
                    {lang === 'fr'
                      ? 'Arômes naturels et certifiés pour l\'industrie agroalimentaire, boissons et compléments nutritionnels.'
                      : 'Natural and certified flavors for the food industry, beverages and nutritional supplements.'}
                  </p>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-arome font-medium text-lg"
                    whileHover={{ x: 10 }}
                  >
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION with Parallax Images */}
      <section className="py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <span className="text-sm uppercase tracking-[0.2em] text-parfum mb-4 block">
                {lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                {lang === 'fr' ? '30 ans' : '30 years'}
                <br />
                <span className="italic text-parfum">{lang === 'fr' ? 'd\'excellence' : 'of excellence'}</span>
              </h2>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8">
                {lang === 'fr'
                  ? 'Depuis 1994, IES Ingredients accompagne les professionnels de la cosmétique, de la parfumerie et de l\'agroalimentaire avec une sélection rigoureuse d\'ingrédients naturels de haute qualité.'
                  : 'Since 1994, IES Ingredients has been supporting cosmetics, perfumery and food industry professionals with a rigorous selection of high-quality natural ingredients.'}
              </p>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10">
                {lang === 'fr'
                  ? 'Notre expertise et notre engagement envers la qualité nous permettent de proposer plus de 5000 références certifiées et traçables.'
                  : 'Our expertise and commitment to quality allow us to offer more than 5000 certified and traceable references.'}
              </p>
              <Link to={`/${lang}/entreprise`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-white text-slate-900 hover:bg-white/90 h-14 px-10 rounded-full text-base font-medium">
                    {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover Our Story'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ParallaxImage src={blueberriesHerbs} alt="" className="rounded-3xl h-64" speed={0.3} />
                  <ParallaxImage src={essentialOil} alt="" className="rounded-3xl h-48" speed={0.5} />
                </div>
                <div className="space-y-4 pt-12">
                  <ParallaxImage src={creamJar} alt="" className="rounded-3xl h-48" speed={0.4} />
                  <ParallaxImage src={creamBowl} alt="" className="rounded-3xl h-64" speed={0.6} />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-24 md:py-32 bg-cream-200">
        <div className="container-luxe">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground">
                {lang === 'fr' ? 'Produits' : 'Featured'}
                <span className="italic text-primary ml-3">{lang === 'fr' ? 'Phares' : 'Products'}</span>
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="rounded-full px-8 h-12 text-base border-foreground/20 hover:border-foreground/40">
                  {lang === 'fr' ? 'Voir tout' : 'View All'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1} direction="up">
                <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                  <ProductCard product={product} lang={lang} />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-parfum via-parfum-dark to-arome-dark relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        <div className="container-luxe relative z-10">
          <ScaleOnScroll className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              {lang === 'fr' ? 'Prêt à créer' : 'Ready to create'}
              <br />
              <span className="italic">{lang === 'fr' ? 'quelque chose d\'exceptionnel ?' : 'something exceptional?'}</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {lang === 'fr'
                ? 'Contactez notre équipe d\'experts pour découvrir comment nos ingrédients peuvent transformer vos formulations.'
                : 'Contact our team of experts to discover how our ingredients can transform your formulations.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={`/${lang}/contact`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-white text-parfum-dark hover:bg-white/90 h-14 px-10 rounded-full text-base font-medium">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="h-14 px-10 rounded-full text-base border-white/40 text-white hover:bg-white/10">
                    {lang === 'fr' ? 'Voir le catalogue' : 'View Catalog'}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </ScaleOnScroll>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
