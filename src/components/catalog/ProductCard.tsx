import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { Product } from '@/data/mockProducts';
import { Button } from '@/components/ui/button';
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

  const categoryColors = {
    cosmetic: 'bg-pink-100 text-pink-700 border-pink-200',
    perfume: 'bg-purple-100 text-purple-700 border-purple-200',
    aroma: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <article
      className={cn(
        'group relative bg-card rounded-2xl overflow-hidden shadow-soft hover-lift animate-fade-in-up',
        'border border-border/50'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-nature">
        {/* Placeholder gradient background simulating product image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Leaf className="w-12 h-12 text-primary/40" />
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="outline"
            className={cn('text-xs font-medium', categoryColors[product.category])}
          >
            {t.categories[product.category]}
          </Badge>
        </div>

        {/* Food Grade Badge */}
        {product.foodGrade && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-accent text-accent-foreground text-xs">
              Food Grade
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Code */}
        <span className="text-xs font-medium text-muted-foreground tracking-wide">
          {product.code}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Olfactory Family */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">
            {product.familleOlfactive}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="text-sm text-muted-foreground">
            {product.origine}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <Link
            to={`/${lang}/produit/${product.id}`}
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group/link"
          >
            {lang === 'fr' ? 'Voir détails' : 'View details'}
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
          
          <Button size="sm" variant="subtle" className="text-xs">
            {t.catalog.requestSample}
          </Button>
        </div>
      </div>
    </article>
  );
};
