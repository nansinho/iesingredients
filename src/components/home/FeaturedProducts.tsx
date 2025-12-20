import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedProductsProps {
  lang: Language;
}

export const FeaturedProducts = ({ lang }: FeaturedProductsProps) => {
  const t = useTranslation(lang);
  const { data: products, isLoading } = useProducts(undefined, lang);

  // Get up to 8 featured products
  const featuredProducts = (products || []).slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border/50">
                <Skeleton className="h-2" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              {lang === 'fr' ? 'Notre sélection' : 'Our selection'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2">
              {t.catalog.results}
            </h2>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <Link to={`/${lang}/catalogue`}>
              {lang === 'fr' ? 'Voir tout le catalogue' : 'View full catalog'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid - optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
