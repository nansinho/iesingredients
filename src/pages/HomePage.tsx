import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Search, Leaf, Droplets, FlaskConical } from 'lucide-react';
import leavesHero from '@/assets/leaves-hero.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import productBottle from '@/assets/product-bottle.jpg';
import creamJar from '@/assets/cream-jar.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';

interface HomePageProps {
  lang: Language;
}

export const HomePage = ({ lang }: HomePageProps) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const t = useTranslation(lang);

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

      {/* Hero Section - Matching Reference */}
      <section className="min-h-[90vh] relative overflow-hidden bg-cream-200">
        {/* Leaves from top right */}
        <div className="absolute -top-20 -right-20 w-[60%] h-[120%]">
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover object-left"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-luxe pt-32 pb-16 min-h-[90vh] flex items-center">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-5 animate-fade-up">
              Eco-Friendly
              <br />
              <span className="italic">Cosmetic Brand</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-7 max-w-sm animate-fade-up stagger-1">
              {lang === 'fr'
                ? 'Ingrédients naturels et certifiés pour sublimer vos formulations cosmétiques premium.'
                : 'Natural certified ingredients to elevate your premium cosmetic formulations.'}
            </p>
            <Link to={`/${lang}/catalogue`} className="animate-fade-up stagger-2 inline-block">
              <Button className="bg-primary text-primary-foreground hover:bg-forest-700 h-11 px-6 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                {lang === 'fr' ? 'Découvrir nos produits' : 'Browse Products'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid - Row 1 */}
      <section className="px-4 md:px-6 py-1 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
          {/* Green Quote Card */}
          <div className="col-span-12 md:col-span-5 bg-primary rounded-2xl p-8 md:p-10 relative overflow-hidden min-h-[340px] group cursor-pointer transition-all duration-500 hover:shadow-2xl">
            <span className="font-serif text-[100px] md:text-[120px] leading-none text-white/20 absolute top-0 left-4 transition-all duration-500 group-hover:text-white/30">"</span>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <h2 className="text-2xl md:text-3xl text-white leading-tight mb-3">
                Natural
                <br />
                <span className="italic">Ingredients</span>
              </h2>
              <p className="text-white/70 text-sm mb-5 max-w-[240px] leading-relaxed">
                {lang === 'fr'
                  ? 'Des extraits botaniques soigneusement sélectionnés pour des formulations d\'exception.'
                  : 'Carefully selected botanical extracts for exceptional formulations.'}
              </p>
              <button className="border border-white/40 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-white hover:text-primary transition-all duration-300 self-start">
                {lang === 'fr' ? 'Découvrir' : 'Discover'}
              </button>
            </div>
          </div>

          {/* Image Card with Blueberries */}
          <div className="col-span-12 md:col-span-7 bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[340px] group transition-all duration-500 hover:shadow-xl">
            <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
              <img 
                src={blueberriesHerbs} 
                alt="Natural ingredients"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl text-foreground leading-tight mb-3">
                Natural
                <br />
                <span className="italic">Ingredients</span>
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {lang === 'fr'
                  ? 'Une sélection premium de matières premières naturelles pour vos créations.'
                  : 'A premium selection of natural raw materials for your creations.'}
              </p>
              <button className="border border-foreground/20 text-foreground px-4 py-2 rounded-md text-xs font-medium hover:border-primary hover:text-primary transition-all duration-300 self-start">
                {lang === 'fr' ? 'Voir plus' : 'Learn More'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Row 2: Three Cards */}
      <section className="px-4 md:px-6 py-2 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
          {/* Card with small image */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-2xl p-6 group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={botanicalsFlat} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
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
            <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
              {lang === 'fr'
                ? 'Extraits botaniques et actifs naturels certifiés pour vos formulations cosmétiques professionnelles.'
                : 'Certified botanical extracts and natural actives for professional cosmetic formulations.'}
            </p>
            <button className="border border-foreground/20 text-foreground px-3 py-1.5 rounded-md text-xs hover:border-primary hover:text-primary transition-all duration-300">
              {lang === 'fr' ? 'Découvrir' : 'Discover'}
            </button>
          </div>

          {/* Card with small image */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-2xl p-6 group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={essentialOil} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FlaskConical className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {lang === 'fr' ? 'Parfumerie' : 'Perfumery'}
                  </span>
                </div>
                <h3 className="text-base font-medium text-foreground">
                  {lang === 'fr' ? 'Essences Nobles' : 'Natural Ingredients'}
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
              {lang === 'fr'
                ? 'Matières premières nobles pour la parfumerie fine et les créations olfactives uniques.'
                : 'Noble raw materials for fine perfumery and unique olfactory creations.'}
            </p>
            <button className="border border-foreground/20 text-foreground px-3 py-1.5 rounded-md text-xs hover:border-primary hover:text-primary transition-all duration-300">
              {lang === 'fr' ? 'Explorer' : 'Explore'}
            </button>
          </div>

          {/* Product Showcase Card */}
          <div className="col-span-12 md:col-span-4 bg-cream-300 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-6 -bottom-6 w-32 h-44 transition-transform duration-500 group-hover:scale-105">
              <img src={pumpBottle} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {lang === 'fr' ? 'Collection' : 'Collection'}
                </span>
              </div>
              <h3 className="text-base font-medium text-foreground mb-2">
                {lang === 'fr' ? 'Sérums & Huiles' : 'Serums & Oils'}
              </h3>
              <p className="text-muted-foreground text-xs mb-4 leading-relaxed max-w-[160px]">
                {lang === 'fr'
                  ? 'Formulations premium pour soins visage et corps.'
                  : 'Premium formulations for face and body care.'}
              </p>
              <button className="border border-foreground/20 text-foreground px-3 py-1.5 rounded-md text-xs hover:border-primary hover:text-primary transition-all duration-300">
                {lang === 'fr' ? 'Voir plus' : 'View More'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Row 3: Large Image + Green Card */}
      <section className="px-4 md:px-6 py-2 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
          {/* Large Product Image Card */}
          <div className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative min-h-[380px] group cursor-pointer">
            <img 
              src={pumpBottle} 
              alt="Product"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-[10px] uppercase tracking-wider text-white/80 block mb-1">
                {lang === 'fr' ? 'Nouveautés' : 'New'}
              </span>
              <h3 className="text-xl text-white mb-3">
                {lang === 'fr' ? 'Huiles Essentielles' : 'Essential Oils'}
              </h3>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-md text-xs hover:bg-white hover:text-primary transition-all duration-300">
                {lang === 'fr' ? 'Découvrir' : 'Discover'}
              </button>
            </div>
          </div>

          {/* Green Quote Card with Image */}
          <div className="col-span-12 md:col-span-7 bg-primary rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[380px] group transition-all duration-500 hover:shadow-2xl">
            <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
              <img 
                src={creamBowl} 
                alt="Natural cream"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center">
              <span className="font-serif text-[80px] leading-none text-white/15 absolute top-2 left-4">"</span>
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl text-white leading-tight mb-3">
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
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  {lang === 'fr'
                    ? '30 ans d\'expertise au service de vos formulations les plus exigeantes.'
                    : '30 years of expertise serving your most demanding formulations.'}
                </p>
                <button className="border border-white/40 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-white hover:text-primary transition-all duration-300 self-start">
                  {lang === 'fr' ? 'Notre histoire' : 'Our Story'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Row 4: Three Small Cards */}
      <section className="px-4 md:px-6 py-2 bg-cream-200">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
          {/* Card 1 */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-2xl p-6 group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={creamJar} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  {lang === 'fr' ? 'Soins' : 'Care'}
                </span>
                <h3 className="text-base font-medium text-foreground">
                  {lang === 'fr' ? 'Crèmes Naturelles' : 'Natural Creams'}
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
              {lang === 'fr'
                ? 'Bases et actifs pour crèmes visage et corps de haute qualité.'
                : 'Bases and actives for high quality face and body creams.'}
            </p>
            <button className="border border-foreground/20 text-foreground px-3 py-1.5 rounded-md text-xs hover:border-primary hover:text-primary transition-all duration-300">
              {lang === 'fr' ? 'Découvrir' : 'Discover'}
            </button>
          </div>

          {/* Card 2 */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-2xl p-6 group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={serumCollection} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  {lang === 'fr' ? 'Arômes' : 'Flavors'}
                </span>
                <h3 className="text-base font-medium text-foreground">
                  {lang === 'fr' ? 'Arômes Naturels' : 'Natural Flavors'}
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
              {lang === 'fr'
                ? 'Arômes alimentaires naturels et certifiés pour l\'industrie.'
                : 'Natural certified food flavors for the industry.'}
            </p>
            <button className="border border-foreground/20 text-foreground px-3 py-1.5 rounded-md text-xs hover:border-primary hover:text-primary transition-all duration-300">
              {lang === 'fr' ? 'Explorer' : 'Explore'}
            </button>
          </div>

          {/* Card 3 - Product */}
          <div className="col-span-12 md:col-span-4 bg-cream-300 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-4 -bottom-4 w-28 h-36 transition-transform duration-500 group-hover:scale-105">
              <img src={productBottle} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                {lang === 'fr' ? 'Premium' : 'Premium'}
              </span>
              <h3 className="text-base font-medium text-foreground mb-2">
                {lang === 'fr' ? 'Sérums Visage' : 'Face Serums'}
              </h3>
              <p className="text-muted-foreground text-xs mb-4 leading-relaxed max-w-[140px]">
                {lang === 'fr'
                  ? 'Actifs concentrés pour soins anti-âge.'
                  : 'Concentrated actives for anti-aging care.'}
              </p>
              <button className="border border-foreground/20 text-foreground px-3 py-1.5 rounded-md text-xs hover:border-primary hover:text-primary transition-all duration-300">
                {lang === 'fr' ? 'Voir plus' : 'View More'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 md:px-6 py-2 pb-8 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl text-foreground mb-2">
                  {lang === 'fr' ? 'Rechercher un ingrédient' : 'Search for an ingredient'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {lang === 'fr' ? 'Plus de 5000 références à découvrir' : 'Over 5000 references to discover'}
                </p>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t.hero.search}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pl-10 h-11 bg-cream-200 border-0 rounded-lg"
                    />
                  </div>
                  <Button type="submit" className="h-11 px-5 bg-primary text-white rounded-lg hover:bg-forest-700">
                    {lang === 'fr' ? 'Rechercher' : 'Search'}
                  </Button>
                </form>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl text-primary font-medium">5000+</div>
                  <div className="text-xs text-muted-foreground mt-1">{lang === 'fr' ? 'Produits' : 'Products'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl text-primary font-medium">30+</div>
                  <div className="text-xs text-muted-foreground mt-1">{lang === 'fr' ? 'Ans' : 'Years'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl text-primary font-medium">50+</div>
                  <div className="text-xs text-muted-foreground mt-1">{lang === 'fr' ? 'Pays' : 'Countries'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-2xl md:text-3xl text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="gap-2 rounded-lg border-foreground/20 hover:border-primary hover:text-primary text-sm">
                {lang === 'fr' ? 'Voir tout' : 'View all'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} lang={lang} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <span className="font-serif text-[150px] md:text-[200px] leading-none text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">"</span>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white mb-5">
                {lang === 'fr'
                  ? 'Prêt à découvrir nos ingrédients ?'
                  : 'Ready to discover our ingredients?'}
              </h2>
              <p className="text-white/70 text-base mb-7 max-w-xl mx-auto">
                {lang === 'fr'
                  ? 'Explorez notre catalogue et trouvez les ingrédients parfaits pour vos formulations.'
                  : 'Explore our catalog and find the perfect ingredients for your formulations.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={`/${lang}/catalogue`}>
                  <Button className="bg-white text-primary hover:bg-white/90 h-11 px-7 rounded-lg text-sm font-medium">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline" className="border-white/40 text-white hover:bg-white hover:text-primary h-11 px-7 rounded-lg text-sm">
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
