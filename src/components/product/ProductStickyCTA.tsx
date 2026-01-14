import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductStickyCTAProps {
  onAddToCart: () => void;
  productName: string;
  isInCart?: boolean;
}

export function ProductStickyCTA({ onAddToCart, isInCart }: ProductStickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-forest-200 px-4 py-3 safe-area-pb">
      <Button
        onClick={onAddToCart}
        className={`w-full h-12 text-base font-sans font-semibold gap-2 ${
          isInCart 
            ? 'bg-forest-100 text-forest-700 border border-forest-300 hover:bg-forest-200' 
            : 'bg-gold-500 text-forest-900 hover:bg-gold-400'
        }`}
        variant={isInCart ? "outline" : "default"}
      >
        <ShoppingBag className="w-5 h-5" />
        {isInCart ? 'Déjà dans le panier' : "Demande d'échantillon"}
      </Button>
    </div>
  );
}
