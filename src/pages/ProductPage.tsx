import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/catalog/ProductCard';
import {
  ArrowLeft,
  Leaf,
  MapPin,
  Droplet,
  Award,
  FlaskConical,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductPageProps {
  lang: Language;
}

export const ProductPage = ({ lang }: ProductPageProps) => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslation(lang);

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout lang={lang}>
        <div className="pt-32 pb-20 container text-center">
          <h1 className="font-display text-2xl font-bold mb-4">
            {lang === 'fr' ? 'Produit non trouvé' : 'Product not found'}
          </h1>
          <Button asChild>
            <Link to={`/${lang}/catalogue`}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              {lang === 'fr' ? 'Retour au catalogue' : 'Back to catalog'}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Get similar products (same family)
  const similarProducts = mockProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.familleOlfactive === product.familleOlfactive ||
          p.category === product.category)
    )
    .slice(0, 4);

  const categoryColors = {
    cosmetic: 'bg-pink-100 text-pink-700',
    perfume: 'bg-purple-100 text-purple-700',
    aroma: 'bg-orange-100 text-orange-700',
  };

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {product.name} - IES Ingredients | {t.categories[product.category]}
        </title>
        <meta name="description" content={product.description} />
        <link
          rel="canonical"
          href={`https://ies-ingredients.com/${lang}/produit/${product.id}`}
        />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Link to={`/${lang}`} className="hover:text-foreground transition-colors">
              {lang === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/${lang}/catalogue`}
              className="hover:text-foreground transition-colors"
            >
              {t.nav.catalog}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/${lang}/catalogue?category=${product.category}`}
              className="hover:text-foreground transition-colors"
            >
              {t.categories[product.category]}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          {/* Product Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Section */}
            <div className="animate-fade-in">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-nature shadow-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-24 h-24 text-primary/30" />
                  </div>
                </div>
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  <Badge className={cn('text-sm', categoryColors[product.category])}>
                    {t.categories[product.category]}
                  </Badge>
                  {product.foodGrade && (
                    <Badge className="bg-accent text-accent-foreground">Food Grade</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="animate-fade-in-up">
              {/* Code */}
              <span className="text-sm font-medium text-accent tracking-wider">
                {product.code}
              </span>

              {/* Name */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
                {product.name}
              </h1>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>{product.familleOlfactive}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{product.origine}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplet className="w-4 h-4 text-primary" />
                  <span>{product.solubility}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/50 rounded-xl p-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.product.inci}
                  </span>
                  <p className="font-medium text-foreground mt-1">{product.inci}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.product.cas}
                  </span>
                  <p className="font-medium text-foreground mt-1">{product.casNo}</p>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">
                    {t.product.certifications}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="hero">
                  <FlaskConical className="mr-2 w-5 h-5" />
                  {t.catalog.requestSample}
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={`/${lang}/contact`}>
                    {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-20">
            <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent mb-8">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                {t.product.description}
              </TabsTrigger>
              <TabsTrigger
                value="benefits"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                {t.product.benefits}
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                {t.product.performance}
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                {t.product.specifications}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="animate-fade-in">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="animate-fade-in">
              {product.benefits && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.benefits.map((benefit, index) => (
                    <div
                      key={benefit}
                      className="bg-muted/50 rounded-xl p-6 text-center animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="font-medium text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="animate-fade-in">
              {product.performance && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <span className="text-sm text-muted-foreground">pH</span>
                    <p className="font-display text-2xl font-bold text-foreground mt-1">
                      {product.performance.ph}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <span className="text-sm text-muted-foreground">Base</span>
                    <p className="font-display text-2xl font-bold text-foreground mt-1">
                      {product.performance.base}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <span className="text-sm text-muted-foreground">
                      {lang === 'fr' ? 'Odeur' : 'Odor'}
                    </span>
                    <p className="font-display text-2xl font-bold text-foreground mt-1">
                      {product.performance.odeur}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t.product.inci}</span>
                    <span className="font-medium text-foreground">{product.inci}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t.product.cas}</span>
                    <span className="font-medium text-foreground">{product.casNo}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t.product.origin}</span>
                    <span className="font-medium text-foreground">{product.origine}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t.product.solubility}</span>
                    <span className="font-medium text-foreground">{product.solubility}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t.product.aspect}</span>
                    <span className="font-medium text-foreground">{product.aspect}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Food Grade</span>
                    <span className="font-medium text-foreground">
                      {product.foodGrade ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No')}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <section>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                {t.product.similar}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} lang={lang} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};
