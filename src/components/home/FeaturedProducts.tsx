import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Product } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';

interface FeaturedProductsProps {
  lang: Language;
  products: Product[];
}

export const FeaturedProducts = ({ lang, products }: FeaturedProductsProps) => {
  const t = useTranslation(lang);

  // Get 3 products from each category
  const cosmeticProducts = products.filter((p) => p.category === 'cosmetic').slice(0, 3);
  const perfumeProducts = products.filter((p) => p.category === 'perfume').slice(0, 3);
  const aromaProducts = products.filter((p) => p.category === 'aroma').slice(0, 3);

  const featuredProducts = [...cosmeticProducts, ...perfumeProducts, ...aromaProducts];

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
          {featuredProducts.slice(0, 8).map((product, index) => (
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
