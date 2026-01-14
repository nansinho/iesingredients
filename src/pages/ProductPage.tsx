import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { useSampleCart } from '@/contexts/SampleCartContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Product components
import { ProductHero } from '@/components/product/ProductHero';
import { ProductStickyCTA } from '@/components/product/ProductStickyCTA';
import { ProductSummaryCard } from '@/components/product/ProductSummaryCard';
import { ProductSpecsGrid } from '@/components/product/ProductSpecsGrid';
import { ProductDetailsAccordion } from '@/components/product/ProductDetailsAccordion';
import { SimilarProducts } from '@/components/product/SimilarProducts';

// Helper to parse rating strings like "5/5", "★★★★", etc.
function parseRating(value: string | null | undefined): number {
  if (!value) return 0;
  const str = value.toString().trim();
  
  // Handle "X/Y" format
  const slashMatch = str.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (slashMatch) {
    return parseInt(slashMatch[1], 10);
  }
  
  // Handle star characters
  const starCount = (str.match(/★/g) || []).length;
  if (starCount > 0) return starCount;
  
  // Handle plain number
  const num = parseInt(str, 10);
  if (!isNaN(num) && num >= 0 && num <= 5) return num;
  
  return 0;
}

// Loading skeleton
function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="bg-forest-900 animate-pulse">
        <Skeleton className="w-full h-56 sm:h-64 bg-forest-800" />
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-40 w-full rounded-xl bg-forest-100" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl bg-forest-100" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-xl bg-forest-100" />
        <Skeleton className="h-16 w-full rounded-xl bg-forest-100" />
      </div>
    </div>
  );
}

// Error state
function ProductPageError() {
  return (
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
          <a href="/fr/catalogue">Retour au catalogue</a>
        </Button>
      </motion.div>
    </div>
  );
}

export default function ProductPage() {
  const { code, lang = 'fr' } = useParams<{ code: string; lang: string }>();
  const { data: product, isLoading, error } = useProduct(code || '');
  const { data: similarProducts = [] } = useSimilarProducts(product);
  const { addItem, items } = useSampleCart();

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
    return <ProductPageSkeleton />;
  }

  // Error state
  if (error || !product) {
    return <ProductPageError />;
  }

  // Build performance data (for parfums)
  const performanceData: { option: string; rating: number }[] = [];
  const perfOptions = [
    { key: 'option_1', perf: 'performance_1' },
    { key: 'option_2', perf: 'performance_2' },
    { key: 'option_3', perf: 'performance_3' },
    { key: 'option_4', perf: 'performance_4' },
    { key: 'option_5', perf: 'performance_5' },
    { key: 'option_6', perf: 'performance_6' },
  ];
  
  for (const { key, perf } of perfOptions) {
    const optionValue = (product as any)[key];
    const perfValue = (product as any)[perf];
    if (optionValue && optionValue !== '-') {
      performanceData.push({
        option: optionValue,
        rating: parseRating(perfValue),
      });
    }
  }

  // Build stability data (for parfums)
  const stabilityData: { base: string; odeur: number; ph: string }[] = [];
  const stabBases = [
    { base: 'Shampooing', odeur: 'odeur_shampooing', ph: 'ph_shampooing' },
    { base: 'Savon', odeur: 'odeur_savon', ph: 'ph_savon' },
    { base: 'Détergent liquide', odeur: 'odeur_detergent_liquide', ph: 'ph_detergent_liquide' },
    { base: 'Détergent poudre', odeur: 'odeur_detergent_poudre', ph: 'ph_detergent_poudre' },
    { base: 'Eau de Javel', odeur: 'odeur_eau_javel', ph: 'ph_eau_javel' },
    { base: 'Antisudorifique', odeur: 'odeur_antisudorifique', ph: 'ph_antisudorifique' },
    { base: 'APC', odeur: 'odeur_apc', ph: 'ph_apc' },
    { base: 'Assouplissant textile', odeur: 'odeur_assouplissant_textile', ph: 'ph_assouplissant_textile' },
    { base: 'Nettoyant acide', odeur: 'odeur_nettoyant_acide', ph: 'ph_nettoyant_acide' },
  ];

  for (const { base, odeur, ph } of stabBases) {
    const odeurValue = (product as any)[odeur];
    const phValue = (product as any)[ph];
    if (odeurValue && odeurValue !== '-') {
      stabilityData.push({
        base,
        odeur: parseRating(odeurValue),
        ph: phValue || '-',
      });
    }
  }

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

  return (
    <>
      <Helmet>
        <title>{productName} - IES Ingredients</title>
        <meta 
          name="description" 
          content={product.description || `Découvrez ${productName}, un ingrédient de haute qualité par IES Ingredients.`} 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white pb-28 md:pb-12">
        {/* Hero */}
        <ProductHero
          code={product.code}
          name={product.nom_commercial}
          typologie={product.typologie_de_produit}
          origine={product.origine}
          gamme={product.gamme}
          lang={lang}
        />

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl mx-auto space-y-8 sm:space-y-10">
          {/* Desktop CTA */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handleAddToCart}
              size="lg"
              className={`w-full sm:w-auto font-sans font-bold gap-3 h-14 px-8 rounded-xl shadow-lg transition-all duration-300 ${
                isInCart 
                  ? 'bg-forest-100 text-forest-800 border-2 border-forest-300 hover:bg-forest-200' 
                  : 'bg-forest-900 text-gold-400 hover:bg-forest-800 shadow-forest-900/20'
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
          <ProductSummaryCard
            description={product.description}
            benefices={product.benefices}
            certifications={product.certifications}
            profilOlfactif={(product as any).profil_olfactif}
            typologie={product.typologie_de_produit}
          />

          {/* Technical Specs Grid */}
          <ProductSpecsGrid product={product} />

          {/* Details Accordion */}
          <ProductDetailsAccordion
            application={product.application}
            typeDePeau={(product as any).type_de_peau}
            performanceData={performanceData}
            stabilityData={stabilityData}
            typologie={product.typologie_de_produit}
            additionalFields={additionalFields}
          />

          {/* Similar Products */}
          <SimilarProducts products={similarProducts} lang={lang} />
        </main>

        {/* Mobile Sticky CTA */}
        <ProductStickyCTA
          onAddToCart={handleAddToCart}
          productName={productName}
          isInCart={isInCart}
        />
      </div>
    </>
  );
}
