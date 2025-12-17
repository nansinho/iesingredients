import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Search, Beaker, Sparkles, Leaf, ChevronRight, Star } from 'lucide-react';
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

  const featuredProducts = mockProducts.slice(0, 8);

  const categories = [
    {
      key: 'cosmetic' as const,
      icon: Beaker,
      count: '2500+',
      description: lang === 'fr' ? 'Actifs et extraits botaniques de haute qualité pour vos formulations cosmétiques' : 'High-quality actives and botanical extracts for your cosmetic formulations',
    },
    {
      key: 'perfume' as const,
      icon: Sparkles,
      count: '1500+',
      description: lang === 'fr' ? 'Matières premières nobles pour la parfumerie fine et les créations olfactives' : 'Fine raw materials for perfumery and olfactory creations',
    },
    {
      key: 'aroma' as const,
      icon: Leaf,
      count: '1000+',
      description: lang === 'fr' ? 'Arômes alimentaires naturels et certifiés pour l\'industrie agroalimentaire' : 'Natural certified food flavors for the food industry',
    },
  ];

  const stats = [
    { value: '5000+', label: lang === 'fr' ? 'Références produits' : 'Product references' },
    { value: '30+', label: lang === 'fr' ? "Années d'expertise" : 'Years of expertise' },
    { value: '50+', label: lang === 'fr' ? 'Pays desservis' : 'Countries served' },
  ];

  const trustedBy = [
    'L\'Oréal', 'Givaudan', 'Firmenich', 'Symrise', 'IFF'
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Cosmétiques, Parfums & Arômes' : 'Cosmetic Ingredients, Perfumes & Flavors'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires.' : 'Over 5000 cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      {/* Hero Section - Premium */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-950/95 via-forest-900/90 to-forest-800/80" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl floating-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-forest-400/10 rounded-full blur-3xl floating-delayed" />
        </div>

        {/* Content */}
        <div className="container-luxe relative z-10 pt-32 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-dark mb-10 animate-fade-up">
                <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-sm text-white/90 font-medium tracking-wide">
                  {lang === 'fr' ? 'Excellence depuis 1990' : 'Excellence since 1990'}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8 animate-fade-up stagger-1">
                {lang === 'fr' ? (
                  <>
                    L'art des
                    <br />
                    <span className="text-gradient-gold">ingrédients</span>
                    <br />
                    naturels
                  </>
                ) : (
                  <>
                    The art of
                    <br />
                    <span className="text-gradient-gold">natural</span>
                    <br />
                    ingredients
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/65 mb-12 max-w-lg leading-relaxed animate-fade-up stagger-2">
                {lang === 'fr'
                  ? 'Fournisseur premium d\'ingrédients cosmétiques, parfums et arômes alimentaires pour les maisons les plus exigeantes.'
                  : 'Premium supplier of cosmetic ingredients, perfumes and food flavors for the most demanding houses.'}
              </p>

              {/* Search Bar - Premium */}
              <form onSubmit={handleSearch} className="mb-10 animate-fade-up stagger-3">
                <div className="flex gap-3">
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t.hero.search}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="pl-14 h-14 bg-white/95 border-0 shadow-xl text-foreground placeholder:text-muted-foreground rounded-2xl text-base"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-8 forest-gradient text-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl btn-luxe"
                  >
                    {lang === 'fr' ? 'Rechercher' : 'Search'}
                  </Button>
                </div>
              </form>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-4">
                <Link to={`/${lang}/catalogue`}>
                  <Button 
                    size="lg" 
                    className="h-14 px-8 bg-white text-forest-900 hover:bg-white/90 gap-3 shadow-xl btn-luxe rounded-2xl group text-base font-medium"
                  >
                    {t.hero.cta}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to={`/${lang}/entreprise`}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-14 px-8 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-2xl text-base font-medium"
                  >
                    {lang === 'fr' ? 'Découvrir IES' : 'Discover IES'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Panel - Right Side */}
            <div className="hidden lg:block animate-fade-up stagger-5">
              <div className="glass-dark rounded-3xl p-10 space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-5 h-5 text-gold-400" />
                  <span className="text-white/80 font-medium">
                    {lang === 'fr' ? 'Nos chiffres clés' : 'Key figures'}
                  </span>
                </div>
                {stats.map((stat, index) => (
                  <div key={stat.label} className="group">
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-5xl text-white font-medium">{stat.value}</span>
                      <span className="text-white/50 text-sm">{stat.label}</span>
                    </div>
                    {index < stats.length - 1 && <div className="h-px bg-white/10 mt-6" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden mt-16 animate-fade-up stagger-5">
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-3xl text-white font-medium">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-7 h-12 rounded-full border-2 border-white/25 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-secondary/50 border-y border-border/50">
        <div className="container-luxe">
          <div className="flex flex-wrap items-center justify-center gap-12 text-muted-foreground/50">
            <span className="text-sm font-medium uppercase tracking-widest">
              {lang === 'fr' ? 'Ils nous font confiance' : 'Trusted by'}
            </span>
            {trustedBy.map((brand) => (
              <span key={brand} className="text-lg font-serif tracking-wide">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        
        <div className="container-luxe relative">
          <div className="text-center mb-20">
            <span className="inline-block text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-4">
              {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
              {lang === 'fr' ? 'Trois univers d\'exception' : 'Three worlds of excellence'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <Link
                key={cat.key}
                to={`/${lang}/catalogue?category=${cat.key}`}
                className="group card-luxe p-10 animate-fade-up relative overflow-hidden"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl forest-gradient-soft flex items-center justify-center mb-8 
                                group-hover:scale-110 group-hover:shadow-glow transition-all duration-500">
                    <cat.icon className="h-8 w-8 text-white" />
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors duration-300">
                      {t.categories[cat.key]}
                    </h3>
                    <span className="text-sm font-semibold text-accent">{cat.count}</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {cat.description}
                  </p>

                  <div className="flex items-center text-primary font-medium gap-2 group-hover:gap-4 transition-all duration-300">
                    {lang === 'fr' ? 'Explorer la collection' : 'Explore collection'}
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-secondary/30">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="inline-block text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-4">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" size="lg" className="gap-3 group rounded-xl h-12">
                {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
      <section className="section-padding forest-gradient relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container-luxe relative text-center">
          <span className="inline-block text-sm uppercase tracking-[0.25em] text-gold-400 font-semibold mb-6">
            {lang === 'fr' ? 'Commencez maintenant' : 'Get started'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 max-w-3xl mx-auto leading-tight">
            {lang === 'fr'
              ? 'Prêt à découvrir nos ingrédients d\'exception ?'
              : 'Ready to discover our exceptional ingredients?'}
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            {lang === 'fr'
              ? 'Explorez notre catalogue complet et trouvez les ingrédients parfaits pour sublimer vos formulations.'
              : 'Explore our complete catalog and find the perfect ingredients to enhance your formulations.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link to={`/${lang}/catalogue`}>
              <Button 
                size="lg" 
                className="h-14 px-10 bg-white text-forest-900 hover:bg-white/90 gap-3 shadow-2xl btn-luxe rounded-2xl text-base font-medium"
              >
                {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to={`/${lang}/contact`}>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 border-white/20 text-white hover:bg-white/10 rounded-2xl text-base font-medium"
              >
                {lang === 'fr' ? 'Demander un devis' : 'Request a quote'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
