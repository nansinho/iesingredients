import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight, MapPin, Droplet, Award, Beaker, Sparkles, Leaf, FileText, Calendar, CheckCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSampleCart } from '@/contexts/SampleCartContext';
import { toast } from 'sonner';
import { CopyField } from '@/components/ui/CopyButton';

interface ProductPageProps {
  lang: Language;
}

// Product banner images based on typologie_de_produit
const getProductBanner = (typologie: string | null) => {
  const t = typologie?.toUpperCase() || '';
  if (t.includes('COSMET') || t.includes('COSMÉT')) return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&h=300&fit=crop';
  if (t.includes('PARFUM')) return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=300&fit=crop';
  if (t.includes('AROME') || t.includes('ARÔME')) return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=300&fit=crop';
  return 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&h=300&fit=crop';
};

// Category color config
const getCategoryConfig = (typologie: string | null) => {
  const t = typologie?.toUpperCase() || '';
  if (t.includes('COSMET') || t.includes('COSMÉT')) return { bg: 'bg-cosmetique', light: 'bg-cosmetique/10', text: 'text-cosmetique' };
  if (t.includes('PARFUM')) return { bg: 'bg-parfum', light: 'bg-parfum/10', text: 'text-parfum' };
  if (t.includes('AROME') || t.includes('ARÔME')) return { bg: 'bg-arome', light: 'bg-arome/10', text: 'text-arome' };
  return { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary' };
};

export const ProductPage = ({ lang }: ProductPageProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const t = useTranslation(lang);
  const { addItem } = useSampleCart();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const { data: product, isLoading, error } = useProduct(id || '', lang);
  const { data: similarProducts } = useSimilarProducts(product || null, lang);

  const handleAddToCart = () => {
    if (product) {
      addItem(product as any);
      toast.success(
        lang === 'fr' 
          ? `${product.nom_commercial} ajouté au panier` 
          : `${product.nom_commercial} added to cart`
      );
    }
  };

  if (isLoading) {
    return (
      <Layout lang={lang}>
        <div className="min-h-screen">
          <div className="relative h-64 bg-forest-900">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="container-luxe -mt-20 relative z-10 px-4">
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        <div className="min-h-screen bg-forest-950">
          <div className="h-64 bg-gradient-to-b from-forest-900 to-forest-950" />
          <div className="container-luxe -mt-20 relative z-10 text-center py-20 px-4">
            <h1 className="font-serif text-2xl mb-4 text-white">{lang === 'fr' ? 'Produit non trouvé' : 'Product not found'}</h1>
            <Button asChild variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
              <Link to={`/${lang}/catalogue`}><ArrowLeft className="mr-2 w-4 h-4" />{lang === 'fr' ? 'Retour au catalogue' : 'Back to catalog'}</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const config = getCategoryConfig(product.typologie_de_produit);
  const bannerImage = getProductBanner(product.typologie_de_produit);
  const productName = product.nom_commercial || '';
  const productDescription = product.description || '';

  const benefitsArray = product.benefices ? product.benefices.split(/[\/,]/).map(b => b.trim()).filter(Boolean) : [];
  const certifications = product.certifications ? product.certifications.split(/[-\/,]/).map(c => c.trim()).filter(Boolean) : [];
  const applications = product.application ? product.application.split(/[\/,]/).map(a => a.trim()).filter(Boolean) : [];
  const skinTypes = product.type_de_peau ? product.type_de_peau.split(/[\/,]/).map(s => s.trim()).filter(Boolean) : [];

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

      {/* Hero Banner */}
      <section className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
        <img 
          src={bannerImage}
          alt={productName}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-forest-950/30" />
        
        {/* Breadcrumb */}
        <div className="absolute top-20 sm:top-24 left-0 right-0">
          <div className="container-luxe px-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-white/70 overflow-x-auto">
              <Link to={`/${lang}`} className="hover:text-white transition-colors shrink-0">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <Link to={`/${lang}/catalogue`} className="hover:text-white transition-colors shrink-0">{t.nav.catalog}</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="text-white font-medium truncate max-w-[150px] sm:max-w-[200px]">{productName}</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-8 sm:py-12">
        <div className="container-luxe px-4">
          {/* Product Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 -mt-24 sm:-mt-32 relative z-10">
            {/* Left: Product Card */}
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-xl">
              <div className={cn("h-2 sm:h-3", config.bg)} />
              
              <div className="p-4 sm:p-6 md:p-8 text-center">
                <div className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 font-serif text-xl sm:text-2xl md:text-3xl font-bold",
                  config.light, config.text
                )}>
                  {initials}
                </div>
                
                {/* Code */}
                <div className={cn("rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4", config.light)}>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Code Produit</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={cn("font-mono text-lg sm:text-xl md:text-2xl font-bold", config.text)}>
                      {product.code}
                    </span>
                    <CopyField 
                      label="" 
                      value={product.code || ''} 
                      mono 
                      className="text-muted-foreground"
                      successMessage={lang === 'fr' ? 'Code copié !' : 'Code copied!'}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {product.gamme && (
                    <Badge className={cn("text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 text-white border-0", config.bg)}>
                      {product.gamme}
                    </Badge>
                  )}
                  {product.aspect && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1">
                      {product.aspect}
                    </Badge>
                  )}
                </div>
                
                {/* INCI */}
                {product.inci && (
                  <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 mt-4">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t.product.inci}</p>
                    <CopyField 
                      label="INCI" 
                      value={product.inci} 
                      mono 
                      className="text-[10px] sm:text-xs text-foreground font-mono break-all"
                      successMessage={lang === 'fr' ? 'INCI copié !' : 'INCI copied!'}
                    />
                  </div>
                )}
                
                {/* CAS */}
                {product.cas_no && (
                  <div className="mt-3 text-xs sm:text-sm flex flex-wrap justify-center gap-1">
                    <span className="text-muted-foreground">{t.product.cas}: </span>
                    <CopyField 
                      label="CAS" 
                      value={product.cas_no} 
                      mono 
                      className="font-mono font-medium"
                      successMessage={lang === 'fr' ? 'CAS copié !' : 'CAS copied!'}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 pt-4 lg:pt-0">
              <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 md:p-8">
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 break-words">{productName}</h1>
                
                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {product.origine && (
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-secondary/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full overflow-hidden">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-[150px]">{product.origine}</span>
                    </span>
                  )}
                  {product.solubilite && (
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-secondary/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full overflow-hidden">
                      <Droplet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-[150px]">{product.solubilite}</span>
                    </span>
                  )}
                  {product.typologie_de_produit && (
                    <span className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-secondary/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full overflow-hidden">
                      <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                      <span className="truncate max-w-[100px] sm:max-w-[150px]">{product.typologie_de_produit}</span>
                    </span>
                  )}
                </div>

                {productDescription && (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{productDescription}</p>
                )}

                {/* Benefits */}
                {benefitsArray.length > 0 && (
                  <div className="bg-gold-50 border border-gold-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mt-4 sm:mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
                      <span className="font-semibold text-sm sm:text-base text-gold-800">{t.product.benefits}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {benefitsArray.map((benefit, i) => (
                        <Badge key={i} className="bg-gold-100 text-gold-700 border-gold-200 hover:bg-gold-200 text-[10px] sm:text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div className="flex items-start gap-3 mt-4 sm:mt-6">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium mb-2">{t.product.certifications}</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {certifications.map((cert, i) => (
                          <Badge key={i} variant="outline" className="rounded-lg text-[10px] sm:text-xs">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Button 
                  size="lg" 
                  className="rounded-full h-12 sm:h-14 px-6 sm:px-8 font-semibold mt-4 sm:mt-6 w-full sm:w-auto"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {t.catalog.requestSample}
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {[
              { icon: Beaker, label: t.product.inci, value: product.inci, copyable: true },
              { icon: FileText, label: t.product.cas, value: product.cas_no, copyable: true },
              { icon: MapPin, label: t.product.origin, value: product.origine },
              { icon: Droplet, label: t.product.solubility, value: product.solubilite },
              { icon: Leaf, label: t.product.aspect, value: product.aspect },
              { icon: CheckCircle, label: lang === 'fr' ? 'Conservateurs' : 'Preservatives', value: product.conservateurs },
              { icon: FileText, label: lang === 'fr' ? 'Traçabilité' : 'Traceability', value: product.tracabilite },
              { icon: Award, label: lang === 'fr' ? 'Valorisations' : 'Valorizations', value: product.valorisations },
              { icon: Calendar, label: lang === 'fr' ? 'Récolte' : 'Harvest', value: product.calendrier_des_recoltes },
            ].filter(item => item.value).map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3 overflow-hidden">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  {item.copyable ? (
                    <CopyField 
                      label={item.label} 
                      value={item.value || ''} 
                      mono 
                      className="text-[10px] sm:text-xs font-medium text-foreground break-all"
                      successMessage={lang === 'fr' ? `${item.label} copié !` : `${item.label} copied!`}
                    />
                  ) : (
                    <p className="text-[10px] sm:text-xs font-medium text-foreground break-words">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Applications & Skin Types */}
          {(applications.length > 0 || skinTypes.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {applications.length > 0 && (
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{lang === 'fr' ? 'Applications' : 'Applications'}</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {applications.map((app, i) => (
                      <Badge key={i} variant="secondary" className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs">{app}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {skinTypes.length > 0 && (
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="font-serif text-base sm:text-lg font-semibold mb-3 sm:mb-4">{lang === 'fr' ? 'Types de peau' : 'Skin Types'}</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {skinTypes.map((type, i) => (
                      <Badge key={i} variant="secondary" className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Similar Products */}
          {similarProducts && similarProducts.length > 0 && (
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                {lang === 'fr' ? 'Produits similaires' : 'Similar Products'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {similarProducts.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} lang={lang} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};