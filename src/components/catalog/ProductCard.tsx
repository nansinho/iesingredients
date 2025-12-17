import { Link } from 'react-router-dom';
import { ArrowUpRight, Leaf } from 'lucide-react';
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

  const categoryLabels: Record<string, string> = {
    cosmetic: t.categories.cosmetic,
    perfume: t.categories.perfume,
    aroma: t.categories.aroma,
  };

  return (
    <Link
      to={`/${lang}/produit/${product.id}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden border border-border/50",
        "transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-foreground text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm border-0">
            {categoryLabels[product.category] || product.category}
          </Badge>
        </div>

        {/* Food Grade Badge */}
        {product.foodGrade && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-md border-0">
              Food Grade
            </Badge>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center 
                      opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-foreground text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Code: {product.code}
        </p>

        {product.familleOlfactive && (
          <Badge variant="outline" className="text-xs font-normal rounded-md border-border text-muted-foreground">
            {product.familleOlfactive}
          </Badge>
        )}
      </div>
    </Link>
  );
};
