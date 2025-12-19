import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Droplets, Leaf, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Product } from '@/hooks/useProducts';
import { CopyField } from '@/components/ui/CopyButton';

// Product placeholder images based on gamme
const getProductImage = (gamme: string | null) => {
  const g = gamme?.toUpperCase() || '';
  if (g.includes('ACTIF')) return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=200&fit=crop';
  if (g.includes('NATUREL') || g.includes('VÉGÉTAL')) return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=200&fit=crop';
  if (g.includes('PARFUM') || g.includes('FRAGRANCE')) return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=200&fit=crop';
  return 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=200&fit=crop';
};

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
  const productImage = getProductImage(product.gamme);
  
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
        {/* Product Image Banner */}
        <div className="relative h-28 overflow-hidden">
          <img 
            src={productImage} 
            alt={product.nom_commercial || 'Product'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Badges on image */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
            {product.gamme && (
              <Badge className={cn("text-[10px] font-semibold px-2 py-0.5 text-white border-0 shadow-md", config.bg)}>
                {product.gamme}
              </Badge>
            )}
          </div>
          
          {/* Avatar overlapping */}
          <div className="absolute -bottom-6 left-4">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center font-serif text-lg font-bold border-4 border-card shadow-lg",
              config.light, config.text
            )}>
              {initials}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 pt-8 space-y-3">
          {/* Title & Code */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {product.nom_commercial || 'Produit sans nom'}
            </h3>
            {/* Clickable code */}
            <div className="mt-1">
              <CopyField 
                label="Code" 
                value={product.code || ''} 
                mono 
                className="text-xs text-muted-foreground"
                successMessage={lang === 'fr' ? 'Code copié !' : 'Code copied!'}
              />
            </div>
          </div>

          {/* INCI - Clickable */}
          {product.inci && (
            <CopyField 
              label="INCI" 
              value={product.inci} 
              mono 
              className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded w-full"
              successMessage={lang === 'fr' ? 'INCI copié !' : 'INCI copied!'}
            />
          )}

          {/* Aspect badge */}
          {product.aspect && (
            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 bg-secondary/50">
              {product.aspect}
            </Badge>
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
