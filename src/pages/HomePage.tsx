import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, ArrowUpRight, Star } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';

interface HomePageProps {
  lang: Language;
}

// Simple fade in animation
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

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
      lightColor: 'bg-cosmetique/10',
      textColor: 'text-cosmetique',
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
      lightColor: 'bg-parfum/10',
      textColor: 'text-parfum',
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
      lightColor: 'bg-arome/10',
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
      </Helmet>

      {/* HERO - Clean & Elegant */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />
        </div>

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full py-32 md:py-40"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="container-luxe">
            <div className="max-w-2xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8"
              >
                <Star className="w-4 h-4 fill-current" />
                <span>{lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}</span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-foreground leading-[1.05] mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {lang === 'fr' ? 'Ingrédients' : 'Natural'}
                <br />
                <span className="text-accent italic">{lang === 'fr' ? 'Naturels' : 'Ingredients'}</span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {lang === 'fr'
                  ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Over 5000 premium references for cosmetics, perfumery and food flavors.'}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to={`/${lang}/catalogue`}>
                  <Button className="h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 text-base font-medium group">
                    {lang === 'fr' ? 'Découvrir le catalogue' : 'Discover catalog'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline" className="h-14 px-8 rounded-full text-base font-medium border-foreground/20 hover:bg-foreground/5">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="flex gap-12 mt-16 pt-8 border-t border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {[
                  { value: '5000+', label: lang === 'fr' ? 'Références' : 'References' },
                  { value: '30+', label: lang === 'fr' ? 'Années' : 'Years' },
                  { value: '500+', label: 'Clients' },
                ].map((stat, i) => (
                  <div key={i}>
                    <span className="text-3xl md:text-4xl font-serif text-foreground">{stat.value}</span>
                    <span className="block text-sm text-muted-foreground mt-1">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          <FadeIn className="max-w-xl mb-16">
            <span className="text-accent text-sm font-semibold uppercase tracking-wider mb-4 block">
              {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
            </span>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground leading-tight">
              {lang === 'fr' ? 'Trois univers, une même exigence de qualité' : 'Three worlds, one quality standard'}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.1}>
                <Link to={cat.link} className="block group">
                  <article className="relative h-[480px] rounded-3xl overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-end text-white">
                      <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <cat.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <span className="text-white/60 text-sm font-medium mb-2">
                        {cat.count} {lang === 'fr' ? 'références' : 'references'}
                      </span>
                      
                      <h3 className="text-3xl font-serif mb-3">{cat.name}</h3>
                      
                      <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-2">
                        {cat.description}
                      </p>
                      
                      <div className="flex items-center text-white/80 text-sm font-medium group-hover:text-accent transition-colors">
                        <span>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                        <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 md:py-32 bg-secondary/50">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                  <img 
                    src={botanicalsFlat} 
                    alt="Botanical ingredients"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl max-w-[200px]">
                  <span className="text-4xl font-serif text-accent">100%</span>
                  <span className="block text-sm text-muted-foreground mt-1">
                    {lang === 'fr' ? 'Ingrédients naturels' : 'Natural ingredients'}
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <span className="text-accent text-sm font-semibold uppercase tracking-wider mb-4 block">
                {lang === 'fr' ? 'Notre histoire' : 'Our story'}
              </span>
              <h2 className="text-4xl md:text-5xl font-medium text-foreground leading-tight mb-8">
                {lang === 'fr' ? "L'excellence au service de vos créations" : 'Excellence serving your creations'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {lang === 'fr'
                  ? "Depuis 1994, IES accompagne les professionnels de la cosmétique, de la parfumerie et de l'agroalimentaire avec une sélection rigoureuse d'ingrédients naturels de la plus haute qualité."
                  : "Since 1994, IES has been supporting professionals in cosmetics, perfumery and food industries with a rigorous selection of the highest quality natural ingredients."}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                {lang === 'fr'
                  ? "Notre expertise et notre engagement envers la durabilité font de nous un partenaire de confiance pour vos projets les plus ambitieux."
                  : "Our expertise and commitment to sustainability make us a trusted partner for your most ambitious projects."}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                {['COSMOS', 'ECOCERT', 'BIO', 'ISO 9001'].map((cert) => (
                  <span key={cert} className="px-4 py-2 rounded-full bg-foreground/5 text-sm font-medium text-foreground/70">
                    {cert}
                  </span>
                ))}
              </div>

              <Link to={`/${lang}/entreprise`}>
                <Button variant="outline" className="h-12 px-6 rounded-full text-base group">
                  {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-accent text-sm font-semibold uppercase tracking-wider mb-4 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl font-medium text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="h-12 px-6 rounded-full group">
                {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.08}>
                <ProductCard product={product} lang={lang} index={index} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container-luxe">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 leading-tight">
              {lang === 'fr' ? 'Prêt à créer quelque chose d\'exceptionnel ?' : 'Ready to create something exceptional?'}
            </h2>
            <p className="text-xl text-background/60 mb-10 max-w-xl mx-auto">
              {lang === 'fr'
                ? "Notre équipe d'experts est à votre disposition pour vous accompagner dans tous vos projets."
                : "Our team of experts is available to support you in all your projects."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={`/${lang}/contact`}>
                <Button className="h-14 px-10 rounded-full bg-accent hover:bg-accent/90 text-white text-lg font-medium group">
                  {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="h-14 px-10 rounded-full border-background/20 text-background hover:bg-background/10 text-lg font-medium">
                  {lang === 'fr' ? 'Explorer' : 'Explore'}
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};
