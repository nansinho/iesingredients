// Shared product category theme configuration
import { Droplets, Sparkles, Leaf } from 'lucide-react';

export type ProductCategory = 'COSMETIQUE' | 'PARFUMERIE' | 'ARÔMES' | 'default';

export interface CategoryConfig {
  bg: string;
  bgLight: string;
  border: string;
  text: string;
  textDark: string;
  accent: string;
  icon: typeof Droplets;
  label: string;
  gradient: string;
}

export function getCategoryConfig(typologie: string | null): CategoryConfig {
  const type = typologie?.toUpperCase() || '';
  
  if (type.includes('COSMETIQUE') || type.includes('COSMÉTIQUE')) {
    return {
      bg: 'bg-cosmetique-500',
      bgLight: 'bg-cosmetique-50',
      border: 'border-cosmetique-200',
      text: 'text-cosmetique-600',
      textDark: 'text-cosmetique-700',
      accent: 'text-cosmetique-500',
      icon: Droplets,
      label: 'COSMÉTIQUE',
      gradient: 'from-cosmetique-500/20 to-cosmetique-600/10',
    };
  }
  
  if (type.includes('PARFUM')) {
    return {
      bg: 'bg-parfum-500',
      bgLight: 'bg-parfum-50',
      border: 'border-parfum-200',
      text: 'text-parfum-600',
      textDark: 'text-parfum-700',
      accent: 'text-parfum-500',
      icon: Sparkles,
      label: 'PARFUMERIE',
      gradient: 'from-parfum-500/20 to-parfum-600/10',
    };
  }
  
  if (type.includes('ARÔME') || type.includes('AROME')) {
    return {
      bg: 'bg-arome-500',
      bgLight: 'bg-arome-50',
      border: 'border-arome-200',
      text: 'text-arome-600',
      textDark: 'text-arome-700',
      accent: 'text-arome-500',
      icon: Leaf,
      label: 'ARÔMES',
      gradient: 'from-arome-500/20 to-arome-600/10',
    };
  }
  
  // Default
  return {
    bg: 'bg-forest-500',
    bgLight: 'bg-forest-50',
    border: 'border-forest-200',
    text: 'text-forest-600',
    textDark: 'text-forest-700',
    accent: 'text-forest-500',
    icon: Leaf,
    label: 'INGRÉDIENT',
    gradient: 'from-forest-500/20 to-forest-600/10',
  };
}

// Get banner image based on product category
export function getProductBanner(typologie: string | null): string {
  const type = typologie?.toUpperCase() || '';
  
  if (type.includes('COSMETIQUE') || type.includes('COSMÉTIQUE')) {
    return 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1920&q=80';
  }
  if (type.includes('PARFUM')) {
    return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80';
  }
  if (type.includes('ARÔME') || type.includes('AROME')) {
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
  }
  return 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80';
}
