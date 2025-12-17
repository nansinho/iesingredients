import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, ArrowUpRight, Star, Play, Sparkles, Award, Users, Globe } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';

interface HomePageProps {
  lang: Language;
}

// Animated reveal component
const Reveal = ({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up'
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
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
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating ingredient card
const FloatingIngredient = ({ 
  image, 
  label, 
  className,
  delay = 0
}: { 
  image: string; 
  label: string; 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.05, y: -5 }}
    className={`absolute ${className}`}
  >
    <div className="bg-white rounded-3xl shadow-2xl p-3 backdrop-blur-sm border border-white/50">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden mb-2">
        <img src={image} alt={label} className="w-full h-full object-cover" />
      </div>
      <p className="text-xs font-medium text-foreground text-center">{label}</p>
    </div>
  </motion.div>
);

// Animated counter
const Counter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className="tabular-nums"
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {value}{suffix}
        </motion.span>
      )}
    </motion.span>
  );
};

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: parallaxProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const parallaxY1 = useTransform(parallaxProgress, [0, 1], [0, -100]);
  const parallaxY2 = useTransform(parallaxProgress, [0, 1], [0, -200]);
  const parallaxY3 = useTransform(parallaxProgress, [0, 1], [0, -50]);

  const featuredProducts = mockProducts.slice(0, 4);

  const categories = [
    {
      icon: Leaf,
      name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic',
      description: lang === 'fr' 
        ? 'Actifs botaniques et extraits naturels pour vos formulations' 
        : 'Botanical actives and natural extracts for your formulations',
      count: '2000+',
      color: 'bg-cosmetique',
      image: creamJar,
      link: `/${lang}/catalogue?category=cosmetique`
    },
    {
      icon: FlaskConical,
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery',
      description: lang === 'fr'
        ? 'Essences et matières premières nobles pour créations olfactives'
        : 'Noble essences and raw materials for olfactory creations',
      count: '1500+',
      color: 'bg-parfum',
      image: essentialOil,
      link: `/${lang}/catalogue?category=parfum`
    },
    {
      icon: Droplets,
      name: lang === 'fr' ? 'Arômes' : 'Flavors',
      description: lang === 'fr'
        ? 'Arômes alimentaires naturels et certifiés pour l\'industrie'
        : 'Natural and certified food flavors for the industry',
      count: '1500+',
      color: 'bg-arome',
      image: blueberriesHerbs,
      link: `/${lang}/catalogue?category=arome`
    }
  ];

  const stats = [
    { icon: Sparkles, value: 5000, suffix: '+', label: lang === 'fr' ? 'Références' : 'References' },
    { icon: Award, value: 30, suffix: '+', label: lang === 'fr' ? 'Années d\'expertise' : 'Years of expertise' },
    { icon: Users, value: 500, suffix: '+', label: 'Clients' },
    { icon: Globe, value: 40, suffix: '+', label: lang === 'fr' ? 'Pays' : 'Countries' },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
      </Helmet>

      {/* HERO - Immersive with floating products */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-[#1a2f23] via-[#243d2e] to-[#1a2f23]">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 50%, rgba(150,180,130,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(150,180,130,0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(150,180,130,0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Parallax background image */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{ y: heroY }}
        >
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-[120%] object-cover"
          />
        </motion.div>

        {/* Floating ingredients */}
        <FloatingIngredient 
          image={creamBowl} 
          label={lang === 'fr' ? 'Beurre de Karité' : 'Shea Butter'} 
          className="top-[15%] left-[5%] md:left-[8%] z-20"
          delay={0.5}
        />
        <FloatingIngredient 
          image={essentialOil} 
          label={lang === 'fr' ? 'Huile Essentielle' : 'Essential Oil'} 
          className="top-[25%] right-[3%] md:right-[10%] z-20"
          delay={0.7}
        />
        <FloatingIngredient 
          image={pumpBottle} 
          label={lang === 'fr' ? 'Extrait Végétal' : 'Plant Extract'} 
          className="bottom-[20%] left-[2%] md:left-[12%] z-20"
          delay={0.9}
        />
        <FloatingIngredient 
          image={serumCollection} 
          label={lang === 'fr' ? 'Sérum Bio' : 'Organic Serum'} 
          className="bottom-[15%] right-[5%] md:right-[8%] z-20"
          delay={1.1}
        />

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full py-32 md:py-40"
          style={{ opacity: heroOpacity }}
        >
          <div className="container-luxe">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}</span>
              </motion.div>

              {/* Title with split animation */}
              <div className="overflow-hidden mb-8">
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-[0.95] tracking-tight"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {lang === 'fr' ? 'Ingrédients' : 'Natural'}
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-10">
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent italic">
                    {lang === 'fr' ? 'Naturels' : 'Ingredients'}
                  </span>
                </motion.h1>
              </div>

              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed mb-12 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {lang === 'fr'
                  ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Over 5000 premium references for cosmetics, perfumery and food flavors.'}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <MagneticButton>
                  <Link to={`/${lang}/catalogue`}>
                    <Button className="h-16 px-10 rounded-full bg-white text-foreground hover:bg-white/90 text-lg font-bold shadow-2xl shadow-black/20 group">
                      {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to={`/${lang}/entreprise`}>
                    <Button variant="outline" className="h-16 px-10 rounded-full text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm group">
                      <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                      {lang === 'fr' ? 'Notre histoire' : 'Our story'}
                    </Button>
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div 
            className="w-8 h-14 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-white/60 rounded-full"
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS - Horizontal scroll on mobile */}
      <section className="py-16 md:py-24 bg-background border-b border-border">
        <div className="container-luxe">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div 
                  className="text-center group cursor-default"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <stat.icon className="w-7 h-7 text-accent" />
                  </div>
                  <span className="text-4xl md:text-5xl font-bold text-foreground block mb-2">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-muted-foreground font-medium">{stat.label}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - With parallax */}
      <section ref={parallaxRef} className="py-24 md:py-40 bg-secondary/30 relative overflow-hidden">
        {/* Parallax decorative elements */}
        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-cosmetique/10 blur-3xl"
          style={{ y: parallaxY1 }}
        />
        <motion.div 
          className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-parfum/10 blur-3xl"
          style={{ y: parallaxY2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-arome/10 blur-3xl"
          style={{ y: parallaxY3 }}
        />

        <div className="container-luxe relative z-10">
          <Reveal className="text-center mb-20">
            <span className="inline-block text-accent text-sm font-bold uppercase tracking-widest mb-4 px-4 py-2 bg-accent/10 rounded-full">
              {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
              {lang === 'fr' ? 'Trois univers, une même' : 'Three worlds, one'}
              <span className="text-accent italic"> {lang === 'fr' ? 'excellence' : 'excellence'}</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 0.15} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <Link to={cat.link} className="block group">
                  <motion.article 
                    className="relative h-[550px] rounded-[2rem] overflow-hidden cursor-pointer"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Background Image with parallax */}
                    <div className="absolute inset-0">
                      <motion.img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-end text-white">
                      {/* Icon with glow */}
                      <motion.div 
                        className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <cat.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <span className="text-white/60 text-sm font-semibold mb-2 tracking-wide">
                        {cat.count} {lang === 'fr' ? 'références' : 'references'}
                      </span>
                      
                      <h3 className="text-3xl md:text-4xl font-bold mb-4">{cat.name}</h3>
                      
                      <p className="text-white/70 text-base leading-relaxed mb-8 line-clamp-2">
                        {cat.description}
                      </p>
                      
                      <motion.div 
                        className="flex items-center gap-3 text-white font-semibold"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-lg">{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Full width parallax */}
      <section className="py-24 md:py-40 bg-background relative overflow-hidden">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal direction="left">
              <div className="relative">
                {/* Main image */}
                <motion.div 
                  className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={botanicalsFlat} 
                    alt="Botanical ingredients"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Floating cards */}
                <motion.div 
                  className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-2xl border border-border"
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <span className="text-5xl font-bold text-accent">100%</span>
                  <span className="block text-sm text-muted-foreground mt-1 font-medium">
                    {lang === 'fr' ? 'Ingrédients naturels' : 'Natural ingredients'}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-6 -left-6 bg-foreground text-white rounded-2xl p-5 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <Award className="w-8 h-8 mb-2" />
                  <span className="block text-sm font-semibold">ISO 9001</span>
                </motion.div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.2}>
              <span className="inline-block text-accent text-sm font-bold uppercase tracking-widest mb-6 px-4 py-2 bg-accent/10 rounded-full">
                {lang === 'fr' ? 'Notre histoire' : 'Our story'}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8">
                {lang === 'fr' ? "L'excellence au service de vos " : 'Excellence serving your '}
                <span className="text-accent italic">{lang === 'fr' ? 'créations' : 'creations'}</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {lang === 'fr'
                  ? "Depuis 1994, IES accompagne les professionnels de la cosmétique, de la parfumerie et de l'agroalimentaire avec une sélection rigoureuse d'ingrédients naturels."
                  : "Since 1994, IES has been supporting professionals in cosmetics, perfumery and food industries with a rigorous selection of natural ingredients."}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                {lang === 'fr'
                  ? "Notre expertise et notre engagement envers la durabilité font de nous un partenaire de confiance pour vos projets les plus ambitieux."
                  : "Our expertise and commitment to sustainability make us a trusted partner for your most ambitious projects."}
              </p>
              
              {/* Certifications with hover effect */}
              <div className="flex flex-wrap gap-3 mb-10">
                {['COSMOS', 'ECOCERT', 'BIO', 'ISO 9001', 'RSPO'].map((cert, i) => (
                  <motion.span 
                    key={cert} 
                    className="px-5 py-3 rounded-full bg-secondary text-sm font-bold text-foreground border border-border hover:border-accent hover:bg-accent/5 transition-all cursor-default"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {cert}
                  </motion.span>
                ))}
              </div>

              <MagneticButton>
                <Link to={`/${lang}/entreprise`}>
                  <Button className="h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 text-base font-bold group">
                    {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover our story'}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-40 bg-secondary/30">
        <div className="container-luxe">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <span className="inline-block text-accent text-sm font-bold uppercase tracking-widest mb-4 px-4 py-2 bg-accent/10 rounded-full">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                {lang === 'fr' ? 'Produits' : 'Featured'}
                <span className="text-accent italic"> {lang === 'fr' ? 'vedettes' : 'products'}</span>
              </h2>
            </div>
            <MagneticButton>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="h-14 px-8 rounded-full font-bold text-base group border-2 hover:border-accent hover:bg-accent/5">
                  {lang === 'fr' ? 'Voir tout' : 'View all'}
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </MagneticButton>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.1}>
                <ProductCard product={product} lang={lang} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Full screen with parallax */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        {/* Background with parallax */}
        <div className="absolute inset-0">
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/90" />
        </div>

        <div className="container-luxe relative z-10">
          <Reveal className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-10"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight">
              {lang === 'fr' ? "Prêt à créer quelque chose d'" : 'Ready to create something '}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent italic">
                {lang === 'fr' ? 'exceptionnel' : 'exceptional'}
              </span>
              {lang === 'fr' ? ' ?' : '?'}
            </h2>
            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto">
              {lang === 'fr'
                ? "Notre équipe d'experts est à votre disposition pour vous accompagner dans tous vos projets."
                : "Our team of experts is available to support you in all your projects."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link to={`/${lang}/contact`}>
                  <Button className="h-16 px-12 rounded-full bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-2xl shadow-accent/30 group">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to={`/${lang}/catalogue`}>
                  <Button variant="outline" className="h-16 px-12 rounded-full border-2 border-white/30 text-white hover:bg-white/10 text-lg font-bold">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
};
