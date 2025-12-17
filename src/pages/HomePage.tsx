import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, Award, Users, Globe, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';

interface HomePageProps {
  lang: Language;
}

// Simple fade in component
const FadeIn = ({ 
  children, 
  delay = 0, 
  className = '' 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const featuredProducts = mockProducts.slice(0, 4);

  const categories = [
    {
      icon: Leaf,
      name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic',
      description: lang === 'fr' 
        ? 'Actifs botaniques et extraits naturels pour vos formulations beauté.' 
        : 'Botanical actives and natural extracts for your beauty formulations.',
      count: '2000+',
      color: 'cosmetique',
      image: creamJar,
      link: `/${lang}/catalogue?category=cosmetique`
    },
    {
      icon: FlaskConical,
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery',
      description: lang === 'fr'
        ? 'Essences et matières premières nobles pour créations olfactives.'
        : 'Noble essences and raw materials for olfactory creations.',
      count: '1500+',
      color: 'parfum',
      image: essentialOil,
      link: `/${lang}/catalogue?category=parfum`
    },
    {
      icon: Droplets,
      name: lang === 'fr' ? 'Arômes' : 'Flavors',
      description: lang === 'fr'
        ? 'Arômes alimentaires naturels et certifiés pour l\'industrie.'
        : 'Natural and certified food flavors for the industry.',
      count: '1500+',
      color: 'arome',
      image: blueberriesHerbs,
      link: `/${lang}/catalogue?category=arome`
    }
  ];

  const stats = [
    { icon: Sparkles, value: '5000+', label: lang === 'fr' ? 'Références' : 'References' },
    { icon: Award, value: '30+', label: lang === 'fr' ? 'Années' : 'Years' },
    { icon: Users, value: '500+', label: 'Clients' },
    { icon: Globe, value: '40+', label: lang === 'fr' ? 'Pays' : 'Countries' },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
      </Helmet>

      {/* HERO - Clean & Organic */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </motion.div>

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full pt-32 pb-24"
          style={{ opacity: heroOpacity }}
        >
          <div className="container-luxe">
            <div className="max-w-3xl">
              {/* Subtle Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {lang === 'fr' ? 'Depuis 1994' : 'Since 1994'}
              </motion.div>

              {/* Title - Elegant Serif */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[1.05] mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {lang === 'fr' ? 'Ingrédients' : 'Natural'}<br />
                <span className="text-primary italic">
                  {lang === 'fr' ? 'Naturels' : 'Ingredients'}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
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
                className="flex flex-wrap gap-4"
              >
                <Link to={`/${lang}/catalogue`}>
                  <Button size="lg" className="h-14 px-8 rounded-full text-base font-medium group">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/${lang}/entreprise`}>
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-medium border-2">
                    {lang === 'fr' ? 'Notre histoire' : 'Our story'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container-luxe">
            <motion.div 
              className="glass rounded-t-3xl py-8 px-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES - Clean Cards */}
      <section className="py-24 md:py-32 bg-secondary/50">
        <div className="container-luxe">
          <FadeIn className="text-center mb-16">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">
              {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground">
              {lang === 'fr' ? 'Trois univers' : 'Three worlds'}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.1}>
                <Link to={cat.link} className="block group h-full">
                  <article className="card-soft h-full overflow-hidden">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-${cat.color}/10 flex items-center justify-center`}>
                          <cat.icon className={`w-5 h-5 text-${cat.color}`} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{cat.count} {lang === 'fr' ? 'produits' : 'products'}</span>
                      </div>
                      
                      <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                        {cat.name}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {cat.description}
                      </p>
                      
                      <span className="inline-flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                        {lang === 'fr' ? 'Découvrir' : 'Discover'}
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT - Side by Side */}
      <section className="py-24 md:py-32">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <FadeIn>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                  <img 
                    src={botanicalsFlat} 
                    alt="Botanical ingredients"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating accent */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary/10 -z-10" />
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn delay={0.2}>
              <div className="lg:pl-8">
                <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">
                  {lang === 'fr' ? 'Notre engagement' : 'Our commitment'}
                </p>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8 leading-tight">
                  {lang === 'fr' ? 'L\'excellence au service de la nature' : 'Excellence serving nature'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {lang === 'fr'
                    ? 'Depuis 1994, nous sélectionnons les meilleurs ingrédients naturels pour accompagner les créateurs de cosmétiques, parfums et arômes du monde entier.'
                    : 'Since 1994, we have selected the finest natural ingredients to support cosmetic, perfume and flavor creators worldwide.'}
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    lang === 'fr' ? 'Sourcing éthique et durable' : 'Ethical and sustainable sourcing',
                    lang === 'fr' ? 'Certifications internationales' : 'International certifications',
                    lang === 'fr' ? 'Accompagnement technique expert' : 'Expert technical support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={`/${lang}/entreprise`}>
                  <Button variant="outline" size="lg" className="rounded-full border-2 h-12 px-6">
                    {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container-luxe">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-4">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="rounded-full border-2">
                {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} lang={lang} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Simple & Elegant */}
      <section className="py-24 md:py-32">
        <div className="container-luxe">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-8">
                {lang === 'fr' ? 'Prêt à créer ensemble ?' : 'Ready to create together?'}
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                {lang === 'fr'
                  ? 'Notre équipe d\'experts est à votre disposition pour vous accompagner dans vos projets.'
                  : 'Our team of experts is available to support you in your projects.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={`/${lang}/contact`}>
                  <Button size="lg" className="h-14 px-8 rounded-full text-base font-medium">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Button>
                </Link>
                <Link to={`/${lang}/catalogue`}>
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-medium border-2">
                    {lang === 'fr' ? 'Voir le catalogue' : 'View catalog'}
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
