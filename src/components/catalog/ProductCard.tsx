import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/data/mockProducts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

export const ProductCard = ({ product, lang, index = 0 }: ProductCardProps) => {
  const t = useTranslation(lang);

  const categoryLabels = {
    cosmetic: { bg: 'bg-pink-50 text-pink-700 border-pink-200', label: t.categories.cosmetic },
    perfume: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: t.categories.perfume },
    aroma: { bg: 'bg-orange-50 text-orange-700 border-orange-200', label: t.categories.aroma },
  };

  return (
    <article
      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all animate-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="aspect-square bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-serif text-muted-foreground/20">
            {product.name.charAt(0)}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className={cn('text-xs', categoryLabels[product.category].bg)}>
            {categoryLabels[product.category].label}
          </Badge>
        </div>
        {product.foodGrade && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground text-xs">Food Grade</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.code}</p>
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>{product.familleOlfactive}</span>
          <span>•</span>
          <span>{product.origine}</span>
        </div>
        <Link
          to={`/${lang}/produit/${product.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {lang === 'fr' ? 'Voir détails' : 'View details'}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
};
