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
    { value: '5000', suffix: '+', label: lang === 'fr' ? 'Références' : 'References' },
    { value: '30', suffix: '+', label: lang === 'fr' ? 'Années' : 'Years' },
    { value: '500', suffix: '+', label: 'Clients' },
    { value: '40', suffix: '+', label: lang === 'fr' ? 'Pays' : 'Countries' },
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

      {/* HERO - Luxury Minimal */}
      <section className="relative min-h-screen overflow-hidden bg-forest-950">
        {/* Background Image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={essentialOil} 
            alt="" 
            className="w-full h-full object-cover opacity-40" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/40 to-forest-950" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center pt-24 pb-16">
          <div className="container-luxe">
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <p className="text-gold-500 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-6 sm:mb-8 animate-fade-in">
                {lang === 'fr' ? 'Excellence depuis 1994' : 'Excellence since 1994'}
              </p>

              {/* Title */}
              <h1 className="text-white mb-8 animate-reveal">
                {lang === 'fr' ? 'L\'art des' : 'The art of'}<br />
                <span className="italic text-gold-500">{lang === 'fr' ? 'ingrédients naturels' : 'natural ingredients'}</span>
              </h1>

              {/* Description */}
              <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10 sm:mb-12 max-w-2xl animate-reveal-delayed">
                {lang === 'fr'
                  ? 'Plus de 5000 références premium pour la cosmétique, la parfumerie et les arômes alimentaires. Une expertise reconnue par les plus grandes maisons.'
                  : 'Over 5000 premium references for cosmetics, perfumery and food flavors. An expertise recognized by the greatest houses.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-reveal-delayed">
                <Link to={`/${lang}/catalogue`}>
                  <Button className="h-14 px-8 rounded-full text-base font-medium bg-white text-forest-950 hover:bg-white/90 group">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline-light" className="h-14 px-8 rounded-full text-base font-medium">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats - Bottom */}
          <div className="container-luxe mt-auto pt-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 max-w-3xl">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-white mb-2">
                    {stat.value}<span className="text-gold-500">{stat.suffix}</span>
                  </p>
                  <p className="text-sm text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        </div>
      </section>

      {/* CATEGORIES - Elegant Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          {/* Section header */}
          <div className="max-w-2xl mb-16 md:mb-20">
            <p className="text-gold-600 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-4">
              {lang === 'fr' ? 'Notre expertise' : 'Our expertise'}
            </p>
            <h2 className="text-foreground mb-6">
              {lang === 'fr' ? 'Trois univers' : 'Three worlds'}<br />
              <span className="italic text-gold-600">{lang === 'fr' ? 'd\'excellence' : 'of excellence'}</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {lang === 'fr'
                ? 'Des ingrédients soigneusement sélectionnés pour répondre aux exigences les plus élevées de l\'industrie.'
                : 'Carefully selected ingredients to meet the highest standards of the industry.'}
            </p>
          </div>

          {/* Categories grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic', 
                count: '2000+', 
                desc: lang === 'fr' ? 'Actifs botaniques et extraits naturels pour des formulations innovantes.' : 'Botanical actives and natural extracts for innovative formulations.',
                image: creamJar,
                icon: Leaf,
                link: `/${lang}/catalogue?category=cosmetique`
              },
              { 
                name: lang === 'fr' ? 'Parfumerie' : 'Perfumery', 
                count: '1500+', 
                desc: lang === 'fr' ? 'Essences et matières premières nobles pour des créations olfactives uniques.' : 'Noble essences and raw materials for unique olfactory creations.',
                image: essentialOil,
                icon: FlaskConical,
                link: `/${lang}/catalogue?category=parfum`
              },
              { 
                name: lang === 'fr' ? 'Arômes' : 'Flavors', 
                count: '1500+', 
                desc: lang === 'fr' ? 'Arômes alimentaires naturels pour l\'industrie agroalimentaire.' : 'Natural food flavors for the food industry.',
                image: blueberriesHerbs,
                icon: Droplets,
                link: `/${lang}/catalogue?category=arome`
              }
            ].map((cat) => (
              <Link key={cat.name} to={cat.link} className="group block">
                <article className="relative h-[480px] md:h-[560px] rounded-2xl overflow-hidden">
                  {/* Image */}
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <cat.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                        {cat.count}
                      </span>
                    </div>
                    
                    {/* Bottom */}
                    <div>
                      <h3 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-3">
                        {cat.name}
                      </h3>
                      <p className="text-white/70 text-sm md:text-base mb-6 line-clamp-2">{cat.desc}</p>
                      <div className="flex items-center gap-3 text-white text-sm font-medium group-hover:gap-4 transition-all">
                        <span>{lang === 'fr' ? 'Explorer' : 'Explore'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT - Split Layout */}
      <section className="py-24 md:py-32 bg-forest-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px]" />
        
        <div className="container-luxe relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img 
                  src={botanicalsFlat} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 right-6 lg:-right-6">
                <div className="bg-gold-500 text-forest-950 rounded-2xl p-6 shadow-2xl">
                  <p className="text-4xl md:text-5xl font-serif font-semibold">30+</p>
                  <p className="text-sm font-medium mt-1">{lang === 'fr' ? 'ans d\'expertise' : 'years expertise'}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-gold-500 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-4">
                {lang === 'fr' ? 'Notre engagement' : 'Our commitment'}
              </p>
              <h2 className="text-white mb-8">
                {lang === 'fr' ? 'L\'excellence au service de ' : 'Excellence serving '}
                <span className="italic text-gold-500">{lang === 'fr' ? 'la nature' : 'nature'}</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                {lang === 'fr'
                  ? 'Depuis 1994, nous sélectionnons les meilleurs ingrédients naturels pour accompagner les créateurs de cosmétiques, parfums et arômes du monde entier. Notre expertise et notre réseau de partenaires nous permettent de garantir une qualité irréprochable.'
                  : 'Since 1994, we have selected the finest natural ingredients to support cosmetic, perfume and flavor creators worldwide. Our expertise and network of partners allow us to guarantee impeccable quality.'}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Leaf, text: lang === 'fr' ? 'Sourcing éthique' : 'Ethical sourcing' },
                  { icon: Award, text: lang === 'fr' ? 'Certifications' : 'Certifications' },
                  { icon: Zap, text: lang === 'fr' ? 'Livraison rapide' : 'Fast delivery' },
                  { icon: Users, text: lang === 'fr' ? 'Support expert' : 'Expert support' },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <item.icon className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="text-white text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to={`/${lang}/entreprise`}>
                <Button className="h-14 px-8 rounded-full bg-white text-forest-950 hover:bg-white/90 font-medium group">
                  {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover our story'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-24 md:py-32 bg-background">
          <div className="container-luxe">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 md:mb-16">
              <div>
                <p className="text-gold-600 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-4">
                  {lang === 'fr' ? 'Sélection' : 'Selection'}
                </p>
                <h2 className="text-foreground">
                  {lang === 'fr' ? 'Produits' : 'Featured'} <span className="italic text-gold-600">{lang === 'fr' ? 'vedettes' : 'products'}</span>
                </h2>
              </div>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="rounded-full h-12 px-6 group">
                  {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                  <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} lang={lang} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA - Final */}
      <section className="py-24 md:py-32 bg-forest-950 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold-500/10 blur-[150px]" />
        
        <div className="container-luxe relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold-500 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-4">
              {lang === 'fr' ? 'Prêt à collaborer ?' : 'Ready to collaborate?'}
            </p>
            <h2 className="text-white mb-8">
              {lang === 'fr' ? 'Créons ensemble' : 'Let\'s create together'}<br />
              <span className="italic text-gold-500">{lang === 'fr' ? 'votre succès' : 'your success'}</span>
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
              {lang === 'fr'
                ? 'Notre équipe d\'experts est à votre disposition pour vous accompagner dans tous vos projets.'
                : 'Our team of experts is at your disposal to support you in all your projects.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={`/${lang}/contact`}>
                <Button className="h-14 px-8 rounded-full bg-white text-forest-950 hover:bg-white/90 font-medium group">
                  <Phone className="mr-2 w-5 h-5" />
                  {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
                </Button>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline-light" className="h-14 px-8 rounded-full font-medium">
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