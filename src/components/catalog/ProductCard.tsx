import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/data/mockProducts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';

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

export const ProductCard = ({ product, lang, index = 0 }: ProductCardProps) => {
  const t = useTranslation(lang);

  const categoryLabels: Record<string, string> = {
    cosmetic: t.categories.cosmetic,
    perfume: t.categories.perfume,
    aroma: t.categories.aroma,
  };

  // Cycle through product images based on index
  const productImage = productImages[index % productImages.length];

  return (
    <Link
      to={`/${lang}/produit/${product.id}`}
      className={cn(
        "group block bg-white rounded-xl overflow-hidden",
        "transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 text-foreground text-[10px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm border-0 shadow-sm">
            {categoryLabels[product.category] || product.category}
          </Badge>
        </div>

        {/* Food Grade Badge */}
        {product.foodGrade && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white text-[10px] font-medium px-2.5 py-1 rounded-md border-0">
              Food Grade
            </Badge>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center 
                      opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-foreground text-sm leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        <p className="text-[10px] text-muted-foreground mb-2 font-mono">
          {product.code}
        </p>

        {product.familleOlfactive && (
          <Badge variant="outline" className="text-[10px] font-normal rounded border-border/60 text-muted-foreground bg-cream-200/50 px-2 py-0.5">
            {product.familleOlfactive}
          </Badge>
        )}
      </div>
    </Link>
  );
};
