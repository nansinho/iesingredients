import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets, Sparkles, Leaf, Droplet, MapPin, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { Product } from '@/hooks/useProducts';
import { toast } from 'sonner';

// Import category images
import creamBowl from '@/assets/cream-bowl.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import productBottle from '@/assets/product-bottle.jpg';

// Category styling configuration - Aligned with catalog category cards
const getCategoryConfig = (typologie: string | null) => {
  const t = typologie?.toUpperCase() || '';
  
  // Cosmétique: Forest green tones (matching the green category card)
  if (t.includes('COSMET') || t.includes('COSMÉT')) {
    return { 
      bg: 'bg-[#F5F8F6]',           // Vert très subtil
      border: 'border-[#4A7C59]/20',
      accent: 'text-[#2D5A3D]',      // Vert forêt profond
      badge: 'bg-[#4A7C59] text-white',
      badgeLight: 'bg-[#4A7C59]/12 text-[#2D5A3D] border-[#4A7C59]/25',
      hover: 'group-hover:border-[#4A7C59]/40 group-hover:shadow-[#4A7C59]/15',
      icon: Droplets,
      image: creamBowl,
      label: 'COSMÉTIQUE',
      separator: 'bg-[#4A7C59]',
    };
  }
  // Parfumerie: Amber/brown tones (matching the amber category card)
  if (t.includes('PARFUM') || t.includes('FRAGRANCE')) {
    return { 
      bg: 'bg-[#FBF8F5]',           // Ambre très subtil
      border: 'border-[#A67B5B]/20',
      accent: 'text-[#6B4C3A]',      // Ambre profond
      badge: 'bg-[#A67B5B] text-white',
      badgeLight: 'bg-[#A67B5B]/12 text-[#6B4C3A] border-[#A67B5B]/25',
      hover: 'group-hover:border-[#A67B5B]/40 group-hover:shadow-[#A67B5B]/15',
      icon: Sparkles,
      image: essentialOil,
      label: 'PARFUMERIE',
      separator: 'bg-[#A67B5B]',
    };
  }
  // Arômes: Pink/magenta tones (matching the pink category card)
  if (t.includes('AROME') || t.includes('ARÔME') || t.includes('FOOD')) {
    return { 
      bg: 'bg-[#FDF5F7]',           // Rose très subtil
      border: 'border-[#C97B8B]/20',
      accent: 'text-[#8B4A5E]',      // Rose profond
      badge: 'bg-[#C97B8B] text-white',
      badgeLight: 'bg-[#C97B8B]/12 text-[#8B4A5E] border-[#C97B8B]/25',
      hover: 'group-hover:border-[#C97B8B]/40 group-hover:shadow-[#C97B8B]/15',
      icon: Leaf,
      image: productBottle,
      label: 'ARÔMES',
      separator: 'bg-[#C97B8B]',
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
  const [copied, setCopied] = React.useState(false);
  const config = getCategoryConfig(product.typologie_de_produit);
  const IconComponent = config.icon;

  // Get benefits array
  const benefitsArray = product.benefices 
    ? product.benefices.split(/[\/,]/).map(b => b.trim()).filter(Boolean).slice(0, 2)
    : [];

  // Use code if available, otherwise use id with prefix
  const productIdentifier = product.code || `id-${product.id}`;

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(product.code || '');
      setCopied(true);
      toast.success(lang === 'fr' ? 'Code copié !' : 'Code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(lang === 'fr' ? 'Échec de la copie' : 'Copy failed');
    }
  };

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
          {/* Product Code - Centered with Copy */}
          <div className="text-center mb-3">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
              {lang === 'fr' ? 'RÉFÉRENCE' : 'REFERENCE'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className={cn("font-mono text-xl font-black tracking-tight", config.accent)}>
                {product.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-md hover:bg-black/5 transition-colors active:scale-95"
                title={lang === 'fr' ? 'Copier le code' : 'Copy code'}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className={cn("w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity", config.accent)} />
                )}
              </button>
            </div>
          </div>
          
          {/* Separator line - centered */}
          <div className="flex justify-center mb-3">
            <div className={cn("h-0.5 w-12 rounded-full", config.separator)} />
          </div>

          {/* Title - centered */}
          <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-2 line-clamp-2 min-h-[2.5rem] text-center group-hover:text-primary transition-colors duration-300">
            {product.nom_commercial || 'Produit sans nom'}
          </h3>

          {/* Benefits Tags - centered */}
          {benefitsArray.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3">
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
