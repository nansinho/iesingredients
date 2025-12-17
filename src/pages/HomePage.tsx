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
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
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

// Zoom on Scroll Section - THE ONLY parallax section
const ZoomParallaxSection = ({ 
  image, 
  children,
  imagePosition = 'right'
}: { 
  image: string; 
  children: React.ReactNode;
  imagePosition?: 'left' | 'right';
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Image zoom effect
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  // Text zoom effect
  const textScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  return (
    <section ref={ref} className="min-h-screen relative overflow-hidden bg-slate-900 flex items-center">
      <div className="container-luxe py-24 md:py-32">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${imagePosition === 'left' ? 'lg:grid-flow-dense' : ''}`}>
          {/* Text Content with zoom */}
          <motion.div 
            style={{ scale: textScale, opacity: textOpacity }}
            className={imagePosition === 'left' ? 'lg:col-start-2' : ''}
          >
            {children}
          </motion.div>
          
          {/* Image with zoom */}
          <div className={`relative h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden ${imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
            <motion.img 
              src={image} 
              alt="" 
              className="w-full h-full object-cover"
              style={{ scale: imageScale }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          </div>
        </div>
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
  
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  
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

  const categories = [
    {
      icon: Leaf,
      name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic',
      color: 'bg-cosmetique',
      textColor: 'text-cosmetique',
      description: lang === 'fr' 
        ? 'Actifs botaniques et extraits naturels' 
        : 'Botanical actives and natural extracts',
      link: `/${lang}/catalogue?category=cosmetique`
    },
    {
      icon: FlaskConical,
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery',
      color: 'bg-parfum',
      textColor: 'text-parfum',
      description: lang === 'fr'
        ? 'Essences et matières premières nobles'
        : 'Noble essences and raw materials',
      link: `/${lang}/catalogue?category=parfum`
    },
    {
      icon: Droplets,
      name: lang === 'fr' ? 'Arômes' : 'Flavors',
      color: 'bg-arome',
      textColor: 'text-arome',
      description: lang === 'fr'
        ? 'Arômes alimentaires certifiés'
        : 'Certified food flavors',
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

      {/* HERO - Zoom on scroll */}
      <section ref={heroRef} className="h-screen relative overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <img src={leavesHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </motion.div>

        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-parfum/30 rounded-full blur-[150px]"
          style={{ x: smoothMouseX, y: smoothMouseY }}
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

      {/* STATS */}
      <section className="py-20 bg-slate-900">
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

      {/* CATEGORIES - Simple cards */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-luxe">
          <ScrollReveal className="text-center mb-16">
            <span className="text-parfum uppercase tracking-widest text-sm font-medium mb-4 block">
              {lang === 'fr' ? 'Nos Expertises' : 'Our Expertise'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
              {lang === 'fr' ? 'Trois univers,' : 'Three worlds,'}
              <br />
              <span className="italic text-parfum">{lang === 'fr' ? 'une passion' : 'one passion'}</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 0.15}>
                <Link to={cat.link}>
                  <motion.div 
                    className="group relative bg-slate-50 rounded-3xl p-10 h-full hover:shadow-2xl transition-all duration-500"
                    whileHover={{ y: -8 }}
                  >
                    <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <cat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-2xl md:text-3xl font-medium ${cat.textColor} mb-4`}>{cat.name}</h3>
                    <p className="text-muted-foreground text-lg mb-6">{cat.description}</p>
                    <div className={`flex items-center ${cat.textColor} font-medium group-hover:gap-3 transition-all`}>
                      <span>{lang === 'fr' ? 'Découvrir' : 'Discover'}</span>
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ZOOM PARALLAX SECTION - L'unique section immersive */}
      <ZoomParallaxSection image={botanicalsFlat} imagePosition="right">
        <div className="text-white">
          <span className="text-parfum uppercase tracking-widest text-sm font-medium mb-6 block">
            {lang === 'fr' ? 'Notre Histoire' : 'Our Story'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-[1.1]">
            {lang === 'fr' ? "L'excellence" : 'Excellence'}
            <br />
            <span className="italic text-parfum">{lang === 'fr' ? 'depuis 1994' : 'since 1994'}</span>
          </h2>
          <p className="text-white/70 text-xl md:text-2xl mb-8 leading-relaxed">
            {lang === 'fr'
              ? "Depuis trois décennies, IES accompagne les formulateurs les plus exigeants avec une sélection rigoureuse d'ingrédients naturels et une expertise reconnue dans l'industrie."
              : "For three decades, IES has been supporting the most demanding formulators with a rigorous selection of natural ingredients and recognized industry expertise."}
          </p>
          <Link to={`/${lang}/entreprise`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-parfum text-white hover:bg-parfum-dark h-14 px-10 rounded-full text-lg">
                {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </ZoomParallaxSection>

      {/* QUOTE SECTION */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-parfum/5 rounded-full blur-3xl" />
        <div className="container-luxe relative z-10">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <Quote className="w-12 h-12 text-parfum/30 mx-auto mb-8" />
            <blockquote className="text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8 italic">
              {lang === 'fr'
                ? '"La nature nous offre ses plus beaux trésors. Notre mission est de les préserver et les sublimer."'
                : '"Nature offers us its finest treasures. Our mission is to preserve and enhance them."'}
            </blockquote>
            <cite className="text-muted-foreground text-lg not-italic">
              — {lang === 'fr' ? 'Fondateur, IES Ingredients' : 'Founder, IES Ingredients'}
            </cite>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="container-luxe">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-parfum uppercase tracking-widest text-sm font-medium mb-4 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-foreground">
                {lang === 'fr' ? 'Produits à la une' : 'Featured Products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <motion.div whileHover={{ x: 5 }}>
                <Button variant="outline" className="rounded-full h-12 px-8">
                  {lang === 'fr' ? 'Voir tout' : 'View all'}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <ProductCard product={product} lang={lang} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={essentialOil} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-luxe relative z-10">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8">
              {lang === 'fr' ? 'Prêt à découvrir' : 'Ready to discover'}
              <br />
              <span className="italic text-parfum">{lang === 'fr' ? 'nos ingrédients ?' : 'our ingredients?'}</span>
            </h2>
            <p className="text-white/60 text-xl mb-10 max-w-xl mx-auto">
              {lang === 'fr'
                ? "Notre équipe d'experts est à votre disposition pour vous accompagner dans vos projets."
                : "Our team of experts is at your disposal to support you in your projects."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={`/${lang}/contact`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-parfum text-white hover:bg-parfum-dark h-14 px-10 rounded-full text-lg">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-10 rounded-full text-lg">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};
