import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, Award, Users, Globe, Star, ArrowUpRight, Check, Play, Phone, Zap } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';

interface HomePageProps {
  lang: Language;
}

// Animated reveal with 3D effect
const FadeIn = ({ 
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const variants = {
    up: { y: 60, rotateX: 10 },
    down: { y: -60, rotateX: -10 },
    left: { x: 60, rotateY: -10 },
    right: { x: -60, rotateY: 10 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...variants[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

// 3D Card with hover
const Card3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        rotateX: -5,
        z: 50
      }}
      transition={{ duration: 0.3 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

// Floating element
const FloatingElement = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    animate={{ 
      y: [0, -15, 0],
      rotate: [0, 2, 0]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
  >
    {children}
  </motion.div>
);

// Counter animation
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
      className="inline-block"
    >
      {value}{suffix}
    </motion.span>
  );
};

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Smooth spring-based parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(smoothProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.3]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, -100]);
  const textY = useTransform(smoothProgress, [0, 1], [0, 80]);

  // Only 3 featured products
  const featuredProducts = mockProducts.slice(0, 3);

  const stats = [
    { value: '5000', suffix: '+', label: lang === 'fr' ? 'Références' : 'References', icon: Sparkles },
    { value: '30', suffix: '+', label: lang === 'fr' ? 'Années' : 'Years', icon: Award },
    { value: '500', suffix: '+', label: 'Clients', icon: Users },
    { value: '40', suffix: '+', label: lang === 'fr' ? 'Pays' : 'Countries', icon: Globe },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
      </Helmet>

      {/* HERO - Dark & Bold with smooth parallax */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-forest-950">
        {/* Background Image with smooth parallax */}
        <motion.div 
          className="absolute inset-0 will-change-transform"
          style={{ scale: heroScale, y: bgY }}
        >
          <img src={leavesHero} alt="" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950" />
        </motion.div>

        {/* Animated background particles/orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main gold orb */}
          <motion.div 
            className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px]"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Secondary green orb */}
          <motion.div 
            className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-forest-400/15 blur-[100px]"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          {/* Small floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold-400/40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
          {/* Gradient sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Content with parallax */}
        <motion.div 
          className="relative z-10 min-h-screen flex items-center pt-20"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <div className="container-luxe">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left - Text */}
              <div>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-8"
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-gold-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-gold-300 text-sm font-medium">{lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}</span>
                </motion.div>

                {/* Title */}
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.95] mb-8"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  {lang === 'fr' ? 'Ingrédients' : 'Natural'}<br />
                  <span className="text-gold italic">{lang === 'fr' ? 'Naturels' : 'Ingredients'}</span>
                </motion.h1>

                {/* Description */}
                <motion.p 
                  className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {lang === 'fr'
                    ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires.'
                    : 'Over 5000 premium references for cosmetics, perfumery and food flavors.'}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap gap-4 mb-12"
                >
                  <Link to={`/${lang}/catalogue`}>
                    <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25 group">
                      {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to={`/${lang}/entreprise`}>
                    <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-semibold border-2 border-white/30 text-white hover:bg-white/10 group">
                      <Play className="mr-2 w-5 h-5 fill-current" />
                      {lang === 'fr' ? 'Notre histoire' : 'Our story'}
                    </Button>
                  </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="grid grid-cols-4 gap-4"
                >
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-2xl md:text-3xl font-serif font-bold text-white">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-xs text-white/50">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right - Bento Grid */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="hidden lg:block"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Large card */}
                  <Card3D className="col-span-2">
                    <div className="relative h-[280px] rounded-3xl overflow-hidden group">
                      <img src={serumCollection} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
                          <span className="text-white/60 text-xs ml-2">5.0</span>
                        </div>
                        <p className="text-white font-serif text-xl">{lang === 'fr' ? 'Collection Premium' : 'Premium Collection'}</p>
                      </div>
                      {/* Floating badge */}
                      <FloatingElement className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 rounded-full bg-gold-500 text-forest-950 text-xs font-bold shadow-lg">
                          {lang === 'fr' ? 'Nouveau' : 'New'}
                        </div>
                      </FloatingElement>
                    </div>
                  </Card3D>

                  {/* Small cards */}
                  <Card3D>
                    <div className="relative h-[200px] rounded-2xl overflow-hidden group">
                      <img src={essentialOil} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-gold-300 text-xs uppercase tracking-widest mb-1">{lang === 'fr' ? 'Parfumerie' : 'Perfumery'}</p>
                        <p className="text-white font-medium">1500+</p>
                      </div>
                    </div>
                  </Card3D>

                  <Card3D>
                    <div className="relative h-[200px] rounded-2xl overflow-hidden group">
                      <img src={blueberriesHerbs} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-gold-300 text-xs uppercase tracking-widest mb-1">{lang === 'fr' ? 'Arômes' : 'Flavors'}</p>
                        <p className="text-white font-medium">1500+</p>
                      </div>
                    </div>
                  </Card3D>

                  {/* Feature card */}
                  <Card3D className="col-span-2">
                    <div className="h-[120px] rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center">
                          <Leaf className="w-7 h-7 text-gold-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">100% {lang === 'fr' ? 'Naturel' : 'Natural'}</p>
                          <p className="text-white/50 text-sm">{lang === 'fr' ? 'Certifié Bio, Cosmos, Ecocert' : 'Certified Organic, Cosmos, Ecocert'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {[Check, Check, Check].map((Icon, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-green-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1 h-2 bg-gold-400 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* PARTNERS - Organic curve transition */}
      <section className="relative">
        {/* Curved transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-forest-950">
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,64 960,64 1440,0 L1440,64 L0,64 Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
        
        <div className="pt-32 pb-16 bg-background">
          <div className="container-luxe">
            <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap opacity-40">
              {['L\'Oréal', 'Givaudan', 'Firmenich', 'Symrise', 'IFF', 'Mane'].map((partner, i) => (
                <motion.span 
                  key={i}
                  className="text-xl md:text-2xl font-serif text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {partner}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES - Bold Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-[0.2em] mb-4">
              {lang === 'fr' ? 'Notre catalogue' : 'Our catalog'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-4">
              {lang === 'fr' ? 'Trois univers' : 'Three worlds'}<br />
              <span className="text-gold">{lang === 'fr' ? 'd\'excellence' : 'of excellence'}</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic', 
                count: '2000+', 
                desc: lang === 'fr' ? 'Actifs botaniques et extraits naturels' : 'Botanical actives and natural extracts',
                image: creamJar,
                gradient: 'from-emerald-600/90 to-teal-800/90',
                icon: Leaf,
                link: `/${lang}/catalogue?category=cosmetique`
              },
              { 
                name: lang === 'fr' ? 'Parfumerie' : 'Perfumery', 
                count: '1500+', 
                desc: lang === 'fr' ? 'Essences et matières premières nobles' : 'Noble essences and raw materials',
                image: essentialOil,
                gradient: 'from-amber-500/90 to-orange-700/90',
                icon: FlaskConical,
                link: `/${lang}/catalogue?category=parfum`
              },
              { 
                name: lang === 'fr' ? 'Arômes' : 'Flavors', 
                count: '1500+', 
                desc: lang === 'fr' ? 'Arômes alimentaires naturels' : 'Natural food flavors',
                image: blueberriesHerbs,
                gradient: 'from-rose-500/90 to-pink-800/90',
                icon: Droplets,
                link: `/${lang}/catalogue?category=arome`
              }
            ].map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.15}>
                <Link to={cat.link} className="block group">
                  <Card3D>
                    <div className="relative h-[500px] rounded-[2rem] overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <motion.div 
                            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                          >
                            <cat.icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-bold">
                            {cat.count}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-4xl font-serif font-bold text-white mb-3">
                            {cat.name}
                          </h3>
                          <p className="text-white/80 mb-6">{cat.desc}</p>
                          <div className="flex items-center gap-3 text-white font-semibold">
                            <span>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                            <motion.div
                              className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                              whileHover={{ x: 5 }}
                            >
                              <ArrowRight className="w-5 h-5 text-forest-900" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT - Split with organic shape */}
      <section className="py-24 md:py-32 bg-forest-950 relative overflow-hidden">
        {/* Organic shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-forest-600/20 blur-[80px]" />
        
        <div className="container-luxe relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <FadeIn direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
                  <img src={botanicalsFlat} alt="" className="w-full h-full object-cover" />
                </div>
                {/* Floating badge */}
                <FloatingElement className="absolute -bottom-6 -right-6 md:right-6">
                  <div className="bg-gold-500 text-forest-950 rounded-2xl p-6 shadow-2xl shadow-gold-500/30">
                    <p className="text-5xl font-serif font-bold">30+</p>
                    <p className="text-sm font-semibold">{lang === 'fr' ? 'ans d\'expertise' : 'years expertise'}</p>
                  </div>
                </FloatingElement>
                {/* Decorative ring */}
                <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full border-4 border-gold-500/20 -z-10" />
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn delay={0.2} direction="right">
              <div>
                <span className="inline-block text-gold-400 font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                  {lang === 'fr' ? 'Notre engagement' : 'Our commitment'}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-tight">
                  {lang === 'fr' ? 'L\'excellence au service de ' : 'Excellence serving '}
                  <span className="text-gold italic">{lang === 'fr' ? 'la nature' : 'nature'}</span>
                </h2>
                <p className="text-lg text-white/60 leading-relaxed mb-10">
                  {lang === 'fr'
                    ? 'Depuis 1994, nous sélectionnons les meilleurs ingrédients naturels pour accompagner les créateurs de cosmétiques, parfums et arômes du monde entier.'
                    : 'Since 1994, we have selected the finest natural ingredients to support cosmetic, perfume and flavor creators worldwide.'}
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {[
                    { icon: Leaf, text: lang === 'fr' ? 'Sourcing éthique' : 'Ethical sourcing' },
                    { icon: Award, text: lang === 'fr' ? 'Certifications' : 'Certifications' },
                    { icon: Zap, text: lang === 'fr' ? 'Livraison rapide' : 'Fast delivery' },
                    { icon: Users, text: lang === 'fr' ? 'Support expert' : 'Expert support' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gold-400" />
                      </div>
                      <span className="text-white font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <Link to={`/${lang}/entreprise`}>
                  <Button size="lg" className="h-14 px-8 rounded-full bg-gold-500 text-forest-950 hover:bg-gold-400 font-semibold group">
                    {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover our story'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Curved transition */}
      <div className="bg-forest-950">
        <svg className="w-full h-16" viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
          <path d="M0,64 C480,0 960,0 1440,64 L1440,64 L0,64 Z" fill="hsl(var(--background))"/>
        </svg>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Produits' : 'Featured'} <span className="text-gold italic">{lang === 'fr' ? 'vedettes' : 'products'}</span>
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="rounded-full border-2 border-forest-200 hover:bg-forest-100 group font-semibold">
                {lang === 'fr' ? 'Voir tout' : 'View all'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} lang={lang} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS / ACTUALITÉS */}
      <section className="py-24 md:py-32 bg-secondary/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 blur-[100px]" />
        
        <div className="container-luxe relative">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-gold-600 font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                {lang === 'fr' ? 'Actualités' : 'News'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Dernières' : 'Latest'} <span className="text-gold italic">{lang === 'fr' ? 'nouvelles' : 'news'}</span>
              </h2>
            </div>
            <Link to={`/${lang}/actualites`}>
              <Button variant="outline" className="rounded-full border-2 border-forest-200 hover:bg-forest-100 group font-semibold">
                {lang === 'fr' ? 'Toutes les actualités' : 'All news'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured article - Large */}
            <FadeIn className="lg:col-span-2">
              <Link to={`/${lang}/actualites`} className="block group">
                <Card3D>
                  <article className="relative h-[400px] rounded-3xl overflow-hidden">
                    <img 
                      src={botanicalsFlat} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-gold-500 text-forest-950 text-xs font-bold">
                          {lang === 'fr' ? 'À la une' : 'Featured'}
                        </span>
                        <span className="text-white/60 text-sm">15 Dec 2024</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 group-hover:text-gold-300 transition-colors">
                        {lang === 'fr' 
                          ? 'IES Ingredients obtient la certification Cosmos pour sa gamme bio'
                          : 'IES Ingredients obtains Cosmos certification for its organic range'}
                      </h3>
                      <p className="text-white/70 line-clamp-2">
                        {lang === 'fr'
                          ? 'Une nouvelle étape dans notre engagement pour des ingrédients naturels et durables.'
                          : 'A new milestone in our commitment to natural and sustainable ingredients.'}
                      </p>
                    </div>
                  </article>
                </Card3D>
              </Link>
            </FadeIn>

            {/* Side articles */}
            <div className="space-y-6">
              {[
                {
                  date: '10 Dec 2024',
                  title: lang === 'fr' ? 'Nouveaux extraits de Madagascar' : 'New extracts from Madagascar',
                  category: lang === 'fr' ? 'Produits' : 'Products',
                  image: essentialOil
                },
                {
                  date: '05 Dec 2024',
                  title: lang === 'fr' ? 'Salon In-Cosmetics Paris 2025' : 'In-Cosmetics Paris 2025 Trade Show',
                  category: lang === 'fr' ? 'Événements' : 'Events',
                  image: creamJar
                }
              ].map((article, i) => (
                <FadeIn key={i} delay={0.1 + i * 0.1}>
                  <Link to={`/${lang}/actualites`} className="block group">
                    <Card3D>
                      <article className="flex gap-4 bg-white rounded-2xl p-4 border border-border/50 group-hover:shadow-lg transition-all">
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img 
                            src={article.image} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gold-600 text-xs font-semibold">{article.category}</span>
                            <span className="text-muted-foreground text-xs">• {article.date}</span>
                          </div>
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                      </article>
                    </Card3D>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Bold */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-900 relative overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--gold-500) / 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
        
        <div className="container-luxe relative">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10 text-gold-400" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-tight">
                {lang === 'fr' ? 'Prêt à créer quelque chose ' : 'Ready to create something '}
                <span className="text-gold italic">{lang === 'fr' ? 'd\'extraordinaire' : 'extraordinary'}</span> ?
              </h2>
              
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
                {lang === 'fr'
                  ? 'Notre équipe d\'experts est à votre disposition pour vous accompagner dans vos projets les plus ambitieux.'
                  : 'Our team of experts is available to support you in your most ambitious projects.'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={`/${lang}/contact`}>
                  <Button size="lg" className="h-16 px-10 rounded-full bg-gold-500 text-forest-950 hover:bg-gold-400 font-bold text-lg shadow-xl shadow-gold-500/30 group">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/${lang}/catalogue`}>
                  <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg">
                    <Phone className="mr-3 w-5 h-5" />
                    {lang === 'fr' ? 'Demander un devis' : 'Request quote'}
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};
