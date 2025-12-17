import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, ChevronRight, Quote } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';

interface HomePageProps {
  lang: Language;
}

// Animated Counter
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
  
  return <span ref={ref} className={color}>{displayValue}{suffix}</span>;
};

// Scroll Reveal
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

// Full Screen Parallax Section
const ParallaxSection = ({ 
  image, 
  children, 
  overlay = true,
  className = '' 
}: { 
  image: string; 
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={ref} className={`relative min-h-screen overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-0 w-full h-[140%] -top-[20%]"
        style={{ y }}
      >
        <img src={image} alt="" className="w-full h-full object-cover" />
        {overlay && <div className="absolute inset-0 bg-black/50" />}
      </motion.div>
      <motion.div className="relative z-10 min-h-screen flex items-center" style={{ opacity }}>
        {children}
      </motion.div>
    </section>
  );
};

// Horizontal Scroll Section
const HorizontalScroll = ({ children }: { children: React.ReactNode }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={targetRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8">
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  
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

      {/* HERO - Full Screen Immersive */}
      <section ref={heroRef} className="h-screen relative overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img src={leavesHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </motion.div>

        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-parfum/30 rounded-full blur-[150px]"
          style={{ x: smoothMouseX, y: smoothMouseY }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-cosmetique/20 rounded-full blur-[100px]"
          style={{ x: useTransform(smoothMouseX, v => -v * 1.5), y: useTransform(smoothMouseY, v => -v * 1.5) }}
        />

        <motion.div 
          className="relative z-10 h-full flex flex-col justify-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="container-luxe">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <Sparkles className="w-5 h-5 text-parfum" />
                <span className="text-lg uppercase tracking-[0.2em] text-white/60">
                  {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
                </span>
              </motion.div>
              
              <div className="overflow-hidden">
                <motion.h1 
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white leading-[0.95] tracking-tight mb-10"
                  initial={{ y: 120 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {lang === 'fr' ? 'Ingrédients' : 'Natural'}
                  <br />
                  <span className="italic text-parfum">{lang === 'fr' ? 'Naturels' : 'Ingredients'}</span>
                </motion.h1>
              </div>
              
              <motion.p 
                className="text-white/60 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                <Link to={`/${lang}/catalogue`}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-parfum text-white hover:bg-parfum-dark h-16 px-12 rounded-full text-lg font-medium shadow-2xl shadow-parfum/40">
                      {lang === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-white/40 text-sm uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-3 bg-parfum rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS - Floating Bar */}
      <section className="py-16 bg-slate-900">
        <div className="container-luxe">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 5000, suffix: '+', label: lang === 'fr' ? 'Références' : 'References', color: 'text-cosmetique' },
              { value: 30, suffix: '+', label: lang === 'fr' ? 'Années' : 'Years', color: 'text-parfum' },
              { value: 500, suffix: '+', label: 'Clients', color: 'text-arome' },
              { value: 100, suffix: '%', label: lang === 'fr' ? 'Naturel' : 'Natural', color: 'text-primary' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <span className="text-5xl md:text-6xl font-light block mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} color={stat.color} />
                </span>
                <span className="text-sm uppercase tracking-widest text-white/50">{stat.label}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* COSMÉTIQUE - Parallax Immersive */}
      <ParallaxSection image={botanicalsFlat} className="bg-cosmetique">
        <div className="container-luxe py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="w-20 h-20 rounded-3xl bg-cosmetique flex items-center justify-center mb-8">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <span className="text-lg uppercase tracking-widest text-cosmetique-light font-semibold mb-4 block">
                {lang === 'fr' ? 'Cosmétique' : 'Cosmetic'}
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
                {lang === 'fr' ? 'Actifs &' : 'Actives &'}
                <br />
                <span className="italic">{lang === 'fr' ? 'Extraits Naturels' : 'Natural Extracts'}</span>
              </h2>
              <p className="text-white/70 text-xl md:text-2xl mb-10 leading-relaxed max-w-xl">
                {lang === 'fr'
                  ? 'Extraits botaniques, huiles végétales et actifs certifiés pour des formulations cosmétiques d\'exception.'
                  : 'Botanical extracts, vegetable oils and certified actives for exceptional cosmetic formulations.'}
              </p>
              <Link to={`/${lang}/catalogue?category=cosmetique`}>
                <motion.div whileHover={{ scale: 1.05, x: 10 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-cosmetique text-white hover:bg-cosmetique-dark h-14 px-10 rounded-full text-lg">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="ml-2 w-6 h-6" />
                  </Button>
                </motion.div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* PARFUMERIE - Parallax Immersive */}
      <ParallaxSection image={essentialOil} className="bg-parfum-dark">
        <div className="container-luxe py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:col-start-2">
              <ScrollReveal direction="right">
                <div className="w-20 h-20 rounded-3xl bg-parfum flex items-center justify-center mb-8">
                  <FlaskConical className="w-10 h-10 text-white" />
                </div>
                <span className="text-lg uppercase tracking-widest text-parfum-light font-semibold mb-4 block">
                  {lang === 'fr' ? 'Parfumerie' : 'Perfumery'}
                </span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
                  {lang === 'fr' ? 'Essences &' : 'Essences &'}
                  <br />
                  <span className="italic">{lang === 'fr' ? 'Matières Nobles' : 'Noble Materials'}</span>
                </h2>
                <p className="text-white/70 text-xl md:text-2xl mb-10 leading-relaxed max-w-xl">
                  {lang === 'fr'
                    ? 'Matières premières nobles et essences rares pour la parfumerie fine et les créations olfactives uniques.'
                    : 'Noble raw materials and rare essences for fine perfumery and unique olfactory creations.'}
                </p>
                <Link to={`/${lang}/catalogue?category=parfum`}>
                  <motion.div whileHover={{ scale: 1.05, x: 10 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-parfum text-white hover:bg-parfum-dark h-14 px-10 rounded-full text-lg">
                      {lang === 'fr' ? 'Explorer' : 'Explore'}
                      <ChevronRight className="ml-2 w-6 h-6" />
                    </Button>
                  </motion.div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* ARÔMES - Parallax Immersive */}
      <ParallaxSection image={blueberriesHerbs} className="bg-arome-dark">
        <div className="container-luxe py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="w-20 h-20 rounded-3xl bg-arome flex items-center justify-center mb-8">
                <Droplets className="w-10 h-10 text-white" />
              </div>
              <span className="text-lg uppercase tracking-widest text-arome-light font-semibold mb-4 block">
                {lang === 'fr' ? 'Arômes' : 'Flavors'}
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
                {lang === 'fr' ? 'Arômes' : 'Food'}
                <br />
                <span className="italic">{lang === 'fr' ? 'Alimentaires' : 'Flavors'}</span>
              </h2>
              <p className="text-white/70 text-xl md:text-2xl mb-10 leading-relaxed max-w-xl">
                {lang === 'fr'
                  ? 'Arômes naturels et certifiés pour l\'industrie agroalimentaire et les compléments nutritionnels.'
                  : 'Natural and certified flavors for the food industry and nutritional supplements.'}
              </p>
              <Link to={`/${lang}/catalogue?category=arome`}>
                <motion.div whileHover={{ scale: 1.05, x: 10 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-arome text-white hover:bg-arome-dark h-14 px-10 rounded-full text-lg">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="ml-2 w-6 h-6" />
                  </Button>
                </motion.div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* QUOTE SECTION */}
      <section className="py-32 md:py-48 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-parfum/5 rounded-full blur-3xl" />
        <div className="container-luxe relative z-10">
          <ScrollReveal className="max-w-5xl mx-auto text-center">
            <Quote className="w-16 h-16 text-parfum/30 mx-auto mb-8" />
            <blockquote className="text-3xl md:text-4xl lg:text-5xl text-foreground leading-relaxed mb-8 italic">
              {lang === 'fr'
                ? '"L\'excellence n\'est pas un acte, mais une habitude. Depuis 30 ans, nous sélectionnons les meilleurs ingrédients naturels."'
                : '"Excellence is not an act, but a habit. For 30 years, we have been selecting the finest natural ingredients."'}
            </blockquote>
            <p className="text-muted-foreground text-xl">— IES Ingredients</p>
          </ScrollReveal>
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
                <Button variant="outline" className="rounded-full px-8 h-14 text-lg border-foreground/20 hover:border-foreground/40">
                  {lang === 'fr' ? 'Voir tout' : 'View All'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                  <ProductCard product={product} lang={lang} />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Final Parallax */}
      <ParallaxSection image={creamBowl} overlay={true}>
        <div className="container-luxe py-32">
          <ScrollReveal className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-white mb-10 leading-tight">
              {lang === 'fr' ? 'Prêt à créer' : 'Ready to create'}
              <br />
              <span className="italic text-parfum">{lang === 'fr' ? 'l\'exceptionnel ?' : 'the exceptional?'}</span>
            </h2>
            <p className="text-white/70 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {lang === 'fr'
                ? 'Contactez notre équipe d\'experts pour transformer vos formulations.'
                : 'Contact our team of experts to transform your formulations.'}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to={`/${lang}/contact`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-parfum text-white hover:bg-parfum-dark h-16 px-12 rounded-full text-lg font-medium shadow-2xl">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </motion.div>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="h-16 px-12 rounded-full text-lg border-white/40 text-white hover:bg-white/10">
                    {lang === 'fr' ? 'Voir le catalogue' : 'View Catalog'}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </ParallaxSection>
    </Layout>
  );
};

export default HomePage;
