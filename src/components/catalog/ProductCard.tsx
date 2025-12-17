import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
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

  const categoryStyles = {
    cosmetic: { 
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', 
      bg: 'from-emerald-100/50 to-emerald-50/30',
      label: t.categories.cosmetic 
    },
    perfume: { 
      badge: 'bg-violet-50 text-violet-700 border-violet-200/60', 
      bg: 'from-violet-100/50 to-violet-50/30',
      label: t.categories.perfume 
    },
    aroma: { 
      badge: 'bg-amber-50 text-amber-700 border-amber-200/60', 
      bg: 'from-amber-100/50 to-amber-50/30',
      label: t.categories.aroma 
    },
  };

  const style = categoryStyles[product.category];

  return (
    <Link
      to={`/${lang}/produit/${product.id}`}
      className="group card-elegant overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Area */}
      <div className={cn(
        "aspect-[4/3] relative overflow-hidden bg-gradient-to-br",
        style.bg
      )}>
        {/* Placeholder icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-500 shadow-sm">
            <span className="font-serif text-3xl text-primary/70">{product.name.charAt(0)}</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500">
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center
                        opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                        transition-all duration-300">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Category badge */}
        <Badge className={cn('absolute top-4 left-4 border text-xs font-medium', style.badge)}>
          {style.label}
        </Badge>

        {/* Food Grade badge */}
        {product.foodGrade && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-medium shadow-sm">
            Food Grade
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1">
            {product.name}
          </h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
            {product.code}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{product.familleOlfactive}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{product.origine}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
