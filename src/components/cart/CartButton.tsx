import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSampleCart } from '@/contexts/SampleCartContext';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CartButtonProps {
  className?: string;
}

export const CartButton = ({ className }: CartButtonProps) => {
  const { openCart, totalItems } = useSampleCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={openCart}
    >
      <ShoppingBag className="w-5 h-5" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <Badge 
              className="h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-primary text-primary-foreground"
            >
              {totalItems}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
