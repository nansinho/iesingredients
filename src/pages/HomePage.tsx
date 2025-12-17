import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Play, ArrowDownRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';

interface HomePageProps {
  lang: Language;
}

// Animated Section Component
const AnimatedSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Card Component
const AnimatedCard = ({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const HomePage = ({ lang }: HomePageProps) => {
  const navigate = useNavigate();
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      {/* HERO SECTION - Full immersive experience */}
      <section ref={heroRef} className="h-screen relative overflow-hidden bg-foreground">
        {/* Background image with parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/60 to-foreground" />
        </motion.div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
            style={{ top: '10%', right: '10%' }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-cream-400/10 blur-[100px]"
            style={{ bottom: '20%', left: '5%' }}
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Main content */}
        <motion.div 
          className="relative z-10 h-full flex flex-col"
          style={{ opacity: heroOpacity }}
        >
          {/* Top bar */}
          <div className="container-luxe pt-32">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
              </span>
            </motion.div>
          </div>

          {/* Center content */}
          <div className="flex-1 flex items-center">
            <div className="container-luxe">
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Left: Main headline */}
                <div className="col-span-12 lg:col-span-7">
                  <motion.div
                    style={{ y: textY }}
                  >
                    <motion.h1 
                      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-[0.9] tracking-tight"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.3 }}
                    >
                      <span className="block overflow-hidden">
                        <motion.span 
                          className="block"
                          initial={{ y: 100 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        >
                          Natural
                        </motion.span>
                      </span>
                      <span className="block overflow-hidden">
                        <motion.span 
                          className="block italic text-primary"
                          initial={{ y: 100 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          Beauty
                        </motion.span>
                      </span>
                      <span className="block overflow-hidden">
                        <motion.span 
                          className="block"
                          initial={{ y: 100 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        >
                          Ingredients
                        </motion.span>
                      </span>
                    </motion.h1>
                  </motion.div>
                </div>

                {/* Right: Info panel */}
                <div className="col-span-12 lg:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="lg:pl-12"
                  >
                    <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                      {lang === 'fr'
                        ? 'Plus de 5000 ingrédients naturels et certifiés pour sublimer vos formulations cosmétiques, parfums et arômes alimentaires.'
                        : 'Over 5000 natural and certified ingredients to elevate your cosmetic formulations, perfumes and food flavors.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <Link to={`/${lang}/catalogue`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 rounded-full text-sm font-medium group">
                            {lang === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </Link>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-14 px-6 rounded-full border border-white/20 text-white text-sm flex items-center gap-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                        </div>
                        {lang === 'fr' ? 'Notre histoire' : 'Our Story'}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="container-luxe pb-12">
            <div className="flex items-end justify-between">
              {/* Stats */}
              <motion.div 
                className="hidden md:flex gap-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {[
                  { value: '5000+', label: lang === 'fr' ? 'Références' : 'References' },
                  { value: '30+', label: lang === 'fr' ? 'Années' : 'Years' },
                  { value: '500+', label: 'Clients' },
                ].map((stat, i) => (
                  <div key={i} className="text-left">
                    <span className="text-3xl font-light text-white block">{stat.value}</span>
                    <span className="text-xs uppercase tracking-wider text-white/40">{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs uppercase tracking-wider text-white/40">
                  {lang === 'fr' ? 'Défiler' : 'Scroll'}
                </span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDownRight className="w-5 h-5 text-white/40" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-6 bg-primary overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-white/80 text-sm uppercase tracking-[0.2em]">Cosmétique</span>
              <span className="text-white/30">✦</span>
              <span className="text-white/80 text-sm uppercase tracking-[0.2em]">Parfumerie</span>
              <span className="text-white/30">✦</span>
              <span className="text-white/80 text-sm uppercase tracking-[0.2em]">Arômes Alimentaires</span>
              <span className="text-white/30">✦</span>
              <span className="text-white/80 text-sm uppercase tracking-[0.2em]">Ingrédients Naturels</span>
              <span className="text-white/30">✦</span>
              <span className="text-white/80 text-sm uppercase tracking-[0.2em]">Certifié Bio</span>
              <span className="text-white/30">✦</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Bento Grid - Row 1 */}
      <section className="px-4 md:px-8 py-8 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-5">
          {/* Green Quote Card */}
          <AnimatedCard className="col-span-12 md:col-span-5" index={0}>
            <div className="bg-primary rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[360px] group cursor-pointer transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
              <motion.span 
                className="font-serif text-[120px] md:text-[140px] leading-none text-white/15 absolute -top-4 left-2"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                "
              </motion.span>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h2 className="text-2xl md:text-3xl text-white leading-tight mb-4">
                  Natural
                  <br />
                  <span className="italic">Ingredients</span>
                </h2>
                <p className="text-white/70 text-sm mb-6 max-w-[260px] leading-relaxed">
                  {lang === 'fr'
                    ? 'Des extraits botaniques soigneusement sélectionnés pour des formulations d\'exception.'
                    : 'Carefully selected botanical extracts for exceptional formulations.'}
                </p>
                <motion.button 
                  className="border border-white/40 text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-white hover:text-primary transition-all duration-300 self-start"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'fr' ? 'Découvrir' : 'Discover'}
                </motion.button>
              </div>
            </div>
          </AnimatedCard>

          {/* Image Card */}
          <AnimatedCard className="col-span-12 md:col-span-7" index={1}>
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[360px] group transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]">
              <div className="w-full md:w-1/2 h-52 md:h-auto overflow-hidden relative">
                <motion.img 
                  src={blueberriesHerbs} 
                  alt="Natural ingredients"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="w-full md:w-1/2 p-7 md:p-9 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl text-foreground leading-tight mb-4">
                  Natural
                  <br />
                  <span className="italic text-primary">Ingredients</span>
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {lang === 'fr'
                    ? 'Une sélection premium de matières premières naturelles pour vos créations.'
                    : 'A premium selection of natural raw materials for your creations.'}
                </p>
                <motion.button 
                  className="border border-foreground/20 text-foreground px-5 py-2.5 rounded-full text-xs font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 self-start"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'fr' ? 'Voir plus' : 'Learn More'}
                </motion.button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Bento Grid - Row 2 */}
      <section className="px-4 md:px-8 py-3 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-5">
          <AnimatedCard className="col-span-12 md:col-span-4" index={0}>
            <div className="bg-white rounded-3xl p-6 h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-start gap-4 mb-5">
                <motion.div 
                  className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
                  whileHover={{ rotate: 3 }}
                >
                  <img src={botanicalsFlat} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Leaf className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {lang === 'fr' ? 'Cosmétique' : 'Cosmetic'}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-foreground">
                    {lang === 'fr' ? 'Actifs Naturels' : 'Natural Actives'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mb-5 leading-relaxed">
                {lang === 'fr'
                  ? 'Extraits botaniques et actifs naturels certifiés pour vos formulations.'
                  : 'Certified botanical extracts and natural actives for your formulations.'}
              </p>
              <motion.button 
                className="border border-foreground/20 text-foreground px-4 py-2 rounded-full text-xs hover:border-primary hover:text-primary transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {lang === 'fr' ? 'Découvrir' : 'Discover'}
              </motion.button>
            </div>
          </AnimatedCard>

          <AnimatedCard className="col-span-12 md:col-span-4" index={1}>
            <div className="bg-white rounded-3xl p-6 h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-start gap-4 mb-5">
                <motion.div 
                  className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
                  whileHover={{ rotate: -3 }}
                >
                  <img src={essentialOil} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {lang === 'fr' ? 'Parfumerie' : 'Perfumery'}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-foreground">
                    {lang === 'fr' ? 'Essences Nobles' : 'Noble Essences'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mb-5 leading-relaxed">
                {lang === 'fr'
                  ? 'Matières premières nobles pour la parfumerie fine et créations olfactives.'
                  : 'Noble raw materials for fine perfumery and olfactory creations.'}
              </p>
              <motion.button 
                className="border border-foreground/20 text-foreground px-4 py-2 rounded-full text-xs hover:border-primary hover:text-primary transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
              </motion.button>
            </div>
          </AnimatedCard>

          <AnimatedCard className="col-span-12 md:col-span-4" index={2}>
            <div className="bg-gradient-to-br from-cream-300 to-cream-400 rounded-3xl p-6 relative overflow-hidden h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <motion.div 
                className="absolute -right-4 -bottom-4 w-36 h-48"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <img src={pumpBottle} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
              </motion.div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Droplets className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Collection</span>
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  {lang === 'fr' ? 'Sérums & Huiles' : 'Serums & Oils'}
                </h3>
                <p className="text-muted-foreground text-xs mb-5 leading-relaxed max-w-[150px]">
                  {lang === 'fr' ? 'Formulations premium pour soins visage et corps.' : 'Premium formulations for face and body care.'}
                </p>
                <motion.button 
                  className="border border-foreground/20 text-foreground px-4 py-2 rounded-full text-xs hover:border-primary hover:text-primary transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'fr' ? 'Voir plus' : 'View More'}
                </motion.button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Large visual section */}
      <section className="px-4 md:px-8 py-3 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-5">
          <AnimatedCard className="col-span-12 md:col-span-5" index={0}>
            <div className="rounded-3xl overflow-hidden relative min-h-[400px] group cursor-pointer">
              <motion.img 
                src={pumpBottle} 
                alt="Product"
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <span className="text-[10px] uppercase tracking-wider text-white/80 block mb-2">
                  {lang === 'fr' ? 'Nouveautés' : 'New'}
                </span>
                <h3 className="text-2xl text-white mb-4">
                  {lang === 'fr' ? 'Huiles Essentielles' : 'Essential Oils'}
                </h3>
                <motion.button 
                  className="bg-white/15 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-full text-xs hover:bg-white hover:text-primary transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'fr' ? 'Découvrir' : 'Discover'}
                </motion.button>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="col-span-12 md:col-span-7" index={1}>
            <div className="bg-primary rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[400px] group transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
              <div className="w-full md:w-1/2 h-52 md:h-auto overflow-hidden relative">
                <motion.img 
                  src={creamBowl} 
                  alt="Natural cream"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center">
                <span className="font-serif text-[90px] leading-none text-white/10 absolute top-0 left-4">"</span>
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl text-white leading-tight mb-4">
                    Excellence
                    <br />
                    <span className="italic">& Innovation</span>
                  </h2>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {lang === 'fr'
                      ? '30 ans d\'expertise au service de vos formulations les plus exigeantes.'
                      : '30 years of expertise serving your most demanding formulations.'}
                  </p>
                  <motion.button 
                    className="border border-white/40 text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-white hover:text-primary transition-all self-start"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {lang === 'fr' ? 'Notre histoire' : 'Our Story'}
                  </motion.button>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 md:px-8 py-20 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-primary mb-3 block">
              {lang === 'fr' ? 'Notre Sélection' : 'Our Selection'}
            </span>
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              {lang === 'fr' ? 'Produits ' : 'Featured '}
              <span className="italic text-primary">{lang === 'fr' ? 'Phares' : 'Products'}</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <AnimatedCard key={product.id} index={index}>
                <ProductCard product={product} lang={lang} />
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="text-center mt-10">
            <Link to={`/${lang}/catalogue`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="rounded-full px-8 h-11 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                  {lang === 'fr' ? 'Voir tout le catalogue' : 'View Full Catalog'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-24 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px]"
            style={{ top: '-20%', right: '-10%' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        
        <AnimatedSection className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl text-white mb-6 leading-tight">
            {lang === 'fr' ? 'Prêt à ' : 'Ready to '}
            <span className="italic text-primary">{lang === 'fr' ? 'collaborer ?' : 'collaborate?'}</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Contactez notre équipe d\'experts pour découvrir comment nos ingrédients peuvent sublimer vos formulations.'
              : 'Contact our team of experts to discover how our ingredients can elevate your formulations.'}
          </p>
          <Link to={`/${lang}/contact`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary text-white hover:bg-primary/90 h-14 px-12 rounded-full text-sm font-medium">
                {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </AnimatedSection>
      </section>
    </Layout>
  );
};

export default HomePage;
