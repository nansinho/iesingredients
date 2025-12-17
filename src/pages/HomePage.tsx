import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles } from 'lucide-react';
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

// Animated Card Component with hover effects
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
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const leavesY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const leavesScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/${lang}/catalogue?search=${encodeURIComponent(searchValue)}`);
    }
  };

  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="min-h-screen relative overflow-hidden bg-cream-200">
        {/* Animated Leaves with Parallax */}
        <motion.div 
          className="absolute -top-20 -right-20 w-[65%] h-[130%]"
          style={{ y: leavesY, scale: leavesScale }}
        >
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover object-left"
          />
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Content with scroll fade */}
        <motion.div 
          className="relative z-10 container-luxe pt-40 pb-20 min-h-screen flex items-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {lang === 'fr' ? 'Depuis 1994' : 'Since 1994'}
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Eco-Friendly
              <br />
              <motion.span 
                className="italic text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Cosmetic Brand
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {lang === 'fr'
                ? 'Ingrédients naturels et certifiés pour sublimer vos formulations cosmétiques premium.'
                : 'Natural certified ingredients to elevate your premium cosmetic formulations.'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-4 items-center"
            >
              <Link to={`/${lang}/catalogue`}>
                <Button className="bg-primary text-primary-foreground hover:bg-forest-700 h-12 px-8 rounded-full text-sm font-medium shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  {lang === 'fr' ? 'Découvrir nos produits' : 'Browse Products'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={`/${lang}/entreprise`} className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                {lang === 'fr' ? 'Notre histoire' : 'Our Story'}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid - Row 1 */}
      <section className="px-4 md:px-8 py-4 bg-cream-200">
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

          {/* Image Card with Blueberries */}
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
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:to-transparent" />
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

      {/* Bento Grid - Row 2: Three Cards */}
      <section className="px-4 md:px-8 py-3 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-5">
          {/* Card with small image */}
          <AnimatedCard className="col-span-12 md:col-span-4" index={0}>
            <div className="bg-white rounded-3xl p-6 h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-start gap-4 mb-5">
                <motion.div 
                  className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
                  whileHover={{ rotate: 3 }}
                  transition={{ duration: 0.3 }}
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
                  ? 'Extraits botaniques et actifs naturels certifiés pour vos formulations cosmétiques professionnelles.'
                  : 'Certified botanical extracts and natural actives for professional cosmetic formulations.'}
              </p>
              <motion.button 
                className="border border-foreground/20 text-foreground px-4 py-2 rounded-full text-xs hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {lang === 'fr' ? 'Découvrir' : 'Discover'}
              </motion.button>
            </div>
          </AnimatedCard>

          {/* Card with small image */}
          <AnimatedCard className="col-span-12 md:col-span-4" index={1}>
            <div className="bg-white rounded-3xl p-6 h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <div className="flex items-start gap-4 mb-5">
                <motion.div 
                  className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
                  whileHover={{ rotate: -3 }}
                  transition={{ duration: 0.3 }}
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
                  ? 'Matières premières nobles pour la parfumerie fine et les créations olfactives uniques.'
                  : 'Noble raw materials for fine perfumery and unique olfactory creations.'}
              </p>
              <motion.button 
                className="border border-foreground/20 text-foreground px-4 py-2 rounded-full text-xs hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
              </motion.button>
            </div>
          </AnimatedCard>

          {/* Product Showcase Card */}
          <AnimatedCard className="col-span-12 md:col-span-4" index={2}>
            <div className="bg-gradient-to-br from-cream-300 to-cream-400 rounded-3xl p-6 relative overflow-hidden h-full group transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
              <motion.div 
                className="absolute -right-4 -bottom-4 w-36 h-48"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.4 }}
              >
                <img src={pumpBottle} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
              </motion.div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Droplets className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {lang === 'fr' ? 'Collection' : 'Collection'}
                  </span>
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  {lang === 'fr' ? 'Sérums & Huiles' : 'Serums & Oils'}
                </h3>
                <p className="text-muted-foreground text-xs mb-5 leading-relaxed max-w-[150px]">
                  {lang === 'fr'
                    ? 'Formulations premium pour soins visage et corps.'
                    : 'Premium formulations for face and body care.'}
                </p>
                <motion.button 
                  className="border border-foreground/20 text-foreground px-4 py-2 rounded-full text-xs hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
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

      {/* Bento Grid - Row 3: Large Image + Green Card */}
      <section className="px-4 md:px-8 py-3 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-5">
          {/* Large Product Image Card */}
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
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-7"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[10px] uppercase tracking-wider text-white/80 block mb-2">
                  {lang === 'fr' ? 'Nouveautés' : 'New'}
                </span>
                <h3 className="text-2xl text-white mb-4">
                  {lang === 'fr' ? 'Huiles Essentielles' : 'Essential Oils'}
                </h3>
                <motion.button 
                  className="bg-white/15 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-full text-xs hover:bg-white hover:text-primary transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {lang === 'fr' ? 'Découvrir' : 'Discover'}
                </motion.button>
              </motion.div>
            </div>
          </AnimatedCard>

          {/* Green Quote Card with Image */}
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
                <motion.span 
                  className="font-serif text-[90px] leading-none text-white/10 absolute top-0 left-4"
                  whileHover={{ scale: 1.1 }}
                >
                  "
                </motion.span>
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl text-white leading-tight mb-4">
                    {lang === 'fr' ? (
                      <>
                        Excellence
                        <br />
                        <span className="italic">& Innovation</span>
                      </>
                    ) : (
                      <>
                        Excellence
                        <br />
                        <span className="italic">& Innovation</span>
                      </>
                    )}
                  </h2>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {lang === 'fr'
                      ? '30 ans d\'expertise au service de vos formulations les plus exigeantes.'
                      : '30 years of expertise serving your most demanding formulations.'}
                  </p>
                  <motion.button 
                    className="border border-white/40 text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-white hover:text-primary transition-all duration-300 self-start"
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

      {/* Products Section with Animated Title */}
      <section className="px-4 md:px-8 py-16 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <motion.span 
              className="text-xs uppercase tracking-[0.2em] text-primary mb-3 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {lang === 'fr' ? 'Notre Sélection' : 'Our Selection'}
            </motion.span>
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              {lang === 'fr' ? 'Produits' : 'Featured'}
              <span className="italic text-primary ml-2">{lang === 'fr' ? 'Phares' : 'Products'}</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {lang === 'fr'
                ? 'Découvrez notre sélection d\'ingrédients naturels les plus demandés.'
                : 'Discover our selection of most requested natural ingredients.'}
            </p>
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="rounded-full px-8 h-11 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                  {lang === 'fr' ? 'Voir tout le catalogue' : 'View Full Catalog'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 py-20 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5000+', label: lang === 'fr' ? 'Références' : 'References' },
              { value: '30+', label: lang === 'fr' ? 'Années' : 'Years' },
              { value: '500+', label: lang === 'fr' ? 'Clients' : 'Clients' },
              { value: '100%', label: lang === 'fr' ? 'Naturel' : 'Natural' },
            ].map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-default"
                >
                  <span className="text-4xl md:text-5xl font-light text-white block mb-2">{stat.value}</span>
                  <span className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-20 bg-cream-200">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-foreground mb-6">
            {lang === 'fr' ? 'Prêt à ' : 'Ready to '}
            <span className="italic text-primary">{lang === 'fr' ? 'collaborer ?' : 'collaborate?'}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Contactez notre équipe d\'experts pour découvrir comment nos ingrédients peuvent sublimer vos formulations.'
              : 'Contact our team of experts to discover how our ingredients can elevate your formulations.'}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={`/${lang}/contact`}>
              <Button className="bg-primary text-white hover:bg-forest-700 h-12 px-10 rounded-full text-sm font-medium shadow-lg">
                {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </AnimatedSection>
      </section>
    </Layout>
  );
};

export default HomePage;
