import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useProducts, Product } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedProductsProps {
  lang: Language;
}

export const FeaturedProducts = ({ lang }: FeaturedProductsProps) => {
  const t = useTranslation(lang);
  const { data: products, isLoading } = useProducts();

  // Get up to 8 featured products
  const featuredProducts = (products || []).slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              {lang === 'fr' ? 'Notre sélection' : 'Our selection'}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
