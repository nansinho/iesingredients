import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSampleCart, CartCategory, CartItem } from '@/contexts/SampleCartContext';
import { Language } from '@/lib/i18n';
import { Trash2, Plus, Minus, ShoppingBag, FileText, Sparkles, Droplet, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SampleCartDrawerProps {
  lang: Language;
}

const categoryConfig: Record<CartCategory, { label: { fr: string; en: string }; icon: React.ElementType; color: string }> = {
  COSMETIQUE: { 
    label: { fr: 'Cosmétique', en: 'Cosmetic' }, 
    icon: Sparkles, 
    color: 'bg-primary text-primary-foreground' 
  },
  AROMES: { 
    label: { fr: 'Arômes', en: 'Aromas' }, 
    icon: Droplet, 
    color: 'bg-forest-600 text-white' 
  },
  PARFUM: { 
    label: { fr: 'Parfum', en: 'Perfume' }, 
    icon: Flower2, 
    color: 'bg-gold-600 text-white' 
  },
};

const CartItemRow = ({ item, lang, onRemove, onUpdateQuantity }: {
  item: CartItem;
  lang: Language;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) => {
  const initials = item.product.nom_commercial 
    ? item.product.nom_commercial.split(' ').slice(0, 2).map(w => w[0]).join('')
    : 'P';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 py-3"
    >
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center font-serif text-sm font-bold text-muted-foreground shrink-0">
        {initials}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.product.nom_commercial}</p>
        <p className="text-xs text-muted-foreground font-mono">{item.product.code}</p>
      </div>

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(item.quantity - 1)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

const CategorySection = ({ category, items, lang, onRemove, onUpdateQuantity }: {
  category: CartCategory;
  items: CartItem[];
  lang: Language;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, qty: number) => void;
}) => {
  if (items.length === 0) return null;
  
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={cn("text-xs font-semibold", config.color)}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label[lang]}
        </Badge>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </div>
      <div className="bg-secondary/30 rounded-xl p-3">
        <AnimatePresence>
          {items.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              lang={lang}
              onRemove={() => onRemove(item.product.id)}
              onUpdateQuantity={(qty) => onUpdateQuantity(item.product.id, qty)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const SampleCartDrawer = ({ lang }: SampleCartDrawerProps) => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    getItemsByCategory, 
    removeItem, 
    updateQuantity,
    clearCart,
    openQuoteForm,
    totalItems 
  } = useSampleCart();

  const itemsByCategory = getItemsByCategory();
  const isEmpty = items.length === 0;

  const handleRequestQuote = () => {
    closeCart();
    openQuoteForm();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 font-serif">
            <ShoppingBag className="w-5 h-5" />
            {lang === 'fr' ? 'Panier d\'échantillons' : 'Sample Cart'}
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">{totalItems}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">
              {lang === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
            </p>
            <p className="text-sm text-muted-foreground">
              {lang === 'fr' 
                ? 'Ajoutez des produits pour demander un devis' 
                : 'Add products to request a quote'}
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <CategorySection 
                category="COSMETIQUE" 
                items={itemsByCategory.COSMETIQUE}
                lang={lang}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
              <CategorySection 
                category="AROMES" 
                items={itemsByCategory.AROMES}
                lang={lang}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
              <CategorySection 
                category="PARFUM" 
                items={itemsByCategory.PARFUM}
                lang={lang}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
              />
            </ScrollArea>

            <Separator />

            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {lang === 'fr' ? 'Total produits' : 'Total products'}
                </span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <Button 
                className="w-full rounded-full h-12 font-semibold"
                onClick={handleRequestQuote}
              >
                <FileText className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Demander un devis' : 'Request a quote'}
              </Button>

              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground"
                onClick={clearCart}
              >
                {lang === 'fr' ? 'Vider le panier' : 'Clear cart'}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
