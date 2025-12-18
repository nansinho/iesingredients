import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Beaker, Award, Droplets, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';

// Import product images for visual variety
import creamJar from '@/assets/cream-jar.jpg';
import productBottle from '@/assets/product-bottle.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import creamBowl from '@/assets/cream-bowl.jpg';

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

const productImages = [creamJar, productBottle, essentialOil, serumCollection, pumpBottle, creamBowl];

const getGammeConfig = (gamme: string | null) => {
  const gammeNormalized = gamme?.toUpperCase() || '';
  
  if (gammeNormalized.includes('ACTIF')) {
    return {
      bgClass: 'bg-cosmetique',
      textClass: 'text-cosmetique',
      lightBgClass: 'bg-cosmetique-light',
    };
  }
  if (gammeNormalized.includes('NATUREL') || gammeNormalized.includes('VÉGÉTAL')) {
    return {
      bgClass: 'bg-forest-600',
      textClass: 'text-forest-700',
      lightBgClass: 'bg-forest-100',
    };
  }
  if (gammeNormalized.includes('PARFUM') || gammeNormalized.includes('FRAGRANCE')) {
    return {
      bgClass: 'bg-parfum',
      textClass: 'text-parfum',
      lightBgClass: 'bg-parfum-light',
    };
  }
  // Default
  return {
    bgClass: 'bg-primary',
    textClass: 'text-primary',
    lightBgClass: 'bg-primary/10',
  };
};

const getSolubilityBadge = (solubilite: string | null) => {
  if (!solubilite) return null;
  const sol = solubilite.toUpperCase();
  if (sol.includes('HYDRO')) return { label: 'Hydrosoluble', icon: '💧' };
  if (sol.includes('LIPO')) return { label: 'Liposoluble', icon: '🫒' };
  return { label: solubilite, icon: '⚗️' };
};

export const ProductCard = ({ product, lang, index = 0 }: ProductCardProps) => {
  const t = useTranslation(lang);
  const config = getGammeConfig(product.gamme);
  const productImage = productImages[index % productImages.length];
  const solubility = getSolubilityBadge(product.solubilite);

  // Parse benefits into array
  const benefitsArray = product.benefices
    ? product.benefices.split(/[\/,]/).map(b => b.trim()).filter(Boolean).slice(0, 3)
    : [];

  // Parse certifications
  const certifications = product.certifications
    ? product.certifications.split(/[\-\/,]/).map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <Link
      to={`/${lang}/produit/${product.code}`}
      className="group block"
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={cn(
          "relative bg-card rounded-3xl overflow-hidden",
          "border border-border/50",
          "transition-all duration-500",
          "hover:shadow-2xl hover:-translate-y-2 hover:border-border"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img 
            src={productImage} 
            alt={product.nom_commercial || 'Produit'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Gamme Badge - Top Left */}
          {product.gamme && (
            <div className="absolute top-4 left-4">
              <Badge className={cn(
                "text-white text-xs font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg",
                config.bgClass
              )}>
                {product.gamme}
              </Badge>
            </div>
          )}

          {/* Aspect Badge - Top Right */}
          {product.aspect && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/95 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg backdrop-blur-sm">
                {product.aspect}
              </Badge>
            </div>
          )}

          {/* Hover Action Button */}
          <div className="absolute bottom-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-foreground" />
            </div>
          </div>

          {/* Quick Description on Hover */}
          {product.description && (
            <div className="absolute bottom-4 left-4 right-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75">
              <p className="text-white text-sm font-medium line-clamp-2">
                {product.description.substring(0, 100)}...
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2 mb-2">
              {product.nom_commercial || 'Produit sans nom'}
            </h3>
            <p className="text-sm text-muted-foreground font-mono tracking-wide">
              Code: {product.code}
            </p>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Origin */}
            {product.origine && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span className="text-muted-foreground truncate">{product.origine}</span>
              </div>
            )}
            
            {/* Solubility */}
            {solubility && (
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="w-4 h-4 text-accent shrink-0" />
                <span className="text-muted-foreground truncate">{solubility.label}</span>
              </div>
            )}
          </div>

          {/* Benefits */}
          {benefitsArray.length > 0 && (
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground line-clamp-1">
                {benefitsArray.join(' • ')}
              </p>
            </div>
          )}

          {/* INCI */}
          {product.inci && (
            <div className="flex items-start gap-2">
              <Beaker className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
                {product.inci}
              </p>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Award className="w-4 h-4 text-primary shrink-0" />
              {certifications.slice(0, 3).map((cert, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md border-border/60 bg-secondary/50 text-muted-foreground"
                >
                  {cert}
                </Badge>
              ))}
              {certifications.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{certifications.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bottom Tags */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            {product.typologie_de_produit && (
              <Badge className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-lg",
                config.lightBgClass,
                config.textClass
              )}>
                {product.typologie_de_produit}
              </Badge>
            )}
            {product.application && (
              <Badge variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border-border/60 text-muted-foreground truncate max-w-[150px]">
                {product.application.split('/')[0].trim()}
              </Badge>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
