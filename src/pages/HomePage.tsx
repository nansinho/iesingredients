import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { SEOHead, createFAQSchema } from '@/components/SEOHead';
import { ArrowRight, Leaf, Droplets, FlaskConical, Sparkles, Award, Users, Globe, ArrowUpRight, Phone, Zap } from 'lucide-react';
import essentialOil from '@/assets/essential-oil.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';

interface HomePageProps {
  lang: Language;
}

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const { data: products } = useProducts();

  const featuredProducts = (products || []).slice(0, 3);

  const stats = [
    { value: '5000', suffix: '+', label: lang === 'fr' ? 'Références' : 'References', icon: Sparkles },
    { value: '30', suffix: '+', label: lang === 'fr' ? 'Années' : 'Years', icon: Award },
    { value: '500', suffix: '+', label: 'Clients', icon: Users },
    { value: '40', suffix: '+', label: lang === 'fr' ? 'Pays' : 'Countries', icon: Globe },
  ];

  return (
    <Layout lang={lang}>
      {/* FAQ Schema for AEO */}
      <SEOHead
        lang={lang}
        title={`IES Ingredients - ${lang === 'fr' ? 'Ingrédients Naturels Premium' : 'Premium Natural Ingredients'}`}
        description={lang === 'fr' 
          ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires naturels. Actifs botaniques et huiles végétales certifiés.'
          : 'Over 5000 natural cosmetic ingredients, perfumes and food flavors. Certified botanical actives and vegetable oils.'}
        structuredData={createFAQSchema([
          {
            question: lang === 'fr' ? 'Quels types d\'ingrédients proposez-vous ?' : 'What types of ingredients do you offer?',
            answer: lang === 'fr' 
              ? 'Nous proposons plus de 5000 références d\'ingrédients naturels : actifs cosmétiques, huiles essentielles pour la parfumerie, et arômes alimentaires.'
              : 'We offer over 5000 natural ingredient references: cosmetic actives, essential oils for perfumery, and food flavors.',
          },
          {
            question: lang === 'fr' ? 'Vos ingrédients sont-ils certifiés ?' : 'Are your ingredients certified?',
            answer: lang === 'fr'
              ? 'Oui, nous proposons des ingrédients certifiés biologiques, COSMOS, Ecocert et autres certifications reconnues.'
              : 'Yes, we offer organic, COSMOS, Ecocert and other recognized certified ingredients.',
          },
        ])}
      />

      {/* HERO */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden bg-forest-950">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={essentialOil} alt="" className="w-full h-full object-cover opacity-30" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950" />
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gold-500/10 blur-[100px] sm:blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-20">
          <div className="container-luxe px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold-500/20 border border-gold-500/30 mb-6 sm:mb-8">
                <div className="w-2 h-2 rounded-full bg-gold-400" />
                <span className="text-gold-300 text-xs sm:text-sm font-medium">
                  {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[0.95] mb-4 sm:mb-6">
                {lang === 'fr' ? 'Ingrédients' : 'Natural'}{' '}
                <span className="text-gold italic">{lang === 'fr' ? 'Naturels' : 'Ingredients'}</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-lg md:text-xl text-white/70 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                {lang === 'fr'
                  ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires.'
                  : 'Over 5000 premium references for cosmetics, perfumery and food flavors.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
                <Link to={`/${lang}/catalogue`}>
                  <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-base font-semibold bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25 group">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline-light" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-base font-semibold">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-1">
                      {stat.value}<span className="text-gold">{stat.suffix}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-forest-950">
          <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,64 960,64 1440,0 L1440,64 L0,64 Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
        
        <div className="pt-32 pb-12 sm:pb-16 bg-background">
          <div className="container-luxe px-4">
            <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 flex-wrap opacity-40">
              {['L\'Oréal', 'Givaudan', 'Firmenich', 'Symrise', 'IFF', 'Mane'].map((partner, i) => (
                <span key={i} className="text-lg sm:text-xl md:text-2xl font-serif text-foreground">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 sm:py-24 md:py-32 bg-background overflow-hidden">
        <div className="container-luxe px-4">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-gold-600 font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4">
              {lang === 'fr' ? 'Notre catalogue' : 'Our catalog'}
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-4">
              {lang === 'fr' ? 'Trois univers' : 'Three worlds'}<br />
              <span className="text-gold">{lang === 'fr' ? 'd\'excellence' : 'of excellence'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
              <Link key={cat.name} to={cat.link} className="block group">
                <div className="relative h-[350px] sm:h-[450px] md:h-[500px] rounded-2xl sm:rounded-[2rem] overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-bold">
                        {cat.count}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2 sm:mb-3">
                        {cat.name}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6">{cat.desc}</p>
                      <div className="flex items-center gap-3 text-white font-semibold text-sm sm:text-base">
                        <span>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-forest-900" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 sm:py-24 md:py-32 bg-forest-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-gold-500/5 blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-forest-600/20 blur-[60px] sm:blur-[80px]" />
        
        <div className="container-luxe relative px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-2xl sm:rounded-[3rem] overflow-hidden">
                <img src={botanicalsFlat} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 right-4 sm:-bottom-6 sm:right-6 md:right-6">
                <div className="bg-gold-500 text-forest-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl shadow-gold-500/30">
                  <p className="text-3xl sm:text-5xl font-serif font-bold">30+</p>
                  <p className="text-xs sm:text-sm font-semibold">{lang === 'fr' ? 'ans d\'expertise' : 'years expertise'}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="inline-block text-gold-400 font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4">
                {lang === 'fr' ? 'Notre engagement' : 'Our commitment'}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 sm:mb-8 leading-tight">
                {lang === 'fr' ? 'L\'excellence au service de ' : 'Excellence serving '}
                <span className="text-gold italic">{lang === 'fr' ? 'la nature' : 'nature'}</span>
              </h2>
              <p className="text-sm sm:text-lg text-white/60 leading-relaxed mb-8 sm:mb-10">
                {lang === 'fr'
                  ? 'Depuis 1994, nous sélectionnons les meilleurs ingrédients naturels pour accompagner les créateurs de cosmétiques, parfums et arômes du monde entier.'
                  : 'Since 1994, we have selected the finest natural ingredients to support cosmetic, perfume and flavor creators worldwide.'}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {[
                  { icon: Leaf, text: lang === 'fr' ? 'Sourcing éthique' : 'Ethical sourcing' },
                  { icon: Award, text: lang === 'fr' ? 'Certifications' : 'Certifications' },
                  { icon: Zap, text: lang === 'fr' ? 'Livraison rapide' : 'Fast delivery' },
                  { icon: Users, text: lang === 'fr' ? 'Support expert' : 'Expert support' },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10"
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to={`/${lang}/entreprise`}>
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-gold-500 text-forest-950 hover:bg-gold-400 font-semibold text-sm sm:text-base group">
                  {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover our story'}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-24 md:py-32 bg-background overflow-hidden">
          <div className="container-luxe px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-10 sm:mb-16">
              <div>
                <span className="inline-block text-gold-600 font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4">
                  {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-foreground">
                  {lang === 'fr' ? 'Découvertes' : 'Discoveries'} <span className="text-gold italic">{lang === 'fr' ? 'du moment' : 'of the moment'}</span>
                </h2>
              </div>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" size="lg" className="rounded-full group text-sm sm:text-base">
                  {lang === 'fr' ? 'Voir tout' : 'View all'}
                  <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} lang={lang} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 sm:py-24 md:py-32 bg-forest-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full bg-gold-500/10 blur-[100px] sm:blur-[150px]" />
        </div>
        
        <div className="container-luxe relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gold-400 font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] mb-3 sm:mb-4">
              {lang === 'fr' ? 'Prêt à collaborer ?' : 'Ready to collaborate?'}
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 sm:mb-8">
              {lang === 'fr' ? 'Créons ensemble' : 'Let\'s create together'}<br />
              <span className="text-gold italic">{lang === 'fr' ? 'votre succès' : 'your success'}</span>
            </h2>
            <p className="text-sm sm:text-lg text-white/60 mb-8 sm:mb-12 max-w-xl mx-auto px-4">
              {lang === 'fr'
                ? 'Notre équipe d\'experts est à votre disposition pour vous accompagner dans tous vos projets.'
                : 'Our team of experts is at your disposal to support you in all your projects.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <Link to={`/${lang}/contact`}>
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-gold-500 text-forest-950 hover:bg-gold-400 font-semibold text-sm sm:text-base group">
                  <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
                </Button>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline-light" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full font-semibold text-sm sm:text-base">
                  {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};