import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { Product } from '@/hooks/useProducts';

// Category styling configuration
const getCategoryConfig = (typologie: string | null) => {
  const t = typologie?.toUpperCase() || '';
  
  if (t.includes('COSMET') || t.includes('COSMÉT')) {
    return { 
      bg: 'bg-cosmetique-light',
      border: 'border-cosmetique/20',
      accent: 'text-cosmetique',
      badge: 'bg-cosmetique/10 text-cosmetique',
      hover: 'group-hover:border-cosmetique/40',
    };
  }
  if (t.includes('PARFUM') || t.includes('FRAGRANCE')) {
    return { 
      bg: 'bg-parfum-light',
      border: 'border-parfum/20',
      accent: 'text-parfum-dark',
      badge: 'bg-parfum/10 text-parfum-dark',
      hover: 'group-hover:border-parfum/40',
    };
  }
  if (t.includes('AROME') || t.includes('ARÔME') || t.includes('FOOD')) {
    return { 
      bg: 'bg-arome-light',
      border: 'border-arome/20',
      accent: 'text-arome',
      badge: 'bg-arome/10 text-arome',
      hover: 'group-hover:border-arome/40',
    };
  }
  return { 
    bg: 'bg-secondary',
    border: 'border-border',
    accent: 'text-primary',
    badge: 'bg-primary/10 text-primary',
    hover: 'group-hover:border-primary/40',
  };
};

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

export const ProductCard = React.forwardRef<HTMLAnchorElement, ProductCardProps>(({ product, lang }, ref) => {
  const config = getCategoryConfig(product.typologie_de_produit);

  // Get first benefit only
  const firstBenefit = product.benefices?.split(/[\/,]/)[0]?.trim();

  // Use code if available, otherwise use id with prefix
  const productIdentifier = product.code || `id-${product.id}`;

  return (
    <Link 
      ref={ref}
      to={`/${lang}/produit/${productIdentifier}`} 
      className="group block h-full"
    >
      <article className={cn(
        "relative h-full bg-card rounded-2xl border overflow-hidden transition-all duration-500",
        "hover:shadow-lg hover:-translate-y-1",
        config.border,
        config.hover
      )}>
        {/* Top decorative pattern area */}
        <div className={cn("h-24 relative overflow-hidden", config.bg)}>
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id={`pattern-${product.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" className={config.accent} />
              </pattern>
              <rect width="100%" height="100%" fill={`url(#pattern-${product.id})`} />
            </svg>
          </div>
          
          {/* Category badge */}
          {product.gamme && (
            <div className="absolute top-4 left-4">
              <span className={cn(
                "px-3 py-1 text-[11px] font-medium uppercase tracking-wider rounded-full",
                config.badge
              )}>
                {product.gamme}
              </span>
            </div>
          )}

          {/* Arrow on hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Code */}
          <span className={cn("font-mono text-xs font-medium mb-2 block", config.accent)}>
            {product.code}
          </span>

          {/* Title */}
          <h3 className="font-serif text-xl font-semibold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.nom_commercial || 'Produit sans nom'}
          </h3>

          {/* INCI */}
          {product.inci && (
            <p className="font-mono text-[11px] text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg line-clamp-1 mb-3">
              {product.inci}
            </p>
          )}

          {/* Benefit */}
          {firstBenefit && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {product.benefices}
            </p>
          )}

          {/* Bottom info */}
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
            {product.origine && (
              <span className="text-xs text-muted-foreground">
                {lang === 'fr' ? 'Origine' : 'Origin'}: {product.origine}
              </span>
            )}
            {product.solubilite && (
              <span className={cn("text-xs font-medium", config.accent)}>
                {product.solubilite}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';