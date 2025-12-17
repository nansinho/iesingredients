import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import creamJar from '@/assets/cream-jar.jpg';
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
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
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

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
        {/* Background image */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900" />
        </motion.div>

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
                <Sparkles className="w-5 h-5 text-parfum" />
                <span className="text-base uppercase tracking-[0.2em] text-white/60">
                  {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1] tracking-tight mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {lang === 'fr' ? 'Ingrédients' : 'Natural'}
                <br />
                <span className="italic text-parfum">{lang === 'fr' ? 'Naturels' : 'Ingredients'}</span>
                <br />
                <span className="text-white/80">{lang === 'fr' ? 'Premium' : 'Premium'}</span>
              </motion.h1>
              
              <motion.p 
                className="text-white/60 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {lang === 'fr'
                  ? 'Plus de 5000 références pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Over 5000 references for cosmetics, perfumery and food flavors.'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Link to={`/${lang}/catalogue`}>
                  <Button className="bg-parfum text-white hover:bg-parfum-dark h-14 px-10 rounded-full text-base font-medium shadow-lg shadow-parfum/30">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline" className="h-14 px-10 rounded-full text-base border-white/30 text-white hover:bg-white/10">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="container-luxe py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '5000+', label: lang === 'fr' ? 'Références' : 'References', color: 'text-cosmetique' },
                  { value: '30+', label: lang === 'fr' ? 'Années d\'expertise' : 'Years of Expertise', color: 'text-parfum' },
                  { value: '500+', label: 'Clients', color: 'text-arome' },
                  { value: '100%', label: lang === 'fr' ? 'Naturel' : 'Natural', color: 'text-primary' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    <span className={`text-4xl md:text-5xl font-light block mb-1 ${stat.color}`}>{stat.value}</span>
                    <span className="text-sm uppercase tracking-wider text-white/50">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-luxe">
          <AnimatedSection className="text-center mb-16">
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
          </AnimatedSection>

          {/* Category Cards - Full width, well separated */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cosmétique */}
            <AnimatedSection delay={0.1}>
              <Link to={`/${lang}/catalogue?category=cosmetique`} className="block group">
                <div className="bg-cosmetique-light rounded-3xl p-8 md:p-10 min-h-[450px] flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-cosmetique/20 border border-cosmetique/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cosmetique/10 rounded-full blur-3xl" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-cosmetique flex items-center justify-center mb-6">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  
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
                  
                  <div className="flex items-center gap-2 text-cosmetique font-medium text-lg group-hover:gap-4 transition-all">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Parfumerie */}
            <AnimatedSection delay={0.2}>
              <Link to={`/${lang}/catalogue?category=parfum`} className="block group">
                <div className="bg-parfum-light rounded-3xl p-8 md:p-10 min-h-[450px] flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-parfum/20 border border-parfum/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-parfum/10 rounded-full blur-3xl" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-parfum flex items-center justify-center mb-6">
                    <FlaskConical className="w-8 h-8 text-white" />
                  </div>
                  
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
                  
                  <div className="flex items-center gap-2 text-parfum font-medium text-lg group-hover:gap-4 transition-all">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            {/* Arômes */}
            <AnimatedSection delay={0.3}>
              <Link to={`/${lang}/catalogue?category=arome`} className="block group">
                <div className="bg-arome-light rounded-3xl p-8 md:p-10 min-h-[450px] flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-arome/20 border border-arome/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-arome/10 rounded-full blur-3xl" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-arome flex items-center justify-center mb-6">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  
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
                  
                  <div className="flex items-center gap-2 text-arome font-medium text-lg group-hover:gap-4 transition-all">
                    {lang === 'fr' ? 'Explorer' : 'Explore'}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 md:py-32 bg-slate-900 text-white">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
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
                <Button className="bg-white text-slate-900 hover:bg-white/90 h-14 px-10 rounded-full text-base font-medium">
                  {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover Our Story'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden h-64">
                    <img src={blueberriesHerbs} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-48 bg-parfum/20">
                    <img src={essentialOil} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="rounded-3xl overflow-hidden h-48 bg-cosmetique/20">
                    <img src={creamJar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-64">
                    <img src={creamBowl} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-24 md:py-32 bg-cream-200">
        <div className="container-luxe">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
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
              <Button variant="outline" className="rounded-full px-8 h-12 text-base border-foreground/20 hover:border-foreground/40">
                {lang === 'fr' ? 'Voir tout' : 'View All'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <ProductCard product={product} lang={lang} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-parfum via-parfum-dark to-arome-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container-luxe relative z-10">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
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
                <Button className="bg-white text-parfum-dark hover:bg-white/90 h-14 px-10 rounded-full text-base font-medium">
                  {lang === 'fr' ? 'Nous contacter' : 'Contact Us'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="h-14 px-10 rounded-full text-base border-white/40 text-white hover:bg-white/10">
                  {lang === 'fr' ? 'Voir le catalogue' : 'View Catalog'}
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
