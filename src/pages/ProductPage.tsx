import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { useProductPerformancePublic } from '@/hooks/usePerformance';
import { useProductStabilityPublic } from '@/hooks/useStability';
import { useSampleCart } from '@/contexts/SampleCartContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';

// Product components
import { ProductHero } from '@/components/product/ProductHero';
import { ProductStickyCTA } from '@/components/product/ProductStickyCTA';
import { ProductSummaryCard } from '@/components/product/ProductSummaryCard';
import { ProductSpecsGrid } from '@/components/product/ProductSpecsGrid';
import { ProductDetailsAccordion } from '@/components/product/ProductDetailsAccordion';
import { SimilarProducts } from '@/components/product/SimilarProducts';
import { PerformanceStabilitySection } from '@/components/product/PerformanceStabilitySection';

// Animation variants for cascade effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const separatorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Loading skeleton
function ProductPageSkeleton({ lang }: { lang: 'fr' | 'en' }) {
  return (
    <Layout lang={lang}>
      <div className="min-h-screen bg-white">
        {/* Hero skeleton */}
        <div className="bg-forest-900 animate-pulse">
          <Skeleton className="w-full h-56 sm:h-72 bg-forest-800" />
        </div>
        
        <div className="container-luxe py-8 space-y-8">
          <Skeleton className="h-40 w-full rounded-xl bg-forest-100" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-forest-100" />
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-xl bg-forest-100" />
        </div>
      </div>
    </Layout>
  );
}

// Error state
function ProductPageError({ lang }: { lang: 'fr' | 'en' }) {
  return (
    <Layout lang={lang}>
      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white flex items-center justify-center px-4">
        <motion.div 
          className="text-center space-y-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-forest-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900">
            Produit introuvable
          </h1>
          <p className="text-forest-600 font-sans">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild className="bg-forest-900 text-gold-400 hover:bg-forest-800">
            <a href={`/${lang}/catalogue`}>Retour au catalogue</a>
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}

export default function ProductPage() {
  const { code, lang = 'fr' } = useParams<{ code: string; lang: string }>();
  const currentLang = (lang === 'en' ? 'en' : 'fr') as 'fr' | 'en';
  const { data: product, isLoading, error } = useProduct(code || '');
  const { data: similarProducts = [] } = useSimilarProducts(product);
  const { addItem, items } = useSampleCart();

  // Fetch performance and stability data from dedicated tables
  const { data: perfData } = useProductPerformancePublic(product?.code || null);
  const { data: stabData } = useProductStabilityPublic(product?.code || null);

  // Check if product is in cart
  const isInCart = items.some(item => item.product.id === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product);
    
    toast.success('Produit ajouté au panier', {
      description: product.nom_commercial,
    });
  };

  // Loading state
  if (isLoading) {
    return <ProductPageSkeleton lang={currentLang} />;
  }

  // Error state
  if (error || !product) {
    return <ProductPageError lang={currentLang} />;
  }

  // Build performance data from parfum_performance table
  const isParfum = product.typologie_de_produit?.toUpperCase().includes('PARFUM');
  
  // Build performance section data from the new table
  const performanceSectionData = (perfData || []).map(row => ({
    option: row.option_name || '',
    value: row.performance_value || undefined,
    rating: row.performance_rating || undefined,
    isText: !!row.performance_value,
  })).filter(item => item.option);

  // Build stability data from parfum_stabilite table
  // odeur_rating (1-5) directly maps to star count
  const stabilityData = (stabData || []).map(row => ({
    ph: row.ph_value || '-',
    base: row.base_name,
    odeur: row.odeur_rating || 0, // Direct mapping: 1-5 rating = 1-5 stars
  })).filter(item => item.base);

  // Additional fields for accordion
  const additionalFields: Record<string, string | null> = {
    'Calendrier des récoltes': (product as any).calendrier_des_recoltes,
    'Flavouring preparation': (product as any).flavouring_preparation,
    'Famille olfactive': (product as any).famille_olfactive,
    'Odeur': (product as any).odeur,
    'Bénéfices aqueux': (product as any).benefices_aqueux,
    'Bénéfices huileux': (product as any).benefices_huileux,
    'Profil aromatique': (product as any).profil_aromatique,
  };

  const productName = product.nom_commercial || 'Produit';

  // Only show Performance & Stability section if there's data
  const hasPerformanceData = performanceSectionData.length > 0;
  const hasStabilityData = stabilityData.length > 0;
  const showPerfStabSection = isParfum && (hasPerformanceData || hasStabilityData);

  return (
    <Layout lang={currentLang}>
      <Helmet>
        <title>{productName} - IES Ingredients</title>
        <meta 
          name="description" 
          content={product.description || `Découvrez ${productName}, un ingrédient de haute qualité par IES Ingredients.`} 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white pb-28 md:pb-0">
        {/* Hero */}
        <ProductHero
          code={product.code}
          name={product.nom_commercial}
          typologie={product.typologie_de_produit}
          origine={product.origine}
          gamme={product.gamme}
          lang={currentLang}
          imageUrl={product.image_url}
        />

        {/* Main Content */}
        <motion.main 
          className="container-luxe py-8 sm:py-12 space-y-8 sm:space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Desktop CTA */}
          <motion.div 
            className="hidden md:block"
            variants={itemVariants}
          >
            <Button
              onClick={handleAddToCart}
              size="lg"
              className={`font-sans font-bold gap-3 h-14 px-8 rounded-xl transition-all duration-300 ${
                isInCart 
                  ? 'bg-forest-100 text-forest-800 border border-forest-200 hover:bg-forest-50' 
                  : 'bg-forest-900 text-gold-400 hover:bg-forest-800 shadow-md hover:shadow-lg'
              }`}
              variant="ghost"
            >
              {isInCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Déjà dans le panier
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Demande d'échantillon
                </>
              )}
            </Button>
          </motion.div>

          {/* Summary Card */}
          <motion.div variants={itemVariants}>
            <ProductSummaryCard
              description={product.description}
              benefices={product.benefices}
              certifications={product.certifications}
              profilOlfactif={(product as any).profil_olfactif}
              typologie={product.typologie_de_produit}
              origine={product.origine}
              gamme={product.gamme}
            />
          </motion.div>

          {/* Separator */}
          <motion.div variants={separatorVariants} className="origin-left">
            <Separator className="bg-forest-200/50" />
          </motion.div>

          {/* Technical Specs Grid */}
          <motion.div variants={itemVariants}>
            <ProductSpecsGrid product={product} />
          </motion.div>

          {/* Separator */}
          <motion.div variants={separatorVariants} className="origin-left">
            <Separator className="bg-forest-200/50" />
          </motion.div>

          {/* Performance & Stability Section (Parfums only, if data exists) */}
          {showPerfStabSection && (
            <motion.div variants={itemVariants}>
              <PerformanceStabilitySection
                performanceData={performanceSectionData}
                stabilityData={stabilityData}
              />
            </motion.div>
          )}

          {/* Separator */}
          {showPerfStabSection && (
            <motion.div variants={separatorVariants} className="origin-left">
              <Separator className="bg-forest-200/50" />
            </motion.div>
          )}

          {/* Details Accordion */}
          <motion.div variants={itemVariants}>
            <ProductDetailsAccordion
              application={product.application}
              typeDePeau={(product as any).type_de_peau}
              performanceData={[]}
              stabilityData={[]}
              typologie={product.typologie_de_produit}
              additionalFields={additionalFields}
            />
          </motion.div>
        </motion.main>

        {/* Similar Products - Full width section */}
        <SimilarProducts products={similarProducts} lang={currentLang} />

        {/* Mobile Sticky CTA */}
        <ProductStickyCTA
          onAddToCart={handleAddToCart}
          productName={productName}
          isInCart={isInCart}
        />
      </div>
    </Layout>
  );
}
