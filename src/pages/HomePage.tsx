import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { SEOHead, createFAQSchema } from '@/components/SEOHead';
import { HeroSection } from '@/components/home/HeroSection';
import { ArrowRight, Leaf, Droplets, FlaskConical, Award, Users, Zap, ArrowUpRight, Phone } from 'lucide-react';
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';

interface HomePageProps {
  lang: Language;
}

export const HomePage = ({ lang }: HomePageProps) => {
  const t = useTranslation(lang);
  const { data: products } = useProducts();
  const [searchValue, setSearchValue] = useState('');

  const featuredProducts = (products || []).slice(0, 3);

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

      {/* HERO - Animated Ken Burns Slideshow */}
      <HeroSection 
        lang={lang} 
        searchValue={searchValue} 
        onSearchChange={setSearchValue} 
      />

      {/* CATEGORIES - Elegant Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe">
          {/* Section header */}
          <div className="max-w-2xl mb-16 md:mb-20">
            <p className="text-gold-600 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-4">
              {lang === 'fr' ? 'NOTRE EXPERTISE' : 'OUR EXPERTISE'}
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
                name: lang === 'fr' ? 'COSMÉTIQUE' : 'COSMETIC', 
                count: '2000+', 
                desc: lang === 'fr' ? 'Actifs botaniques et extraits naturels pour des formulations innovantes.' : 'Botanical actives and natural extracts for innovative formulations.',
                image: creamJar,
                icon: Leaf,
                link: `/${lang}/catalogue?category=cosmetique`,
                color: '#D4A5A5',      // Rose poudré
                iconBg: '#D4A5A5'
              },
              { 
                name: lang === 'fr' ? 'PARFUMERIE' : 'PERFUMERY', 
                count: '1500+', 
                desc: lang === 'fr' ? 'Essences et matières premières nobles pour des créations olfactives uniques.' : 'Noble essences and raw materials for unique olfactory creations.',
                image: essentialOil,
                icon: FlaskConical,
                link: `/${lang}/catalogue?category=parfum`,
                color: '#8B7EC8',      // Violet iris
                iconBg: '#8B7EC8'
              },
              { 
                name: lang === 'fr' ? 'ARÔMES' : 'FLAVORS', 
                count: '1500+', 
                desc: lang === 'fr' ? 'Arômes alimentaires naturels pour l\'industrie agroalimentaire.' : 'Natural food flavors for the food industry.',
                image: blueberriesHerbs,
                icon: Droplets,
                link: `/${lang}/catalogue?category=arome`,
                color: '#D4915C',      // Ambre chaud
                iconBg: '#D4915C'
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
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: cat.iconBg }}
                      >
                        <cat.icon className="w-7 h-7 text-white" />
                      </div>
                      <span 
                        className="px-4 py-2 rounded-full backdrop-blur-sm text-white text-sm font-semibold uppercase tracking-wider border"
                        style={{ 
                          backgroundColor: `${cat.color}30`,
                          borderColor: `${cat.color}50`
                        }}
                      >
                        {cat.count}
                      </span>
                    </div>
                    
                    {/* Bottom */}
                    <div>
                      {/* Colored line accent */}
                      <div 
                        className="w-12 h-1 rounded-full mb-4"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h3 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-3 uppercase tracking-wide">
                        {cat.name}
                      </h3>
                      <p className="text-white/70 text-sm md:text-base mb-6 line-clamp-2">{cat.desc}</p>
                      <div 
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-white text-sm font-medium uppercase tracking-wider group-hover:gap-4 transition-all"
                        style={{ backgroundColor: cat.color }}
                      >
                        <span>{lang === 'fr' ? 'EXPLORER' : 'EXPLORE'}</span>
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
                  <p className="text-sm font-medium uppercase tracking-wider mt-1">{lang === 'fr' ? 'ANS D\'EXPERTISE' : 'YEARS EXPERTISE'}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-gold-500 text-xs sm:text-sm uppercase tracking-luxury font-medium mb-4">
                {lang === 'fr' ? 'NOTRE ENGAGEMENT' : 'OUR COMMITMENT'}
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
                  { icon: Leaf, text: lang === 'fr' ? 'SOURCING ÉTHIQUE' : 'ETHICAL SOURCING' },
                  { icon: Award, text: lang === 'fr' ? 'CERTIFICATIONS' : 'CERTIFICATIONS' },
                  { icon: Zap, text: lang === 'fr' ? 'LIVRAISON RAPIDE' : 'FAST DELIVERY' },
                  { icon: Users, text: lang === 'fr' ? 'SUPPORT EXPERT' : 'EXPERT SUPPORT' },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <item.icon className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="text-white text-xs font-medium uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to={`/${lang}/entreprise`}>
                <Button className="h-14 px-8 rounded-full bg-white text-forest-950 hover:bg-white/90 font-medium uppercase tracking-wider group">
                  {lang === 'fr' ? 'DÉCOUVRIR NOTRE HISTOIRE' : 'DISCOVER OUR STORY'}
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
                  {lang === 'fr' ? 'SÉLECTION' : 'SELECTION'}
                </p>
                <h2 className="text-foreground">
                  {lang === 'fr' ? 'Produits' : 'Featured'} <span className="italic text-gold-600">{lang === 'fr' ? 'vedettes' : 'products'}</span>
                </h2>
              </div>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="rounded-full h-12 px-6 uppercase tracking-wider text-xs group">
                  {lang === 'fr' ? 'VOIR TOUT LE CATALOGUE' : 'VIEW FULL CATALOG'}
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
              {lang === 'fr' ? 'PRÊT À COLLABORER ?' : 'READY TO COLLABORATE?'}
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
                <Button className="h-14 px-8 rounded-full bg-white text-forest-950 hover:bg-white/90 font-medium uppercase tracking-wider group">
                  <Phone className="mr-2 w-5 h-5" />
                  {lang === 'fr' ? 'CONTACTEZ-NOUS' : 'CONTACT US'}
                </Button>
              </Link>
              <Link to={`/${lang}/catalogue`}>
                <Button variant="outline" className="h-14 px-8 rounded-full font-medium uppercase tracking-wider border-white/30 text-white hover:bg-white/10">
                  {lang === 'fr' ? 'VOIR LE CATALOGUE' : 'VIEW CATALOG'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
