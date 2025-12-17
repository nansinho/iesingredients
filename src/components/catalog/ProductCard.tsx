import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Beaker, Award, Droplets } from 'lucide-react';
import { Product } from '@/data/mockProducts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

// Import product images
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

const categoryConfig = {
  cosmetic: {
    label: { fr: 'Cosmétique', en: 'Cosmetic' },
    bgClass: 'bg-cosmetique',
    textClass: 'text-cosmetique',
    lightBgClass: 'bg-cosmetique-light',
  },
  perfume: {
    label: { fr: 'Parfum', en: 'Perfume' },
    bgClass: 'bg-parfum',
    textClass: 'text-parfum',
    lightBgClass: 'bg-parfum-light',
  },
  aroma: {
    label: { fr: 'Arôme', en: 'Flavor' },
    bgClass: 'bg-arome',
    textClass: 'text-arome',
    lightBgClass: 'bg-arome-light',
  },
};

export const ProductCard = ({ product, lang, index = 0 }: ProductCardProps) => {
  const t = useTranslation(lang);
  const config = categoryConfig[product.category];
  const productImage = productImages[index % productImages.length];

  return (
    <Link
      to={`/${lang}/produit/${product.id}`}
      className="group block"
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
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
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Category Badge - Top Left */}
          <div className="absolute top-4 left-4">
            <Badge className={cn(
              "text-white text-xs font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg",
              config.bgClass
            )}>
              {config.label[lang]}
            </Badge>
          </div>

          {/* Food Grade Badge - Top Right */}
          {product.foodGrade && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/95 text-forest-700 text-xs font-semibold px-3 py-1.5 rounded-full border-0 shadow-lg backdrop-blur-sm">
                Food Grade
              </Badge>
            </div>
          )}

          {/* Hover Action Button */}
          <div className="absolute bottom-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-foreground" />
            </div>
          </div>

          {/* Quick Info on Hover */}
          <div className="absolute bottom-4 left-4 right-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75">
            <p className="text-white text-sm font-medium line-clamp-2">
              {product.description.substring(0, 80)}...
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono tracking-wide">
              {product.code}
            </p>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Origin */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="text-muted-foreground truncate">{product.origine}</span>
            </div>
            
            {/* Olfactory Family */}
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-accent shrink-0" />
              <span className="text-muted-foreground truncate">{product.familleOlfactive}</span>
            </div>
          </div>

          {/* INCI */}
          <div className="flex items-start gap-2">
            <Beaker className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
              {product.inci}
            </p>
          </div>

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Award className="w-4 h-4 text-primary shrink-0" />
              {product.certifications.slice(0, 3).map((cert, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md border-border/60 bg-secondary/50 text-muted-foreground"
                >
                  {cert}
                </Badge>
              ))}
              {product.certifications.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{product.certifications.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bottom Tags */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Badge className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-lg",
              config.lightBgClass,
              config.textClass
            )}>
              {product.gamme}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium px-2.5 py-1 rounded-lg border-border/60 text-muted-foreground">
              {product.solubility}
            </Badge>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
