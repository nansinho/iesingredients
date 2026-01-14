import { ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ProductStickyCTAProps {
  onAddToCart: () => void;
  productName: string;
  isInCart?: boolean;
}

export function ProductStickyCTA({ onAddToCart, productName, isInCart }: ProductStickyCTAProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-forest-200 px-4 py-3 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Button
        onClick={onAddToCart}
        className={`w-full h-14 text-base font-sans font-bold gap-3 rounded-xl shadow-lg transition-all duration-300 ${
          isInCart 
            ? 'bg-forest-100 text-forest-800 border-2 border-forest-300 hover:bg-forest-200' 
            : 'bg-forest-900 text-gold-400 hover:bg-forest-800 shadow-forest-900/30'
        }`}
        variant="ghost"
      >
        {isInCart ? (
          <>
            <Check className="w-5 h-5" />
            Déjà dans le panier
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Demande d'échantillon
          </>
        )}
      </Button>
    </motion.div>
  );
}
