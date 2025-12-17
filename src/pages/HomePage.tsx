import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, Award, Users, Globe, ChevronRight, Quote, Star, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import leavesHero from '@/assets/leaves-hero.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import serumCollection from '@/assets/serum-collection.jpg';

interface HomePageProps {
  lang: Language;
}

// Animated reveal component
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating decorative element
const FloatingShape = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 5, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
  />
);

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
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const parallaxY = useTransform(parallaxProgress, [0, 1], [100, -100]);

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
      gradient: 'from-emerald-500/20 to-teal-500/20',
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
      gradient: 'from-amber-500/20 to-orange-500/20',
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
      gradient: 'from-rose-500/20 to-pink-500/20',
      image: blueberriesHerbs,
      link: `/${lang}/catalogue?category=arome`
    }
  ];

  const stats = [
    { icon: Sparkles, value: '5000+', label: lang === 'fr' ? 'Références' : 'References', description: lang === 'fr' ? 'ingrédients naturels' : 'natural ingredients' },
    { icon: Award, value: '30+', label: lang === 'fr' ? 'Années' : 'Years', description: lang === 'fr' ? 'd\'expertise' : 'of expertise' },
    { icon: Users, value: '500+', label: 'Clients', description: lang === 'fr' ? 'dans le monde' : 'worldwide' },
    { icon: Globe, value: '40+', label: lang === 'fr' ? 'Pays' : 'Countries', description: lang === 'fr' ? 'livrés' : 'delivered' },
  ];

  const testimonials = [
    {
      quote: lang === 'fr' 
        ? "La qualité des ingrédients IES est exceptionnelle. Un partenaire de confiance depuis 10 ans."
        : "The quality of IES ingredients is exceptional. A trusted partner for 10 years.",
      author: "Marie Dubois",
      role: lang === 'fr' ? "Directrice R&D, Cosmétiques Naturels" : "R&D Director, Natural Cosmetics"
    },
    {
      quote: lang === 'fr'
        ? "Service impeccable et expertise technique remarquable. Ils comprennent nos besoins."
        : "Impeccable service and remarkable technical expertise. They understand our needs.",
      author: "Jean-Pierre Martin",
      role: lang === 'fr' ? "Chef Parfumeur, Maison de Parfum" : "Master Perfumer, Fragrance House"
    }
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
      </Helmet>

      {/* HERO - Rich & Immersive */}
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
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Decorative floating elements */}
        <FloatingShape 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" 
          delay={0}
        />
        <FloatingShape 
          className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl" 
          delay={2}
        />

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full pt-32 pb-40"
          style={{ opacity: heroOpacity }}
        >
          <div className="container-luxe">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left content */}
              <div>
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm mb-8"
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </span>
                  <span className="h-4 w-px bg-border" />
                  <span className="text-sm font-medium text-foreground">{lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}</span>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[0.95] mb-4">
                    {lang === 'fr' ? 'Ingrédients' : 'Natural'}
                  </h1>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.95] mb-8">
                    <span className="text-primary italic">{lang === 'fr' ? 'Naturels' : 'Ingredients'}</span>
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {lang === 'fr'
                    ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires. Qualité, traçabilité et expertise depuis 30 ans.'
                    : 'Over 5000 premium references for cosmetics, perfumery and food flavors. Quality, traceability and expertise for 30 years.'}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link to={`/${lang}/catalogue`}>
                    <Button size="lg" className="h-14 px-8 rounded-full text-base font-medium group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                      {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to={`/${lang}/entreprise`}>
                    <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-medium border-2 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                      {lang === 'fr' ? 'Notre histoire' : 'Our story'}
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-12 flex items-center gap-6"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <Users className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">500+ {lang === 'fr' ? 'clients satisfaits' : 'happy clients'}</p>
                    <p className="text-xs text-muted-foreground">{lang === 'fr' ? 'dans le monde entier' : 'worldwide'}</p>
                  </div>
                </motion.div>
              </div>

              {/* Right - Featured Image Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50">
                    <img 
                      src={serumCollection} 
                      alt="Natural ingredients"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating card */}
                  <motion.div 
                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-serif font-semibold text-foreground">100%</p>
                        <p className="text-sm text-muted-foreground">{lang === 'fr' ? 'Naturel' : 'Natural'}</p>
                      </div>
                    </div>
                  </motion.div>
                  {/* Decorative circle */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 border-primary/20 -z-10" />
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
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1 h-2 bg-foreground/40 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS - Elegant Cards */}
      <section className="py-20 bg-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary)/0.03),transparent_50%)]" />
        <div className="container-luxe relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 text-center group hover:bg-white hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Premium Cards */}
      <section ref={parallaxRef} className="py-24 md:py-32 relative overflow-hidden">
        {/* Parallax background element */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl"
          style={{ y: parallaxY }}
        />

        <div className="container-luxe relative">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4 px-4 py-2 bg-primary/5 rounded-full">
              {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
              {lang === 'fr' ? 'Trois univers d\'excellence' : 'Three worlds of excellence'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {lang === 'fr' 
                ? 'Découvrez notre gamme complète d\'ingrédients naturels, soigneusement sélectionnés pour répondre à vos besoins.'
                : 'Discover our complete range of natural ingredients, carefully selected to meet your needs.'}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.15} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <Link to={cat.link} className="block group h-full">
                  <article className="card-soft h-full overflow-hidden relative">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      {/* Count badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-foreground shadow-sm">
                        {cat.count}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-${cat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <cat.icon className={`w-6 h-6 text-${cat.color}`} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {cat.description}
                      </p>
                      
                      <span className="inline-flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                        {lang === 'fr' ? 'Explorer' : 'Explore'}
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT - Side by Side with Rich Details */}
      <section className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent" />
        
        <div className="container-luxe relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <FadeIn direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img 
                    src={botanicalsFlat} 
                    alt="Botanical ingredients"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Experience badge */}
                <motion.div 
                  className="absolute -bottom-8 -right-8 md:right-8 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-4xl font-serif font-bold">30+</p>
                  <p className="text-sm opacity-90">{lang === 'fr' ? 'ans d\'expertise' : 'years expertise'}</p>
                </motion.div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-2 border-primary/20 -z-10" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-accent/10 blur-2xl -z-10" />
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn delay={0.2} direction="right">
              <div>
                <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4 px-4 py-2 bg-primary/5 rounded-full">
                  {lang === 'fr' ? 'Notre engagement' : 'Our commitment'}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8 leading-tight">
                  {lang === 'fr' ? 'L\'excellence au service de la nature' : 'Excellence serving nature'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {lang === 'fr'
                    ? 'Depuis 1994, nous sélectionnons les meilleurs ingrédients naturels pour accompagner les créateurs de cosmétiques, parfums et arômes du monde entier. Notre expertise et notre réseau nous permettent de vous offrir une qualité exceptionnelle.'
                    : 'Since 1994, we have selected the finest natural ingredients to support cosmetic, perfume and flavor creators worldwide. Our expertise and network allow us to offer you exceptional quality.'}
                </p>
                
                {/* Features grid */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {[
                    { icon: Leaf, text: lang === 'fr' ? 'Sourcing éthique' : 'Ethical sourcing' },
                    { icon: Award, text: lang === 'fr' ? 'Certifications' : 'Certifications' },
                    { icon: Users, text: lang === 'fr' ? 'Support expert' : 'Expert support' },
                    { icon: Globe, text: lang === 'fr' ? 'Livraison mondiale' : 'Global delivery' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/50 border border-border/50">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/${lang}/entreprise`}>
                  <Button size="lg" className="rounded-full h-12 px-6 group">
                    {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover our story'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32">
        <div className="container-luxe">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4 px-4 py-2 bg-primary/5 rounded-full">
              {lang === 'fr' ? 'Témoignages' : 'Testimonials'}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">
              {lang === 'fr' ? 'Ils nous font confiance' : 'They trust us'}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-border/50 shadow-sm hover:shadow-lg transition-shadow">
                  <Quote className="w-10 h-10 text-primary/20 mb-6" />
                  <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 font-serif italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-serif font-semibold text-primary">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container-luxe">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4 px-4 py-2 bg-primary/5 rounded-full">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="rounded-full border-2 group">
                {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

      {/* CTA - Rich & Compelling */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <FloatingShape className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <FloatingShape className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-3xl" delay={3} />
        
        <div className="container-luxe relative">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4 px-4 py-2 bg-primary/5 rounded-full">
                {lang === 'fr' ? 'Commençons' : 'Let\'s start'}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-8 leading-tight">
                {lang === 'fr' ? 'Prêt à créer quelque chose d\'extraordinaire ?' : 'Ready to create something extraordinary?'}
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                {lang === 'fr'
                  ? 'Notre équipe d\'experts est à votre disposition pour vous accompagner dans vos projets les plus ambitieux.'
                  : 'Our team of experts is available to support you in your most ambitious projects.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={`/${lang}/contact`}>
                  <Button size="lg" className="h-14 px-8 rounded-full text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
