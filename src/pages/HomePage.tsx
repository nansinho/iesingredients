import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, Award, Users, Globe, Star, ArrowUpRight, Check, Phone, Mail, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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

// Animated reveal
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Marquee for logos
const Marquee = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`overflow-hidden ${className}`}>
    <motion.div
      className="flex gap-16 items-center"
      animate={{ x: [0, -1000] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      {children}
      {children}
    </motion.div>
  </div>
);

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const featuredProducts = mockProducts.slice(0, 4);

  const stats = [
    { value: '5000+', label: lang === 'fr' ? 'Références' : 'References' },
    { value: '30+', label: lang === 'fr' ? 'Années' : 'Years' },
    { value: '500+', label: 'Clients' },
    { value: '40+', label: lang === 'fr' ? 'Pays' : 'Countries' },
  ];

  const partners = ['L\'Oréal', 'Givaudan', 'Firmenich', 'Symrise', 'IFF', 'Mane', 'Robertet', 'Takasago'];

  const services = [
    { 
      icon: Leaf, 
      title: lang === 'fr' ? 'Sourcing Éthique' : 'Ethical Sourcing',
      description: lang === 'fr' ? 'Traçabilité complète et fournisseurs certifiés' : 'Complete traceability and certified suppliers'
    },
    { 
      icon: FlaskConical, 
      title: lang === 'fr' ? 'Expertise Technique' : 'Technical Expertise',
      description: lang === 'fr' ? 'Accompagnement R&D personnalisé' : 'Personalized R&D support'
    },
    { 
      icon: Globe, 
      title: lang === 'fr' ? 'Livraison Mondiale' : 'Global Delivery',
      description: lang === 'fr' ? 'Expédition rapide dans 40+ pays' : 'Fast shipping to 40+ countries'
    },
    { 
      icon: Award, 
      title: lang === 'fr' ? 'Certifications' : 'Certifications',
      description: lang === 'fr' ? 'Bio, Cosmos, Ecocert, RSPO' : 'Organic, Cosmos, Ecocert, RSPO'
    },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels.' : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors.'} />
      </Helmet>

      {/* HERO - Bento Style */}
      <section ref={heroRef} className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-gradient-to-b from-sage-50 to-background">
        {/* Decorative shapes */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-parfum/5 to-cosmetique/5 blur-3xl -z-10" />

        <div className="container-luxe">
          {/* Top row - Title and CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Main title card */}
            <motion.div 
              className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 border border-border/50 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{lang === 'fr' ? 'Noté 5/5 par nos clients' : 'Rated 5/5 by our clients'}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground leading-[1.05] mb-6">
                {lang === 'fr' ? 'Ingrédients' : 'Premium'}<br />
                <span className="text-primary">{lang === 'fr' ? 'Naturels Premium' : 'Natural Ingredients'}</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                {lang === 'fr'
                  ? 'Découvrez notre catalogue de plus de 5000 ingrédients pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Discover our catalog of over 5000 ingredients for cosmetics, perfumery and food flavors.'}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to={`/${lang}/catalogue`}>
                  <Button size="lg" className="h-14 px-8 rounded-full text-base font-medium group">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-base font-medium border-2">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats card */}
            <motion.div 
              className="lg:col-span-5 bg-primary rounded-[2rem] p-8 text-primary-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <span className="text-sm font-medium opacity-80 uppercase tracking-widest">{lang === 'fr' ? 'Depuis 1994' : 'Since 1994'}</span>
                  <p className="text-2xl font-serif mt-2">{lang === 'fr' ? '30 ans d\'excellence au service de vos créations' : '30 years of excellence serving your creations'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/10">
                      <p className="text-3xl font-serif font-bold">{stat.value}</p>
                      <p className="text-sm opacity-80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bento grid - Images and features */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-6">
            {/* Large image */}
            <motion.div 
              className="col-span-2 md:col-span-2 lg:col-span-4 row-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-full min-h-[300px] rounded-[2rem] overflow-hidden group">
                <img src={serumCollection} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-2">
                    {lang === 'fr' ? 'Cosmétique' : 'Cosmetic'}
                  </span>
                  <p className="text-white font-serif text-xl">2000+ {lang === 'fr' ? 'références' : 'references'}</p>
                </div>
              </div>
            </motion.div>

            {/* Small image 1 */}
            <motion.div 
              className="col-span-1 md:col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative h-full min-h-[140px] rounded-[1.5rem] overflow-hidden group">
                <img src={essentialOil} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-sm font-medium">{lang === 'fr' ? 'Parfumerie' : 'Perfumery'}</p>
                </div>
              </div>
            </motion.div>

            {/* Small image 2 */}
            <motion.div 
              className="col-span-1 md:col-span-1 lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <div className="relative h-full min-h-[140px] rounded-[1.5rem] overflow-hidden group">
                <img src={blueberriesHerbs} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-sm font-medium">{lang === 'fr' ? 'Arômes' : 'Flavors'}</p>
                </div>
              </div>
            </motion.div>

            {/* Feature card */}
            <motion.div 
              className="col-span-2 md:col-span-2 lg:col-span-4 row-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-full bg-secondary/50 rounded-[2rem] p-8 border border-border/50">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Leaf className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  {lang === 'fr' ? '100% Naturel' : '100% Natural'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {lang === 'fr' 
                    ? 'Tous nos ingrédients sont sélectionnés pour leur pureté et leur traçabilité. Certifications Bio, Cosmos, Ecocert.'
                    : 'All our ingredients are selected for their purity and traceability. Organic, Cosmos, Ecocert certifications.'}
                </p>
                <div className="space-y-3">
                  {[
                    lang === 'fr' ? 'Sourcing éthique' : 'Ethical sourcing',
                    lang === 'fr' ? 'Traçabilité complète' : 'Complete traceability',
                    lang === 'fr' ? 'Qualité premium' : 'Premium quality'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Medium image */}
            <motion.div 
              className="col-span-2 md:col-span-2 lg:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div className="relative h-full min-h-[180px] rounded-[1.5rem] overflow-hidden group">
                <img src={botanicalsFlat} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs uppercase tracking-widest mb-1">{lang === 'fr' ? 'Expertise' : 'Expertise'}</p>
                    <p className="text-white font-serif text-lg">{lang === 'fr' ? 'Accompagnement R&D' : 'R&D Support'}</p>
                  </div>
                  <Link to={`/${lang}/entreprise`}>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section className="py-12 bg-white border-y border-border/50">
        <div className="container-luxe mb-8">
          <p className="text-center text-sm text-muted-foreground uppercase tracking-widest">
            {lang === 'fr' ? 'Ils nous font confiance' : 'They trust us'}
          </p>
        </div>
        <Marquee>
          {partners.map((partner, i) => (
            <span key={i} className="text-2xl font-serif text-muted-foreground/50 whitespace-nowrap">
              {partner}
            </span>
          ))}
        </Marquee>
      </section>

      {/* CATEGORIES - Large Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4">
              {lang === 'fr' ? 'Notre catalogue' : 'Our catalog'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
              {lang === 'fr' ? 'Trois univers d\'excellence' : 'Three worlds of excellence'}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { 
                name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic', 
                count: '2000+', 
                image: creamJar,
                color: 'from-emerald-600 to-teal-700',
                icon: Leaf,
                link: `/${lang}/catalogue?category=cosmetique`
              },
              { 
                name: lang === 'fr' ? 'Parfumerie' : 'Perfumery', 
                count: '1500+', 
                image: essentialOil,
                color: 'from-amber-600 to-orange-700',
                icon: FlaskConical,
                link: `/${lang}/catalogue?category=parfum`
              },
              { 
                name: lang === 'fr' ? 'Arômes' : 'Flavors', 
                count: '1500+', 
                image: blueberriesHerbs,
                color: 'from-rose-600 to-pink-700',
                icon: Droplets,
                link: `/${lang}/catalogue?category=arome`
              }
            ].map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.1}>
                <Link to={cat.link} className="block group">
                  <div className="relative h-[450px] rounded-[2rem] overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <cat.icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                          {cat.count}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-serif font-semibold text-white mb-4">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/90 group-hover:gap-4 transition-all">
                          <span className="font-medium">{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4">
                {lang === 'fr' ? 'Nos services' : 'Our services'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
                {lang === 'fr' ? 'Un accompagnement complet' : 'Complete support'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {lang === 'fr'
                  ? 'De la sélection des matières premières à la livraison, nous vous accompagnons à chaque étape de votre projet.'
                  : 'From raw material selection to delivery, we support you at every stage of your project.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, i) => (
                  <motion.div 
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-border/50 group hover:shadow-lg hover:border-primary/20 transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="aspect-square rounded-[2.5rem] overflow-hidden">
                  <img src={creamBowl} alt="" className="w-full h-full object-cover" />
                </div>
                {/* Floating badge */}
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-4xl font-serif font-bold">98%</p>
                  <p className="text-sm opacity-90">{lang === 'fr' ? 'Clients satisfaits' : 'Satisfied clients'}</p>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-4">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">
                {lang === 'fr' ? 'Produits populaires' : 'Popular products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="rounded-full border-2 group">
                {lang === 'fr' ? 'Voir tout' : 'View all'}
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

      {/* CTA - Contact */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="container-luxe relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="inline-block text-primary-foreground/80 font-medium text-sm uppercase tracking-widest mb-4">
                {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                {lang === 'fr' ? 'Prêt à créer ensemble ?' : 'Ready to create together?'}
              </h2>
              <p className="text-lg opacity-80 mb-8">
                {lang === 'fr'
                  ? 'Notre équipe d\'experts est à votre disposition pour vous accompagner dans tous vos projets.'
                  : 'Our team of experts is available to support you in all your projects.'}
              </p>
              <Link to={`/${lang}/contact`}>
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-primary hover:bg-white/90 font-medium group">
                  {lang === 'fr' ? 'Demander un devis' : 'Request a quote'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Phone, label: lang === 'fr' ? 'Téléphone' : 'Phone', value: '+33 1 23 45 67 89' },
                  { icon: Mail, label: 'Email', value: 'contact@ies-ingredients.com' },
                  { icon: MapPin, label: lang === 'fr' ? 'Adresse' : 'Address', value: 'Paris, France' },
                  { icon: Globe, label: lang === 'fr' ? 'Livraison' : 'Delivery', value: '40+ ' + (lang === 'fr' ? 'pays' : 'countries') },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <item.icon className="w-6 h-6 mb-3 opacity-80" />
                    <p className="text-sm opacity-60 mb-1">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </Layout>
  );
};
