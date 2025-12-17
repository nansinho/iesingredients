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
import heroBg from '@/assets/hero-botanical.jpg';

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

      {/* Hero Section - Bento Style */}
      <section className="min-h-screen pt-24 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Hero Card - Large */}
            <div className="bento-card bento-cream p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[500px] lg:min-h-[600px] relative overflow-hidden">
              {/* Background botanical image */}
              <div className="absolute top-0 right-0 w-2/3 h-full">
                <img 
                  src={heroBg} 
                  alt="" 
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cream-300 via-cream-300/80 to-transparent" />
              </div>
              
              <div className="relative z-10">
                <span className="inline-block text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-6">
                  {lang === 'fr' ? 'Ingrédients naturels' : 'Natural Ingredients'}
                </span>
              </div>
              
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-[1.1] mb-6 animate-fade-up">
                  {lang === 'fr' ? (
                    <>
                      Cosmétique
                      <br />
                      <span className="italic">Éco-Responsable</span>
                    </>
                  ) : (
                    <>
                      Eco-Friendly
                      <br />
                      <span className="italic">Cosmetic Brand</span>
                    </>
                  )}
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-md mb-8 animate-fade-up stagger-1">
                  {lang === 'fr'
                    ? 'Plus de 5000 ingrédients naturels pour sublimer vos formulations cosmétiques.'
                    : 'Over 5000 natural ingredients to enhance your cosmetic formulations.'}
                </p>
                <Link to={`/${lang}/catalogue`}>
                  <Button className="btn-primary gap-2 animate-fade-up stagger-2">
                    {lang === 'fr' ? 'Découvrir nos produits' : 'Browse Products'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Stacked */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Green Card with Quote */}
              <div className="bento-card forest-gradient p-8 md:p-10 flex-1 min-h-[280px] relative overflow-hidden">
                <span className="quote-mark absolute top-4 left-6 text-white">"</span>
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <h2 className="text-2xl md:text-3xl text-white leading-tight mb-4">
                    {lang === 'fr' ? (
                      <>
                        Ingrédients
                        <br />
                        <span className="italic">Naturels</span>
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
                    <button className="btn-outline-light text-white text-xs">
                      {lang === 'fr' ? 'Explorer' : 'Explore'}
                    </button>
                  </Link>
                </div>
              </div>

              {/* Image Card */}
              <div className="bento-card bg-white p-6 flex-1 min-h-[280px]">
                <div className="flex h-full gap-6">
                  <div className="w-1/2 rounded-2xl overflow-hidden bg-cream-300">
                    <img 
                      src={heroBg} 
                      alt="Natural ingredients"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-1/2 flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl text-foreground mb-3">
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
                    </h3>
                    <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                      {lang === 'fr'
                        ? 'Une sélection premium pour vos créations.'
                        : 'A premium selection for your creations.'}
                    </p>
                    <Link to={`/${lang}/catalogue`}>
                      <button className="btn-outline-dark text-xs">
                        {lang === 'fr' ? 'Voir plus' : 'Learn More'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Card 1 - Natural Surfaces */}
            <div className="bento-card bg-white p-6 md:p-8">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-300 flex-shrink-0">
                  <img 
                    src={heroBg} 
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {lang === 'fr' ? 'Cosmétique' : 'Cosmetic'}
                    </span>
                  </div>
                  <h3 className="text-lg text-foreground">
                    {lang === 'fr' ? 'Actifs Naturels' : 'Natural Actives'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {lang === 'fr'
                  ? 'Extraits botaniques et actifs naturels certifiés pour vos formulations cosmétiques.'
                  : 'Certified botanical extracts and natural actives for your cosmetic formulations.'}
              </p>
              <button className="btn-outline-dark text-xs">
                {lang === 'fr' ? 'Découvrir' : 'Discover'}
              </button>
            </div>

            {/* Card 2 - Natural Ingredients */}
            <div className="bento-card bg-white p-6 md:p-8">
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-300 flex-shrink-0">
                  <img 
                    src={heroBg} 
                    alt=""
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-4 h-4 text-primary" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {lang === 'fr' ? 'Parfumerie' : 'Perfumery'}
                    </span>
                  </div>
                  <h3 className="text-lg text-foreground">
                    {lang === 'fr' ? 'Essences Nobles' : 'Fine Essences'}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {lang === 'fr'
                  ? 'Matières premières nobles pour la parfumerie fine et les créations olfactives.'
                  : 'Noble raw materials for fine perfumery and olfactory creations.'}
              </p>
              <button className="btn-outline-dark text-xs">
                {lang === 'fr' ? 'Explorer' : 'Explore'}
              </button>
            </div>

            {/* Card 3 - Product Showcase */}
            <div className="bento-card bento-cream p-6 md:p-8 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-40">
                <div className="w-full h-full bg-gradient-to-t from-primary/10 to-transparent rounded-tl-3xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="w-4 h-4 text-primary" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {lang === 'fr' ? 'Arômes' : 'Flavors'}
                  </span>
                </div>
                <h3 className="text-lg text-foreground mb-2">
                  {lang === 'fr' ? 'Arômes Alimentaires' : 'Food Flavors'}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {lang === 'fr'
                    ? 'Arômes naturels et certifiés pour l\'industrie agroalimentaire.'
                    : 'Natural certified flavors for the food industry.'}
                </p>
                <button className="btn-outline-dark text-xs">
                  {lang === 'fr' ? 'Voir plus' : 'View More'}
                </button>
              </div>
            </div>
          </div>

          {/* Third Row - Featured Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Large Green Card */}
            <div className="bento-card forest-gradient p-8 md:p-10 lg:col-span-1 min-h-[350px] relative overflow-hidden">
              <span className="quote-mark absolute top-4 left-6 text-white">"</span>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
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
                      ? '30 ans d\'expertise au service de vos formulations les plus exigeantes.'
                      : '30 years of expertise serving your most demanding formulations.'}
                  </p>
                </div>
                <Link to={`/${lang}/entreprise`}>
                  <button className="btn-outline-light text-white text-xs">
                    {lang === 'fr' ? 'Notre histoire' : 'Our Story'}
                  </button>
                </Link>
              </div>
            </div>

            {/* Search & Stats Card */}
            <div className="bento-card bg-white p-8 md:p-10 lg:col-span-2">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl text-foreground mb-4">
                    {lang === 'fr' ? 'Rechercher un ingrédient' : 'Search for an ingredient'}
                  </h3>
                  <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={t.hero.search}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-12 h-12 bg-cream-300 border-0 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="h-12 px-6 btn-primary rounded-xl"
                    >
                      {lang === 'fr' ? 'Rechercher' : 'Search'}
                    </Button>
                  </form>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                  <div>
                    <div className="text-3xl md:text-4xl text-primary font-medium">5000+</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lang === 'fr' ? 'Références' : 'References'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl text-primary font-medium">30+</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lang === 'fr' ? "Ans d'expertise" : 'Years expertise'}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl text-primary font-medium">50+</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lang === 'fr' ? 'Pays' : 'Countries'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2 block">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="text-3xl md:text-4xl text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="gap-2 rounded-xl">
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
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bento-card forest-gradient p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src={heroBg} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                {lang === 'fr'
                  ? 'Prêt à découvrir nos ingrédients ?'
                  : 'Ready to discover our ingredients?'}
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                {lang === 'fr'
                  ? 'Explorez notre catalogue complet et trouvez les ingrédients parfaits pour vos formulations.'
                  : 'Explore our complete catalog and find the perfect ingredients for your formulations.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={`/${lang}/catalogue`}>
                  <Button className="bg-white text-primary hover:bg-white/90 gap-2 h-12 px-8 rounded-xl">
                    {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to={`/${lang}/contact`}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8 rounded-xl">
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
