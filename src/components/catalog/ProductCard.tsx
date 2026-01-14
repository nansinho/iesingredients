import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets, Sparkles, Leaf, Droplet, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { Product } from '@/hooks/useProducts';

// Import category images
import creamBowl from '@/assets/cream-bowl.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import productBottle from '@/assets/product-bottle.jpg';

// Category styling configuration with photos - Luxe Palette Travaillée
const getCategoryConfig = (typologie: string | null) => {
  const t = typologie?.toUpperCase() || '';
  
  if (t.includes('COSMET') || t.includes('COSMÉT')) {
    return { 
      bg: 'bg-[#FAF5F5]',           // Rose très subtil
      border: 'border-[#D4A5A5]/25',
      accent: 'text-[#8B5E5E]',      // Rose profond pour le texte
      badge: 'bg-[#D4A5A5] text-white',
      badgeLight: 'bg-[#D4A5A5]/15 text-[#8B5E5E] border-[#D4A5A5]/30',
      hover: 'group-hover:border-[#D4A5A5]/50 group-hover:shadow-[#D4A5A5]/10',
      icon: Droplets,
      image: creamBowl,
      label: 'COSMÉTIQUE',
      separator: 'bg-[#D4A5A5]',
    };
  }
  if (t.includes('PARFUM') || t.includes('FRAGRANCE')) {
    return { 
      bg: 'bg-[#F5F3FA]',           // Lavande très subtil
      border: 'border-[#8B7EC8]/25',
      accent: 'text-[#5B4F8C]',      // Violet profond pour le texte
      badge: 'bg-[#8B7EC8] text-white',
      badgeLight: 'bg-[#8B7EC8]/15 text-[#5B4F8C] border-[#8B7EC8]/30',
      hover: 'group-hover:border-[#8B7EC8]/50 group-hover:shadow-[#8B7EC8]/10',
      icon: Sparkles,
      image: essentialOil,
      label: 'PARFUMERIE',
      separator: 'bg-[#8B7EC8]',
    };
  }
  if (t.includes('AROME') || t.includes('ARÔME') || t.includes('FOOD')) {
    return { 
      bg: 'bg-[#FBF7F2]',           // Crème chaud
      border: 'border-[#D4915C]/25',
      accent: 'text-[#8B5A2B]',      // Ambre profond pour le texte
      badge: 'bg-[#D4915C] text-white',
      badgeLight: 'bg-[#D4915C]/15 text-[#8B5A2B] border-[#D4915C]/30',
      hover: 'group-hover:border-[#D4915C]/50 group-hover:shadow-[#D4915C]/10',
      icon: Leaf,
      image: productBottle,
      label: 'ARÔMES',
      separator: 'bg-[#D4915C]',
    };
  }
  return { 
    bg: 'bg-secondary',
    border: 'border-border',
    accent: 'text-primary',
    badge: 'bg-primary text-primary-foreground',
    badgeLight: 'bg-primary/10 text-primary border-primary/20',
    hover: 'group-hover:border-primary/40',
    icon: Droplet,
    image: creamBowl,
    label: 'PRODUIT',
    separator: 'bg-primary',
  };
};

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

export const ProductCard = React.forwardRef<HTMLAnchorElement, ProductCardProps>(({ product, lang, index = 0 }, ref) => {
  const config = getCategoryConfig(product.typologie_de_produit);
  const IconComponent = config.icon;

  // Get benefits array
  const benefitsArray = product.benefices 
    ? product.benefices.split(/[\/,]/).map(b => b.trim()).filter(Boolean).slice(0, 2)
    : [];

  // Use code if available, otherwise use id with prefix
  const productIdentifier = product.code || `id-${product.id}`;

  return (
    <Link 
      ref={ref}
      to={`/${lang}/produit/${productIdentifier}`} 
      className="group block h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <article className={cn(
        "relative h-full rounded-2xl border overflow-hidden transition-all duration-500",
        "hover:shadow-xl hover:-translate-y-1",
        config.bg,
        config.border,
        config.hover
      )}>
        {/* Image Section */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={(product as any).image_url || config.image}
            alt={product.nom_commercial || 'Product'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full",
              config.badge
            )}>
              <IconComponent className="w-3 h-3" />
              {config.label}
            </span>
          </div>

          {/* Arrow on hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Product Code - Very Prominent */}
          <div className="mb-3">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">
              {lang === 'fr' ? 'RÉFÉRENCE' : 'REFERENCE'}
            </p>
            <p className={cn("font-mono text-lg font-bold tracking-tight", config.accent)}>
              {product.code}
            </p>
          </div>
          
          {/* Separator line */}
          <div className={cn("h-0.5 w-10 rounded-full mb-3", config.separator)} />

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-foreground leading-tight mb-2 line-clamp-2 min-h-[2.75rem] group-hover:text-primary transition-colors duration-300">
            {product.nom_commercial || 'Produit sans nom'}
          </h3>

          {/* Benefits Tags */}
          {benefitsArray.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {benefitsArray.map((benefit, i) => (
                <span 
                  key={i} 
                  className={cn(
                    "inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border",
                    config.badgeLight
                  )}
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}

          {/* Bottom info */}
          <div className="mt-auto pt-3 border-t border-current/10 flex items-center justify-between text-[11px] text-muted-foreground">
            {product.origine && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {product.origine}
              </span>
            )}
            {product.solubilite && (
              <span className={cn("font-medium", config.accent)}>
                {product.solubilite.length > 12 
                  ? product.solubilite.substring(0, 12) + '...' 
                  : product.solubilite}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';
