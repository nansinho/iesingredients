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

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden bg-cream-200">
        {/* Leaves on right side */}
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <img 
            src={leavesHero} 
            alt="" 
            className="w-full h-full object-cover object-left"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-luxe pt-32 pb-20 min-h-screen flex items-center">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-6">
              {lang === 'fr' ? (
                <>
                  Eco-Friendly
                  <br />
                  <span className="italic">Cosmetic Brand</span>
                </>
              ) : (
                <>
                  Eco-Friendly
                  <br />
                  <span className="italic">Cosmetic Brand</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              {lang === 'fr'
                ? 'Plus de 5000 ingrédients naturels pour sublimer vos formulations cosmétiques premium.'
                : 'Over 5000 natural ingredients to elevate your premium cosmetic formulations.'}
            </p>
            <Link to={`/${lang}/catalogue`}>
              <Button className="bg-primary text-primary-foreground hover:bg-forest-700 h-12 px-8 rounded-lg gap-2">
                {lang === 'fr' ? 'Découvrir nos produits' : 'Browse Products'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-4 px-4 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Green Card with Quote - Left */}
            <div className="bg-primary rounded-3xl p-10 md:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
              <span className="font-serif text-[120px] md:text-[150px] leading-none text-white/20 absolute top-2 left-6">"</span>
              <div className="relative z-10 mt-auto">
                <h2 className="text-3xl md:text-4xl text-white leading-tight mb-4">
                  {lang === 'fr' ? (
                    <>
                      Natural
                      <br />
                      <span className="italic">Ingredients</span>
                    </>
                  ) : (
                    <>
                      Natural
                      <br />
                      <span className="italic">Ingredients</span>
                    </>
                  )}
                </h2>
                <p className="text-white/70 text-sm mb-6 max-w-xs">
                  {lang === 'fr'
                    ? 'Des extraits botaniques soigneusement sélectionnés pour des formulations d\'exception.'
                    : 'Carefully selected botanical extracts for exceptional formulations.'}
                </p>
                <Link to={`/${lang}/catalogue?category=cosmetic`}>
                  <button className="border border-white/40 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                    {lang === 'fr' ? 'Découvrir' : 'Discover'}
                  </button>
                </Link>
              </div>
            </div>

            {/* Image + Text Card - Right */}
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
              <div className="w-full md:w-1/2 h-64 md:h-auto">
                <img 
                  src={botanicalsFlat} 
                  alt="Natural ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl text-foreground leading-tight mb-4">
                  Natural
                  <br />
                  <span className="italic">Ingredients</span>
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {lang === 'fr'
                    ? 'Une sélection premium de matières premières naturelles pour vos créations cosmétiques.'
                    : 'A premium selection of natural raw materials for your cosmetic creations.'}
                </p>
                <Link to={`/${lang}/catalogue`}>
                  <button className="border border-foreground/20 text-foreground px-5 py-2.5 rounded-lg text-sm hover:border-foreground/40 hover:bg-foreground/5 transition-colors">
                    {lang === 'fr' ? 'Voir plus' : 'Learn More'}
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2 - Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 flex flex-col">
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-cream-300 flex-shrink-0">
                  <img src={botanicalsFlat} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {lang === 'fr' ? 'Cosmétique' : 'Cosmetic'}
                  </span>
                  <h3 className="text-lg text-foreground">
                    {lang === 'fr' ? 'Actifs Naturels' : 'Natural Actives'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                {lang === 'fr'
                  ? 'Extraits botaniques et actifs naturels certifiés pour vos formulations.'
                  : 'Certified botanical extracts and natural actives for your formulations.'}
              </p>
              <button className="border border-foreground/20 text-foreground px-5 py-2.5 rounded-lg text-sm hover:border-foreground/40 transition-colors self-start">
                {lang === 'fr' ? 'Découvrir' : 'Discover'}
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 flex flex-col">
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-cream-300 flex-shrink-0">
                  <img src={productBottle} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {lang === 'fr' ? 'Parfumerie' : 'Perfumery'}
                  </span>
                  <h3 className="text-lg text-foreground">
                    {lang === 'fr' ? 'Essences Nobles' : 'Fine Essences'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                {lang === 'fr'
                  ? 'Matières premières nobles pour la parfumerie fine et créations olfactives.'
                  : 'Noble raw materials for fine perfumery and olfactory creations.'}
              </p>
              <button className="border border-foreground/20 text-foreground px-5 py-2.5 rounded-lg text-sm hover:border-foreground/40 transition-colors self-start">
                {lang === 'fr' ? 'Explorer' : 'Explore'}
              </button>
            </div>

            {/* Card 3 - with product image */}
            <div className="bg-cream-300 rounded-3xl p-8 relative overflow-hidden flex flex-col">
              <div className="absolute -right-8 -bottom-8 w-40 h-56 opacity-40">
                <img src={productBottle} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  {lang === 'fr' ? 'Arômes' : 'Flavors'}
                </span>
                <h3 className="text-lg text-foreground mb-3">
                  {lang === 'fr' ? 'Arômes Alimentaires' : 'Food Flavors'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {lang === 'fr'
                    ? 'Arômes naturels certifiés pour l\'industrie agroalimentaire.'
                    : 'Certified natural flavors for the food industry.'}
                </p>
              </div>
              <button className="border border-foreground/20 text-foreground px-5 py-2.5 rounded-lg text-sm hover:border-foreground/40 transition-colors self-start relative z-10">
                {lang === 'fr' ? 'Voir plus' : 'View More'}
              </button>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Large Image Card */}
            <div className="bg-cream-300 rounded-3xl overflow-hidden relative min-h-[350px]">
              <img 
                src={productBottle} 
                alt="Product"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs uppercase tracking-wider text-white/80 block mb-2">
                  {lang === 'fr' ? 'Collection' : 'Collection'}
                </span>
                <h3 className="text-2xl text-white mb-4">
                  {lang === 'fr' ? 'Nos Essentiels' : 'Our Essentials'}
                </h3>
                <button className="border border-white/50 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  {lang === 'fr' ? 'Découvrir' : 'Discover'}
                </button>
              </div>
            </div>

            {/* Green Quote Card */}
            <div className="bg-primary rounded-3xl p-10 relative overflow-hidden min-h-[350px] flex flex-col justify-between">
              <span className="font-serif text-[100px] leading-none text-white/20 absolute top-0 left-6">"</span>
              <div className="relative z-10 mt-auto">
                <h2 className="text-2xl md:text-3xl text-white leading-tight mb-4">
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
                <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                  {lang === 'fr'
                    ? '30 ans d\'expertise au service de vos formulations.'
                    : '30 years of expertise serving your formulations.'}
                </p>
              </div>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[350px]">
              <div>
                <h3 className="text-2xl text-foreground mb-2">
                  {lang === 'fr' ? 'Rechercher' : 'Search'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {lang === 'fr' ? 'Trouvez l\'ingrédient parfait' : 'Find the perfect ingredient'}
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
                  <Button type="submit" className="h-11 px-5 bg-primary text-white rounded-lg">
                    OK
                  </Button>
                </form>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border mt-6">
                <div>
                  <div className="text-2xl md:text-3xl text-primary font-medium">5000+</div>
                  <div className="text-xs text-muted-foreground">{lang === 'fr' ? 'Produits' : 'Products'}</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl text-primary font-medium">30+</div>
                  <div className="text-xs text-muted-foreground">{lang === 'fr' ? 'Ans' : 'Years'}</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl text-primary font-medium">50+</div>
                  <div className="text-xs text-muted-foreground">{lang === 'fr' ? 'Pays' : 'Countries'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.15em] text-primary font-medium mb-2 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-3xl md:text-4xl text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="gap-2 rounded-lg border-foreground/20 hover:border-foreground/40">
                {lang === 'fr' ? 'Voir tout' : 'View all'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} lang={lang} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-cream-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <span className="font-serif text-[200px] leading-none text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">"</span>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                {lang === 'fr'
                  ? 'Prêt à découvrir nos ingrédients ?'
                  : 'Ready to discover our ingredients?'}
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                {lang === 'fr'
                  ? 'Explorez notre catalogue et trouvez les ingrédients parfaits.'
                  : 'Explore our catalog and find the perfect ingredients.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={`/${lang}/catalogue`}>
                  <Button className="bg-white text-primary hover:bg-white/90 h-12 px-8 rounded-lg gap-2">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 h-12 px-8 rounded-lg">
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
