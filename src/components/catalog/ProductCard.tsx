
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { Product } from '@/hooks/useProducts';

// Category color config based on typologie_de_produit
const getCategoryConfig = (typologie: string | null) => {
  const t = typologie?.toUpperCase() || '';
  
  if (t.includes('COSMET') || t.includes('COSMÉT')) {
    return { 
      bar: 'bg-cosmetique', 
      badge: 'bg-cosmetique text-white',
      accent: 'text-cosmetique',
      bg: 'bg-cosmetique/5',
    };
  }
  if (t.includes('PARFUM') || t.includes('FRAGRANCE')) {
    return { 
      bar: 'bg-parfum', 
      badge: 'bg-parfum text-white',
      accent: 'text-parfum',
      bg: 'bg-parfum/5',
    };
  }
  if (t.includes('AROME') || t.includes('ARÔME') || t.includes('FOOD')) {
    return { 
      bar: 'bg-arome', 
      badge: 'bg-arome text-white',
      accent: 'text-arome',
      bg: 'bg-arome/5',
    };
  }
  return { 
    bar: 'bg-primary', 
    badge: 'bg-primary text-primary-foreground',
    accent: 'text-primary',
    bg: 'bg-primary/5',
  };
};

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

export const ProductCard = React.forwardRef<HTMLAnchorElement, ProductCardProps>(({ product, lang }, ref) => {
  const config = getCategoryConfig(product.typologie_de_produit);

  // Get initials for avatar
  const initials = product.nom_commercial 
    ? product.nom_commercial.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'P';

  // Get first benefit only for mobile
  const firstBenefit = product.benefices?.split(/[\/,]/)[0]?.trim();

  return (
    <Link 
      ref={ref}
      to={`/${lang}/produit/${product.code}`} 
      className="group block h-full"
    >
      <article className="relative h-full bg-card rounded-xl sm:rounded-2xl border border-border/50 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-border flex flex-col">
        {/* Color bar */}
        <div className={cn("h-1 sm:h-1.5", config.bar)} />
        
        {/* Content */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col">
          {/* Header: Avatar + Title */}
          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
            {/* Avatar - smaller on mobile */}
            <div className={cn(
              "w-8 h-8 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center font-serif text-xs sm:text-sm font-bold shrink-0",
              config.bg, config.accent
            )}>
              {initials}
            </div>
            
            {/* Title & Code */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xs sm:text-base font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {product.nom_commercial || 'Produit sans nom'}
              </h3>
              <span className={cn("font-mono text-[10px] sm:text-xs font-semibold", config.accent)}>
                {product.code}
              </span>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {product.gamme && (
              <Badge className={cn("text-[8px] sm:text-[9px] font-semibold px-1.5 py-0 h-4 sm:h-5 border-0", config.badge)}>
                {product.gamme}
              </Badge>
            )}
            {product.solubilite && (
              <Badge variant="secondary" className="text-[8px] sm:text-[9px] px-1.5 py-0 h-4 sm:h-5 gap-0.5">
                <Droplets className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                <span className="hidden sm:inline">{product.solubilite}</span>
                <span className="sm:hidden">{product.solubilite?.charAt(0)}</span>
              </Badge>
            )}
          </div>

          {/* INCI - hidden on very small screens */}
          {product.inci && (
            <p className="hidden xs:block font-mono text-[9px] sm:text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 break-all">
              {product.inci}
            </p>
          )}

          {/* Benefit - single line on mobile */}
          {firstBenefit && (
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed mt-auto">
              {product.benefices}
            </p>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className={cn("w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center", config.bar)}>
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
          </div>
        </div>
      </article>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';
