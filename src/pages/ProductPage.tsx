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
import { ArrowLeft, ChevronRight, MapPin, Droplet, Award, Beaker, Sparkles, Leaf, FileText, Calendar, CheckCircle, ShoppingBag, Star, Flower2, FlaskConical } from 'lucide-react';
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

// Convert rating like "5/5", "3/5" to number of stars
const parseRating = (rating: string | null | undefined): number => {
  if (!rating) return 0;
  const str = rating.trim();
  const slashMatch = str.match(/^(\d+)\s*\/\s*5$/);
  if (slashMatch) return Math.min(5, Math.max(0, parseInt(slashMatch[1], 10)));
  const starCount = (str.match(/★/g) || []).length;
  if (starCount > 0) return Math.min(5, starCount);
  const asteriskCount = (str.match(/\*/g) || []).length;
  if (asteriskCount > 0) return Math.min(5, asteriskCount);
  return 0;
};

// Check if value is a rating
const isRatingValue = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const str = value.trim();
  return /^\d+\s*\/\s*5$/.test(str) || /^[★\*]+$/.test(str);
};

// Star rating component
const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating 
              ? "fill-parfum text-parfum" 
              : "fill-transparent text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
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
  const isParfum = product.typologie_de_produit?.toUpperCase().includes('PARFUM');

  // Parse profil olfactif into tags
  const profilOlfactifTags = product.profil_olfactif 
    ? product.profil_olfactif.split(/[,\/]/).map(s => s.trim()).filter(Boolean) 
    : [];

  const benefitsArray = product.benefices ? product.benefices.split(/[\/,]/).map(b => b.trim()).filter(Boolean) : [];
  const certifications = product.certifications ? product.certifications.split(/[-\/,]/).map(c => c.trim()).filter(Boolean) : [];
  const applications = product.application ? product.application.split(/[\/,]/).map(a => a.trim()).filter(Boolean) : [];
  const skinTypes = product.type_de_peau ? product.type_de_peau.split(/[\/,]/).map(s => s.trim()).filter(Boolean) : [];

  const initials = productName 
    ? productName.split(' ').slice(0, 2).map(w => w[0]).join('')
    : 'P';

  // Build performance data
  const performanceData: { label: string; value: string; isRating: boolean }[] = [];
  const optionFields = [
    { option: product.option_1, performance: product.performance_1 },
    { option: product.option_2, performance: product.performance_2 },
    { option: product.option_3, performance: product.performance_3 },
    { option: product.option_4, performance: product.performance_4 },
    { option: product.option_5, performance: product.performance_5 },
    { option: product.option_6, performance: product.performance_6 },
  ];
  optionFields.forEach(({ option, performance }) => {
    if (option && performance) {
      performanceData.push({
        label: option,
        value: performance,
        isRating: isRatingValue(performance),
      });
    }
  });

  // Build stability data
  const stabilityData: { ph: string; base: string; odeur: string | null }[] = [
    { ph: '2', base: lang === 'fr' ? 'Nettoyant acide' : 'Acid cleaner', odeur: product.odeur_nettoyant_acide },
    { ph: '3', base: lang === 'fr' ? 'Assouplissant textile' : 'Fabric softener', odeur: product.odeur_assouplissant_textile },
    { ph: '3,5', base: lang === 'fr' ? 'Anti-transpirant' : 'Antiperspirant', odeur: product.odeur_antisudorifique },
    { ph: '6', base: lang === 'fr' ? 'Shampooing' : 'Shampoo', odeur: product.odeur_shampooing },
    { ph: '9', base: 'APC', odeur: product.odeur_apc },
    { ph: '9', base: lang === 'fr' ? 'Lessive liquide' : 'Liquid detergent', odeur: product.odeur_detergent_liquide },
    { ph: '10', base: lang === 'fr' ? 'Savon' : 'Soap', odeur: product.odeur_savon },
    { ph: '10,5', base: lang === 'fr' ? 'Lessive en poudre' : 'Powder detergent', odeur: product.odeur_detergent_poudre },
    { ph: '11', base: lang === 'fr' ? 'Eau de Javel' : 'Bleach', odeur: product.odeur_eau_javel },
  ].filter(item => item.odeur);

  const hasPerformance = performanceData.length > 0;
  const hasStability = stabilityData.length > 0;

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
                  {product.typologie_de_produit && (
                    <Badge className={cn("text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 text-white border-0", config.bg)}>
                      {product.typologie_de_produit}
                    </Badge>
                  )}
                  {product.famille_olfactive && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1">
                      <Flower2 className="w-3 h-3 mr-1" />
                      {product.famille_olfactive}
                    </Badge>
                  )}
                  {product.aspect && (
                    <Badge variant="outline" className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1">
                      {product.aspect}
                    </Badge>
                  )}
                </div>
                
                {/* CAS */}
                {product.cas_no && (
                  <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 mt-4">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mb-1">CAS N°</p>
                    <CopyField 
                      label="CAS" 
                      value={product.cas_no} 
                      mono 
                      className="text-sm sm:text-base text-foreground font-mono"
                      successMessage={lang === 'fr' ? 'CAS copié !' : 'CAS copied!'}
                    />
                  </div>
                )}

                {/* Origine */}
                {product.origine && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{product.origine}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 pt-4 lg:pt-0">
              <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 md:p-8">
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 break-words">{productName}</h1>
                
                {/* Profil Olfactif Tags */}
                {profilOlfactifTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profilOlfactifTags.map((tag, i) => (
                      <Badge key={i} className="bg-parfum/10 text-parfum border-parfum/20 hover:bg-parfum/20 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {productDescription && (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{productDescription}</p>
                )}

                {/* Benefits */}
                {benefitsArray.length > 0 && (
                  <div className="bg-gold-50 border border-gold-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4">
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
                  <div className="flex items-start gap-3 mb-4">
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
                  className="rounded-full h-12 sm:h-14 px-6 sm:px-8 font-semibold mt-4 w-full sm:w-auto"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {t.catalog.requestSample}
                </Button>
              </div>
            </div>
          </div>

          {/* Performance & Stability Tables */}
          {isParfum && (hasPerformance || hasStability) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-12">
              {/* Performance Table */}
              {hasPerformance && (
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 text-parfum flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Performance
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-border">
                        {performanceData.map((item, i) => (
                          <tr key={i} className="hover:bg-secondary/30 transition-colors">
                            <td className="py-3 pr-4 text-muted-foreground">{item.label}</td>
                            <td className="py-3 font-medium text-foreground text-right">
                              {item.isRating ? (
                                <StarRating rating={parseRating(item.value)} />
                              ) : (
                                <span className="text-parfum font-semibold">{item.value}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Stability Table */}
              {hasStability && (
                <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 text-parfum flex items-center gap-2">
                    <Beaker className="w-5 h-5" />
                    {lang === 'fr' ? 'Stabilité' : 'Stability'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 pr-3 text-left font-semibold text-parfum">pH</th>
                          <th className="py-2 pr-3 text-left font-semibold text-parfum">Base</th>
                          <th className="py-2 text-right font-semibold text-parfum">
                            {lang === 'fr' ? 'Odeur' : 'Odor'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {stabilityData.map((item, i) => (
                          <tr key={i} className="hover:bg-secondary/30 transition-colors">
                            <td className="py-2.5 pr-3 text-muted-foreground font-mono">{item.ph}</td>
                            <td className="py-2.5 pr-3 text-foreground">{item.base}</td>
                            <td className="py-2.5 text-right">
                              <StarRating rating={parseRating(item.odeur)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                    {lang === 'fr' ? 'médiocre' : 'poor'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex">
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                    </span>
                    {lang === 'fr' ? 'moyen' : 'fair'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex">
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                    </span>
                    {lang === 'fr' ? 'correct' : 'average'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex">
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                    </span>
                    {lang === 'fr' ? 'bon' : 'good'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex">
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                      <Star className="w-3.5 h-3.5 fill-parfum text-parfum" />
                    </span>
                    {lang === 'fr' ? 'excellent' : 'excellent'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
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
              { icon: Leaf, label: lang === 'fr' ? 'Nom latin' : 'Latin name', value: product.nom_latin },
              { icon: CheckCircle, label: 'Food Grade', value: product.food_grade },
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
