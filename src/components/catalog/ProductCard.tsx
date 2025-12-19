import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Droplets, Award } from 'lucide-react';
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
    };
  }
  if (t.includes('PARFUM') || t.includes('FRAGRANCE')) {
    return { 
      bar: 'bg-parfum', 
      badge: 'bg-parfum text-white',
      accent: 'text-parfum',
    };
  }
  if (t.includes('AROME') || t.includes('ARÔME') || t.includes('FOOD')) {
    return { 
      bar: 'bg-arome', 
      badge: 'bg-arome text-white',
      accent: 'text-arome',
    };
  }
  return { 
    bar: 'bg-primary', 
    badge: 'bg-primary text-primary-foreground',
    accent: 'text-primary',
  };
};

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

export const ProductCard = ({ product, lang }: ProductCardProps) => {
  const config = getCategoryConfig(product.typologie_de_produit);
  
  // Get initials for avatar
  const initials = product.nom_commercial 
    ? product.nom_commercial.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'P';

  return (
    <Link 
      to={`/${lang}/produit/${product.code}`} 
      className="group block"
    >
      <article className="relative h-full bg-card rounded-xl border border-border/50 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-border">
        {/* Header with color bar and avatar */}
        <div className="relative">
          {/* Color bar */}
          <div className={cn("h-1.5", config.bar)} />
          
          {/* Content header */}
          <div className="p-3 sm:p-4 pb-2 sm:pb-3 flex items-start gap-3">
            {/* Avatar */}
            <div className={cn(
              "w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center font-serif text-sm font-bold shrink-0",
              "bg-secondary/80", config.accent
            )}>
              {initials}
            </div>
            
            {/* Title & Code */}
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {product.nom_commercial || 'Produit sans nom'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("font-mono text-xs sm:text-sm font-semibold", config.accent)}>
                  {product.code}
                </span>
                {product.gamme && (
                  <Badge className={cn("text-[8px] sm:text-[9px] font-semibold px-1.5 py-0 h-4 border-0", config.badge)}>
                    {product.gamme}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
          {/* INCI */}
          {product.inci && (
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground bg-secondary/40 px-2 py-1.5 rounded line-clamp-2 break-all">
              {product.inci}
            </p>
          )}

          {/* Quick info row */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-muted-foreground">
            {product.origine && (
              <div className="flex items-center gap-1 bg-secondary/30 px-1.5 py-0.5 rounded">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate max-w-[80px]">{product.origine}</span>
              </div>
            )}
            {product.solubilite && (
              <div className="flex items-center gap-1 bg-secondary/30 px-1.5 py-0.5 rounded">
                <Droplets className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{product.solubilite}</span>
              </div>
            )}
            {product.certifications && (
              <div className="flex items-center gap-1 bg-secondary/30 px-1.5 py-0.5 rounded">
                <Award className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate max-w-[60px]">{product.certifications.split(/[-\/,]/)[0]?.trim()}</span>
              </div>
            )}
          </div>

          {/* Benefits */}
          {product.benefices && (
            <p className="text-[10px] sm:text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {product.benefices}
            </p>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center", config.bar)}>
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
          </div>
        </div>
      </article>
    </Link>
  );
};
