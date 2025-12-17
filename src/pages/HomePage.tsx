import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Search, Beaker, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      count: 2500,
      description: lang === 'fr' ? 'Actifs et extraits botaniques' : 'Actives and botanical extracts',
    },
    {
      key: 'perfume' as const,
      icon: Sparkles,
      count: 1500,
      description: lang === 'fr' ? 'Matières premières parfumerie' : 'Perfumery raw materials',
    },
    {
      key: 'aroma' as const,
      icon: Leaf,
      count: 1000,
      description: lang === 'fr' ? 'Arômes alimentaires naturels' : 'Natural food flavors',
    },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Cosmétiques, Parfums & Arômes' : 'Cosmetic Ingredients, Perfumes & Flavors'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires.' : 'Over 5000 cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        
        <div className="container relative z-10 pt-20">
          <div className="max-w-xl">
            <p className="text-background/80 text-sm font-medium tracking-wider uppercase mb-4 animate-in">
              {lang === 'fr' ? '+5000 références' : '+5000 references'}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background leading-tight mb-6 animate-in stagger-1">
              {lang === 'fr' ? 'Ingrédients naturels pour vos formulations' : 'Natural ingredients for your formulations'}
            </h1>
            <p className="text-background/80 text-lg mb-8 animate-in stagger-2">
              {lang === 'fr' 
                ? 'Cosmétiques, parfums et arômes alimentaires depuis 1990.'
                : 'Cosmetics, perfumes and food flavors since 1990.'}
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 animate-in stagger-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.hero.search}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 h-12 bg-background/95 border-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-12">
                {lang === 'fr' ? 'Rechercher' : 'Search'}
              </Button>
            </form>

            <div className="flex gap-4 animate-in stagger-4">
              <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                <Link to={`/${lang}/catalogue`}>
                  {t.hero.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              {lang === 'fr' ? 'Nos catégories' : 'Our categories'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {lang === 'fr' 
                ? 'Trois univers complémentaires pour répondre à tous vos besoins de formulation.'
                : 'Three complementary universes to meet all your formulation needs.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={cat.key}
                to={`/${lang}/catalogue?category=${cat.key}`}
                className="group bg-card border border-border rounded-lg p-8 hover:border-primary/30 hover:shadow-lg transition-all animate-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <cat.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-serif text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                  {t.categories[cat.key]}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{cat.description}</p>
                <p className="text-sm font-medium text-primary">
                  {cat.count.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} {lang === 'fr' ? 'références' : 'references'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
              <p className="text-muted-foreground">
                {lang === 'fr' ? 'Découvrez notre sélection' : 'Discover our selection'}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to={`/${lang}/catalogue`}>
                {lang === 'fr' ? 'Voir tout' : 'View all'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} lang={lang} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif text-4xl font-medium mb-1">5000+</div>
              <div className="text-primary-foreground/70 text-sm">{lang === 'fr' ? 'Références' : 'References'}</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-medium mb-1">30+</div>
              <div className="text-primary-foreground/70 text-sm">{lang === 'fr' ? 'Années' : 'Years'}</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-medium mb-1">50+</div>
              <div className="text-primary-foreground/70 text-sm">{lang === 'fr' ? 'Pays' : 'Countries'}</div>
            </div>
            <div>
              <div className="font-serif text-4xl font-medium mb-1">100%</div>
              <div className="text-primary-foreground/70 text-sm">{lang === 'fr' ? 'Traçabilité' : 'Traceability'}</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
