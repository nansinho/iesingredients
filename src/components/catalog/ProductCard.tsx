import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Droplets, Leaf, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

const getGammeConfig = (gamme: string | null) => {
  const g = gamme?.toUpperCase() || '';
  
  if (g.includes('ACTIF')) {
    return { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/10' };
  }
  if (g.includes('NATUREL') || g.includes('VÉGÉTAL')) {
    return { bg: 'bg-forest-600', text: 'text-forest-700', light: 'bg-forest-100' };
  }
  if (g.includes('PARFUM') || g.includes('FRAGRANCE')) {
    return { bg: 'bg-gold-600', text: 'text-gold-700', light: 'bg-gold-100' };
  }
  return { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/10' };
};

export const ProductCard = ({ product, lang, index = 0 }: ProductCardProps) => {
  const config = getGammeConfig(product.gamme);
  
  // Get initials for avatar
  const initials = product.nom_commercial 
    ? product.nom_commercial.split(' ').slice(0, 2).map(w => w[0]).join('')
    : 'P';

  return (
    <Link to={`/${lang}/produit/${product.code}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative h-full bg-card rounded-2xl border border-border/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
      >
        {/* Header with color accent */}
        <div className={cn("h-2", config.bg)} />
        
        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Top row: Avatar + Badges */}
          <div className="flex items-start justify-between gap-3">
            {/* Product Avatar */}
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-serif text-lg font-bold",
              config.light, config.text
            )}>
              {initials}
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 justify-end">
              {product.gamme && (
                <Badge className={cn("text-[10px] font-semibold px-2 py-0.5 text-white border-0", config.bg)}>
                  {product.gamme}
                </Badge>
              )}
              {product.aspect && (
                <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 bg-secondary/50">
                  {product.aspect}
                </Badge>
              )}
            </div>
          </div>

          {/* Title & Code */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {product.nom_commercial || 'Produit sans nom'}
            </h3>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {product.code}
            </p>
          </div>

          {/* INCI */}
          {product.inci && (
            <p className="text-xs text-muted-foreground line-clamp-1 font-mono bg-secondary/30 px-2 py-1 rounded">
              {product.inci}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {product.origine && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">{product.origine}</span>
              </div>
            )}
            {product.solubilite && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Droplets className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">{product.solubilite}</span>
              </div>
            )}
            {product.typologie_de_produit && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Leaf className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="truncate">{product.typologie_de_produit}</span>
              </div>
            )}
            {product.certifications && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span className="truncate">{product.certifications.split(/[-\/,]/)[0]?.trim()}</span>
              </div>
            )}
          </div>

          {/* Benefits */}
          {product.benefices && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.benefices}
            </p>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
