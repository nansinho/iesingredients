import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight, MapPin, Droplet, Award, Beaker, Sparkles, Leaf, FlaskConical, FileText, Calendar, CheckCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSampleCart } from '@/contexts/SampleCartContext';
import { toast } from 'sonner';
import { 
  TranslatedProduct,
  getProductName,
  getProductDescription,
  getProductBenefits,
  getProductApplications,
  getProductSkinTypes,
  getProductAspect,
  getProductSolubility,
  getProductCertifications,
  getProductValorisations,
  getProductTraceability,
  getProductPreservatives,
  getProductHarvestCalendar 
} from '@/lib/translations';

interface ProductPageProps {
  lang: Language;
}

const getGammeConfig = (gamme: string | null) => {
  const g = gamme?.toUpperCase() || '';
  if (g.includes('ACTIF')) return { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary' };
  if (g.includes('NATUREL') || g.includes('VÉGÉTAL')) return { bg: 'bg-forest-600', light: 'bg-forest-100', text: 'text-forest-700' };
  if (g.includes('PARFUM') || g.includes('FRAGRANCE')) return { bg: 'bg-gold-600', light: 'bg-gold-100', text: 'text-gold-700' };
  return { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary' };
};

export const ProductPage = ({ lang }: ProductPageProps) => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslation(lang);
  const { addItem } = useSampleCart();
  
  const { data: product, isLoading, error } = useProduct(id || '');

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success(
        lang === 'fr' 
          ? `${product.nom_commercial} ajouté au panier` 
          : `${product.nom_commercial} added to cart`
      );
    }
  };
  const { data: similarProducts } = useSimilarProducts(product || null);

  if (isLoading) {
    return (
      <Layout lang={lang}>
        <div className="pt-24 pb-16">
          <div className="container-luxe">
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="aspect-square rounded-3xl" />
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
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
        <div className="pt-32 pb-20 container-luxe text-center">
          <h1 className="font-serif text-2xl mb-4">{lang === 'fr' ? 'Produit non trouvé' : 'Product not found'}</h1>
          <Button asChild variant="outline" className="rounded-full">
            <Link to={`/${lang}/catalogue`}><ArrowLeft className="mr-2 w-4 h-4" />{lang === 'fr' ? 'Retour au catalogue' : 'Back to catalog'}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const config = getGammeConfig(product.gamme);

  // Get translated content
  const productName = getProductName(product, lang);
  const productDescription = getProductDescription(product, lang);
  const benefits = getProductBenefits(product, lang);
  const certifs = getProductCertifications(product, lang);
  const apps = getProductApplications(product, lang);
  const skins = getProductSkinTypes(product, lang);
  const aspect = getProductAspect(product, lang);
  const solubility = getProductSolubility(product, lang);
  const preservatives = getProductPreservatives(product, lang);
  const traceability = getProductTraceability(product, lang);
  const valorisations = getProductValorisations(product, lang);
  const harvestCalendar = getProductHarvestCalendar(product, lang);

  // Parse arrays
  const benefitsArray = benefits ? benefits.split(/[\/,]/).map(b => b.trim()).filter(Boolean) : [];
  const certifications = certifs ? certifs.split(/[-\/,]/).map(c => c.trim()).filter(Boolean) : [];
  const applications = apps ? apps.split(/[\/,]/).map(a => a.trim()).filter(Boolean) : [];
  const skinTypes = skins ? skins.split(/[\/,]/).map(s => s.trim()).filter(Boolean) : [];

  // Initials for avatar
  const initials = productName 
    ? productName.split(' ').slice(0, 2).map(w => w[0]).join('')
    : 'P';

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{productName || 'Produit'} - IES Ingredients</title>
        <meta name="description" content={productDescription || ''} />
        <html lang={lang} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container-luxe">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to={`/${lang}`} className="hover:text-foreground transition-colors">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/${lang}/catalogue`} className="hover:text-foreground transition-colors">{t.nav.catalog}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{productName}</span>
          </nav>

          {/* Product Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          >
            {/* Left: Product Card */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              {/* Color Bar */}
              <div className={cn("h-3", config.bg)} />
              
              {/* Avatar & Basic Info */}
              <div className="p-8 text-center">
                <div className={cn(
                  "w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 font-serif text-3xl font-bold",
                  config.light, config.text
                )}>
                  {initials}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {product.gamme && (
                    <Badge className={cn("text-xs font-semibold px-3 py-1 text-white border-0", config.bg)}>
                      {product.gamme}
                    </Badge>
                  )}
                  {aspect && (
                    <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
                      {aspect}
                    </Badge>
                  )}
                </div>
                
                <p className="font-mono text-sm text-muted-foreground mb-2">Code: {product.code}</p>
                
                {product.inci && (
                  <div className="bg-secondary/50 rounded-xl p-3 mt-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t.product.inci}</p>
                    <p className="font-mono text-xs text-foreground">{product.inci}</p>
                  </div>
                )}
                
                {product.cas_no && (
                  <div className="mt-3 text-sm">
                    <span className="text-muted-foreground">{t.product.cas}: </span>
                    <span className="font-mono font-medium">{product.cas_no}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{productName}</h1>
                
                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {product.origine && (
                    <span className="flex items-center gap-2 text-sm bg-secondary/60 px-4 py-2 rounded-full">
                      <MapPin className="w-4 h-4 text-accent" />{product.origine}
                    </span>
                  )}
                  {solubility && (
                    <span className="flex items-center gap-2 text-sm bg-secondary/60 px-4 py-2 rounded-full">
                      <Droplet className="w-4 h-4 text-accent" />{solubility}
                    </span>
                  )}
                  {product.typologie_de_produit && (
                    <span className="flex items-center gap-2 text-sm bg-secondary/60 px-4 py-2 rounded-full">
                      <Leaf className="w-4 h-4 text-accent" />{product.typologie_de_produit}
                    </span>
                  )}
                </div>
              </div>

              {productDescription && (
                <p className="text-muted-foreground leading-relaxed">{productDescription}</p>
              )}

              {/* Benefits */}
              {benefitsArray.length > 0 && (
                <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-gold-600" />
                    <span className="font-semibold text-gold-800">{t.product.benefits}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {benefitsArray.map((benefit, i) => (
                      <Badge key={i} className="bg-gold-100 text-gold-700 border-gold-200 hover:bg-gold-200">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-2">{t.product.certifications}</p>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, i) => (
                        <Badge key={i} variant="outline" className="rounded-lg">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button 
                size="lg" 
                className="rounded-full h-14 px-8 font-semibold mt-4"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                {t.catalog.requestSample}
              </Button>
            </div>
          </motion.div>

          {/* Specifications Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
          >
            {[
              { icon: Beaker, label: t.product.inci, value: product.inci },
              { icon: FileText, label: t.product.cas, value: product.cas_no },
              { icon: MapPin, label: t.product.origin, value: product.origine },
              { icon: Droplet, label: t.product.solubility, value: solubility },
              { icon: Leaf, label: t.product.aspect, value: aspect },
              { icon: CheckCircle, label: lang === 'fr' ? 'Conservateurs' : 'Preservatives', value: preservatives },
              { icon: FileText, label: lang === 'fr' ? 'Traçabilité' : 'Traceability', value: traceability },
              { icon: Award, label: lang === 'fr' ? 'Valorisations' : 'Valorizations', value: valorisations },
              { icon: Calendar, label: lang === 'fr' ? 'Récolte' : 'Harvest', value: harvestCalendar },
            ].filter(item => item.value).map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Applications & Skin Types */}
          {(applications.length > 0 || skinTypes.length > 0) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              {applications.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-serif text-lg font-semibold mb-4">{lang === 'fr' ? 'Applications' : 'Applications'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {applications.map((app, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1.5 rounded-lg">{app}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {skinTypes.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-serif text-lg font-semibold mb-4">{lang === 'fr' ? 'Types de peau' : 'Skin Types'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skinTypes.map((type, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1.5 rounded-lg">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Similar Products */}
          {similarProducts && similarProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-serif text-2xl mb-6">{t.product.similar}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} lang={lang} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </Layout>
  );
};
