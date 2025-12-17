import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { ArrowRight, Search, Beaker, Sparkles, Leaf, ChevronRight } from 'lucide-react';
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
      description: lang === 'fr' ? 'Actifs et extraits botaniques premium' : 'Premium actives and botanical extracts',
      color: 'from-emerald-500/20 to-emerald-600/10',
    },
    {
      key: 'perfume' as const,
      icon: Sparkles,
      count: '1500+',
      description: lang === 'fr' ? 'Matières premières parfumerie fine' : 'Fine perfumery raw materials',
      color: 'from-violet-500/20 to-violet-600/10',
    },
    {
      key: 'aroma' as const,
      icon: Leaf,
      count: '1000+',
      description: lang === 'fr' ? 'Arômes alimentaires certifiés' : 'Certified food flavors',
      color: 'from-amber-500/20 to-amber-600/10',
    },
  ];

  const stats = [
    { value: '5000+', label: lang === 'fr' ? 'Références' : 'References' },
    { value: '30+', label: lang === 'fr' ? 'Années' : 'Years' },
    { value: '50+', label: lang === 'fr' ? 'Pays' : 'Countries' },
    { value: '100%', label: lang === 'fr' ? 'Traçabilité' : 'Traceability' },
  ];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>IES Ingredients - {lang === 'fr' ? 'Ingrédients Cosmétiques, Parfums & Arômes' : 'Cosmetic Ingredients, Perfumes & Flavors'}</title>
        <meta name="description" content={lang === 'fr' ? 'Plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires.' : 'Over 5000 cosmetic ingredients, perfumes and food flavors.'} />
        <html lang={lang} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(152,50%,12%)]/95 via-[hsl(152,45%,15%)]/85 to-[hsl(152,40%,18%)]/70" />
        </div>

        <div className="container-elegant relative z-10 pt-32 pb-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8 animate-fade-up">
              <Leaf className="h-4 w-4 text-[hsl(42,75%,55%)]" />
              <span className="text-sm text-white/90 font-medium">
                {lang === 'fr' ? 'Excellence depuis 1990' : 'Excellence since 1990'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 animate-fade-up stagger-1">
              {lang === 'fr' ? (
                <>L'art des<br /><span className="text-[hsl(42,75%,55%)]">ingrédients</span><br />naturels</>
              ) : (
                <>The art of<br /><span className="text-[hsl(42,75%,55%)]">natural</span><br />ingredients</>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-lg leading-relaxed animate-fade-up stagger-2">
              {lang === 'fr'
                ? 'Découvrez notre collection de plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires.'
                : 'Discover our collection of over 5000 cosmetic ingredients, perfumes and food flavors.'}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-8 animate-fade-up stagger-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.hero.search}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-12 h-13 bg-white/95 border-0 shadow-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" size="lg" className="h-13 px-6 forest-gradient text-primary-foreground shadow-lg">
                {lang === 'fr' ? 'Rechercher' : 'Search'}
              </Button>
            </form>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-4">
              <Link to={`/${lang}/catalogue`}>
                <Button size="lg" className="bg-white text-[hsl(152,45%,20%)] hover:bg-white/90 gap-2 shadow-lg group">
                  {t.hero.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to={`/${lang}/entreprise`}>
                <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 backdrop-blur-sm">
                  {lang === 'fr' ? 'Notre histoire' : 'Our story'}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-8 mt-16 pt-8 border-t border-white/15 animate-fade-up stagger-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl md:text-3xl text-white font-medium">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-background">
        <div className="container-elegant">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] text-accent font-semibold">
              {lang === 'fr' ? 'Nos expertises' : 'Our expertise'}
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-4">
              {lang === 'fr' ? 'Trois univers, une passion' : 'Three worlds, one passion'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((cat, index) => (
              <Link
                key={cat.key}
                to={`/${lang}/catalogue?category=${cat.key}`}
                className="group card-elegant p-8 lg:p-10 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-6 
                              group-hover:scale-110 transition-transform duration-500`}>
                  <cat.icon className="h-8 w-8 text-primary" />
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                    {t.categories[cat.key]}
                  </h3>
                  <span className="text-sm font-semibold text-accent">{cat.count}</span>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center text-primary font-medium text-sm gap-2 group-hover:gap-3 transition-all">
                  {lang === 'fr' ? 'Explorer' : 'Explore'}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-secondary/40">
        <div className="container-elegant">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-sm uppercase tracking-[0.2em] text-accent font-semibold">
                {lang === 'fr' ? 'Sélection' : 'Selection'}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mt-3">
                {lang === 'fr' ? 'Produits vedettes' : 'Featured products'}
              </h2>
            </div>
            <Link to={`/${lang}/catalogue`}>
              <Button variant="outline" className="gap-2 group">
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
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[hsl(42,75%,55%)] rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container-elegant relative text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {lang === 'fr'
              ? 'Prêt à découvrir nos ingrédients ?'
              : 'Ready to discover our ingredients?'}
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Explorez notre catalogue complet et trouvez les ingrédients parfaits pour vos formulations.'
              : 'Explore our complete catalog and find the perfect ingredients for your formulations.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/${lang}/catalogue`}>
              <Button size="lg" className="bg-white text-[hsl(152,45%,20%)] hover:bg-white/90 gap-2 shadow-lg">
                {lang === 'fr' ? 'Voir le catalogue' : 'View catalog'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/${lang}/contact`}>
              <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
