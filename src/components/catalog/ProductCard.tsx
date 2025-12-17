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
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      gradient: 'from-emerald-100/60 via-emerald-50/40 to-transparent',
      label: t.categories.cosmetic
    },
    perfume: {
      badge: 'bg-violet-50 text-violet-700 border-violet-200/80',
      gradient: 'from-violet-100/60 via-violet-50/40 to-transparent',
      label: t.categories.perfume
    },
    aroma: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      gradient: 'from-amber-100/60 via-amber-50/40 to-transparent',
      label: t.categories.aroma
    },
  };

  const style = categoryStyles[product.category];

  return (
    <Link
      to={`/${lang}/produit/${product.id}`}
      className="group card-luxe overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image Area */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-secondary via-card to-background">
        {/* Gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60",
          style.gradient
        )} />

        {/* Centered icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center
                        shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-700">
            <span className="font-serif text-4xl text-primary/70 group-hover:text-primary transition-colors">
              {product.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-5 right-5">
          <div className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center
                        opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0
                        transition-all duration-500">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Category badge */}
        <Badge className={cn('absolute top-5 left-5 border text-xs font-medium shadow-sm', style.badge)}>
          {style.label}
        </Badge>

        {/* Food Grade badge */}
        {product.foodGrade && (
          <Badge className="absolute top-5 right-5 bg-gold-500 text-white border-0 text-xs font-medium shadow-md">
            Food Grade
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 flex-1">
            {product.name}
          </h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-lg shrink-0">
            {product.code}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{product.familleOlfactive}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-border" />
          <span>{product.origine}</span>
        </div>
      </div>
    </Link>
  );
};
