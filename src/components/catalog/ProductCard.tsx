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
import botanicalsFlat from '@/assets/botanicals-flat.jpg';

interface ProductCardProps {
  product: Product;
  lang: Language;
  index?: number;
}

const productImages = [creamJar, productBottle, essentialOil, botanicalsFlat];

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
        "group block bg-white rounded-2xl overflow-hidden",
        "transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
        <img 
          src={productImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/95 text-foreground text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm border-0 shadow-sm">
            {categoryLabels[product.category] || product.category}
          </Badge>
        </div>

        {/* Food Grade Badge */}
        {product.foodGrade && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg border-0 shadow-md">
              Food Grade
            </Badge>
          </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center 
                      opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <ArrowUpRight className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-foreground text-base leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 font-mono">
          {product.code}
        </p>

        {product.familleOlfactive && (
          <Badge variant="outline" className="text-xs font-normal rounded-md border-border/60 text-muted-foreground bg-cream-200/50">
            {product.familleOlfactive}
          </Badge>
        )}
      </div>
    </Link>
  );
};
