import React, { createContext, useContext, useState, useCallback } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Product = Tables<'cosmetique_fr'>;

export type CartCategory = 'COSMETIQUE' | 'AROMES' | 'PARFUM';

export interface CartItem {
  product: Product;
  category: CartCategory;
  quantity: number;
}

interface SampleCartContextType {
  items: CartItem[];
  isOpen: boolean;
  isQuoteFormOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openQuoteForm: () => void;
  closeQuoteForm: () => void;
  getItemsByCategory: () => Record<CartCategory, CartItem[]>;
  totalItems: number;
}

const SampleCartContext = createContext<SampleCartContextType | undefined>(undefined);

// Helper to determine category from product gamme
const getCategoryFromProduct = (product: Product): CartCategory => {
  const gamme = product.gamme?.toUpperCase() || '';
  const type = product.typologie_de_produit?.toUpperCase() || '';
  
  if (gamme.includes('PARFUM') || gamme.includes('FRAGRANCE') || type.includes('PARFUM')) {
    return 'PARFUM';
  }
  if (gamme.includes('AROME') || gamme.includes('ARÔME') || type.includes('AROME') || type.includes('ARÔME')) {
    return 'AROMES';
  }
  return 'COSMETIQUE';
};

export const SampleCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        // Already in cart, increment quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      // Add new item
      return [...prev, {
        product,
        category: getCategoryFromProduct(product),
        quantity: 1
      }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const openQuoteForm = useCallback(() => setIsQuoteFormOpen(true), []);
  const closeQuoteForm = useCallback(() => setIsQuoteFormOpen(false), []);

  const getItemsByCategory = useCallback((): Record<CartCategory, CartItem[]> => {
    return {
      COSMETIQUE: items.filter(item => item.category === 'COSMETIQUE'),
      AROMES: items.filter(item => item.category === 'AROMES'),
      PARFUM: items.filter(item => item.category === 'PARFUM'),
    };
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SampleCartContext.Provider value={{
      items,
      isOpen,
      isQuoteFormOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openQuoteForm,
      closeQuoteForm,
      getItemsByCategory,
      totalItems,
    }}>
      {children}
    </SampleCartContext.Provider>
  );
};

export const useSampleCart = () => {
  const context = useContext(SampleCartContext);
  if (context === undefined) {
    throw new Error('useSampleCart must be used within a SampleCartProvider');
  }
  return context;
};
