import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight, MapPin, Droplet, Award, FlaskConical, Sparkles, Beaker, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import product images
import creamJar from '@/assets/cream-jar.jpg';
import productBottle from '@/assets/product-bottle.jpg';
import essentialOil from '@/assets/essential-oil.jpg';

interface ProductPageProps {
  lang: Language;
}

const productImages = [creamJar, productBottle, essentialOil];

export const ProductPage = ({ lang }: ProductPageProps) => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslation(lang);
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: similarProducts } = useSimilarProducts(product || null);

  if (isLoading) {
    return (
      <Layout lang={lang}>
        <div className="pt-24 pb-16">
          <div className="container">
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product || error) {
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

  // Parse benefits and certifications
  const benefitsArray = product.benefices
    ? product.benefices.split(/[\/,]/).map(b => b.trim()).filter(Boolean)
    : [];

  const certifications = product.certifications
    ? product.certifications.split(/[\-\/,]/).map(c => c.trim()).filter(Boolean)
    : [];

  const applications = product.application
    ? product.application.split(/[\/,]/).map(a => a.trim()).filter(Boolean)
    : [];

  const productImage = productImages[Math.abs((product.code || '').charCodeAt(0)) % productImages.length];

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{product.nom_commercial || 'Produit'} - IES Ingredients</title>
        <meta name="description" content={product.description || ''} />
        <html lang={lang} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container-luxe">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to={`/${lang}`} className="hover:text-foreground">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${lang}/catalogue`} className="hover:text-foreground">{t.nav.catalog}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.nom_commercial}</span>
          </nav>

          {/* Product Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <div className="aspect-square bg-secondary/30 rounded-3xl overflow-hidden relative group">
              <img 
                src={productImage} 
                alt={product.nom_commercial || 'Produit'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.gamme && (
                  <Badge className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full">
                    {product.gamme}
                  </Badge>
                )}
                {product.aspect && (
                  <Badge variant="secondary" className="text-sm font-semibold px-4 py-2 rounded-full">
                    {product.aspect}
                  </Badge>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-medium mb-2 font-mono">Code: {product.code}</p>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{product.nom_commercial}</h1>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {product.origine && (
                  <span className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4 text-accent" />{product.origine}
                  </span>
                )}
                {product.solubilite && (
                  <span className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                    <Droplet className="w-4 h-4 text-accent" />{product.solubilite}
                  </span>
                )}
                {product.typologie_de_produit && (
                  <span className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                    <Leaf className="w-4 h-4 text-accent" />{product.typologie_de_produit}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              )}

              {/* Key Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.inci && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Beaker className="w-4 h-4 text-primary" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.product.inci}</p>
                    </div>
                    <p className="font-medium text-sm font-mono">{product.inci}</p>
                  </div>
                )}
                {product.cas_no && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t.product.cas}</p>
                    <p className="font-medium text-sm font-mono">{product.cas_no}</p>
                  </div>
                )}
              </div>

              {/* Benefits */}
              {benefitsArray.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span className="text-sm font-medium">{t.product.benefits}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {benefitsArray.map((benefit, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1.5 rounded-full bg-gold-50 border-gold-200 text-gold-700">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{t.product.certifications}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1.5 rounded-lg">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button size="lg" className="rounded-full h-14 px-8 font-semibold">
                <FlaskConical className="mr-2 w-5 h-5" />
                {t.catalog.requestSample}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 font-semibold">
                {t.product.specifications}
              </TabsTrigger>
              {applications.length > 0 && (
                <TabsTrigger value="applications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 font-semibold">
                  {lang === 'fr' ? 'Applications' : 'Applications'}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details" className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {[
                  { label: t.product.inci, value: product.inci },
                  { label: t.product.cas, value: product.cas_no },
                  { label: t.product.origin, value: product.origine },
                  { label: t.product.solubility, value: product.solubilite },
                  { label: t.product.aspect, value: product.aspect },
                  { label: lang === 'fr' ? 'Conservateurs' : 'Preservatives', value: product.conservateurs },
                  { label: lang === 'fr' ? 'Traçabilité' : 'Traceability', value: product.tracabilite },
                  { label: lang === 'fr' ? 'Valorisations' : 'Valorizations', value: product.valorisations },
                ].filter(item => item.value).map(item => (
                  <div key={item.label} className="flex justify-between py-4 border-b border-border">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-right max-w-[200px]">{item.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {applications.length > 0 && (
              <TabsContent value="applications" className="pt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {applications.map((app, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/50 transition-colors">
                      <span className="font-medium">{app}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Similar Products */}
          {similarProducts && similarProducts.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl mb-8">{t.product.similar}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} lang={lang} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};
