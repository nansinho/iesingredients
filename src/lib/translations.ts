import { Tables } from '@/integrations/supabase/types';
import { Language } from '@/lib/i18n';

// Product type already includes translation fields from Supabase types
export type TranslatedProduct = Tables<'cosmetique_fr'>;

// Helper to get translated field value
export const getTranslatedField = (
  product: TranslatedProduct,
  field: keyof TranslatedProduct,
  lang: Language
): string | null => {
  if (lang === 'fr') {
    return product[field] as string | null;
  }

  // For English, try to get the translated field first
  const translatedFieldKey = `${String(field)}_en` as keyof TranslatedProduct;
  
  if (translatedFieldKey in product) {
    const translatedValue = product[translatedFieldKey] as string | null | undefined;
    
    // If translation exists, use it; otherwise fallback to French
    if (translatedValue && translatedValue.trim()) {
      return translatedValue;
    }
  }
  
  return product[field] as string | null;
};

// Convenience functions for commonly used fields
export const getProductName = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'nom_commercial', lang) || '';
};

export const getProductDescription = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'description', lang) || '';
};

export const getProductBenefits = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'benefices', lang) || '';
};

export const getProductApplications = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'application', lang) || '';
};

export const getProductSkinTypes = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'type_de_peau', lang) || '';
};

export const getProductAspect = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'aspect', lang) || '';
};

export const getProductSolubility = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'solubilite', lang) || '';
};

export const getProductCertifications = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'certifications', lang) || '';
};

export const getProductValorisations = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'valorisations', lang) || '';
};

export const getProductTraceability = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'tracabilite', lang) || '';
};

export const getProductPreservatives = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'conservateurs', lang) || '';
};

export const getProductHarvestCalendar = (product: TranslatedProduct, lang: Language): string => {
  return getTranslatedField(product, 'calendrier_des_recoltes', lang) || '';
};
