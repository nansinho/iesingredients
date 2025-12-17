import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ArrowLeft, ChevronRight, MapPin, Droplet, Award, FlaskConical } from 'lucide-react';
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
          <h1 className="font-serif text-2xl mb-4">{lang === 'fr' ? 'Produit non trouvé' : 'Product not found'}</h1>
          <Button asChild>
            <Link to={`/${lang}/catalogue`}><ArrowLeft className="mr-2 w-4 h-4" />{lang === 'fr' ? 'Retour' : 'Back'}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const similarProducts = mockProducts.filter(p => p.id !== product.id && (p.familleOlfactive === product.familleOlfactive || p.category === product.category)).slice(0, 4);

  const categoryColors = {
    cosmetic: 'bg-pink-50 text-pink-700 border-pink-200',
    perfume: 'bg-purple-50 text-purple-700 border-purple-200',
    aroma: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{product.name} - IES Ingredients</title>
        <meta name="description" content={product.description} />
        <html lang={lang} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to={`/${lang}`} className="hover:text-foreground">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${lang}/catalogue`} className="hover:text-foreground">{t.nav.catalog}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center relative">
              <span className="text-9xl font-serif text-muted-foreground/20">{product.name.charAt(0)}</span>
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="outline" className={cn('text-xs', categoryColors[product.category])}>
                  {t.categories[product.category]}
                </Badge>
                {product.foodGrade && <Badge className="bg-primary text-primary-foreground text-xs">Food Grade</Badge>}
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-sm text-primary font-medium mb-2">{product.code}</p>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{product.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{product.origine}</span>
                <span className="flex items-center gap-1"><Droplet className="w-4 h-4" />{product.solubility}</span>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.product.inci}</p>
                  <p className="font-medium text-sm">{product.inci}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.product.cas}</p>
                  <p className="font-medium text-sm">{product.casNo}</p>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t.product.certifications}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map(cert => (
                    <Badge key={cert} variant="outline" className="text-xs">{cert}</Badge>
                  ))}
                </div>
              </div>

              <Button size="lg">
                <FlaskConical className="mr-2 w-4 h-4" />
                {t.catalog.requestSample}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                {t.product.specifications}
              </TabsTrigger>
              {product.benefits && (
                <TabsTrigger value="benefits" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                  {t.product.benefits}
                </TabsTrigger>
              )}
              {product.performance && (
                <TabsTrigger value="performance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">
                  {t.product.performance}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {[
                  { label: t.product.inci, value: product.inci },
                  { label: t.product.cas, value: product.casNo },
                  { label: t.product.origin, value: product.origine },
                  { label: t.product.solubility, value: product.solubility },
                  { label: t.product.aspect, value: product.aspect },
                  { label: 'Food Grade', value: product.foodGrade ? (lang === 'fr' ? 'Oui' : 'Yes') : (lang === 'fr' ? 'Non' : 'No') },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {product.benefits && (
              <TabsContent value="benefits" className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.benefits.map(benefit => (
                    <div key={benefit} className="bg-secondary/50 rounded-lg p-4 text-center">
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {product.performance && (
              <TabsContent value="performance" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-1">pH</p>
                    <p className="font-serif text-2xl">{product.performance.ph}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-1">Base</p>
                    <p className="font-serif text-2xl">{product.performance.base}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-1">{lang === 'fr' ? 'Odeur' : 'Odor'}</p>
                    <p className="font-serif text-xl">{product.performance.odeur}</p>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl mb-8">{t.product.similar}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p, i) => <ProductCard key={p.id} product={p} lang={lang} index={i} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};
