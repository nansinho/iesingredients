import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/lib/i18n';

// Generic product type that works for all tables (cosmetique, parfum, aromes)
export interface Product {
  id: number;
  code: string | null;
  nom_commercial: string | null;
  typologie_de_produit: string | null;
  gamme?: string | null;
  origine: string | null;
  tracabilite?: string | null;
  cas_no: string | null;
  inci?: string | null;
  flavouring_preparation?: string | null;
  benefices_aqueux?: string | null;
  benefices_huileux?: string | null;
  benefices?: string | null;
  solubilite?: string | null;
  partie_utilisee?: string | null;
  description: string | null;
  aspect: string | null;
  conservateurs?: string | null;
  application?: string | null;
  type_de_peau?: string | null;
  calendrier_des_recoltes?: string | null;
  certifications: string | null;
  valorisations: string | null;
  statut: string | null;
  // Parfum-specific fields
  famille_olfactive?: string | null;
  profil_olfactif?: string | null;
  nom_latin?: string | null;
  food_grade?: string | null;
  performance?: string | null;
  ph?: string | null;
  base?: string | null;
  odeur?: string | null;
  // Aromes-specific fields
  profil_aromatique?: string | null;
  dosage?: string | null;
}

export interface ProductFilters {
  search?: string;
  gamme?: string[];
  origine?: string[];
  solubilite?: string[];
  aspect?: string[];
  certifications?: string[];
  application?: string[];
  typeDePeau?: string[];
  typologie?: string; // Category filter: COSMETIQUE, PARFUM, AROME
  familleOlfactive?: string[];
}

export interface FilterOptions {
  gammes: string[];
  origines: string[];
  solubilites: string[];
  aspects: string[];
  certifications: string[];
  applications: string[];
  typesDePeau: string[];
  famillesOlfactives: string[];
}

// Fetch all active products - combining cosmetique_fr and parfum_fr
export const useProducts = (filters?: ProductFilters, lang: Language = 'fr') => {
  return useQuery({
    queryKey: ['products', filters, lang],
    queryFn: async () => {
      let allProducts: Product[] = [];

      // Fetch from cosmetique_fr
      const { data: cosmetiqueData, error: cosmetiqueError } = await supabase
        .from('cosmetique_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .order('nom_commercial', { ascending: true });
      
      if (cosmetiqueError) throw cosmetiqueError;
      
      if (cosmetiqueData) {
        allProducts = [...(cosmetiqueData as Product[])];
      }

      // Fetch from parfum_fr
      const { data: parfumData, error: parfumError } = await supabase
        .from('parfum_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .order('nom_commercial', { ascending: true });
      
      if (parfumError) {
        console.warn('parfum_fr table not accessible:', parfumError);
      } else if (parfumData) {
        allProducts = [...allProducts, ...(parfumData as Product[])];
      }

      // Fetch from aromes_fr
      const { data: aromesData, error: aromesError } = await supabase
        .from('aromes_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .order('nom_commercial', { ascending: true });
      
      if (aromesError) {
        console.warn('aromes_fr table not accessible:', aromesError);
      } else if (aromesData) {
        allProducts = [...allProducts, ...(aromesData as Product[])];
      }

      // Sort combined results
      allProducts.sort((a, b) => 
        (a.nom_commercial || '').localeCompare(b.nom_commercial || '')
      );

      // Apply client-side filters
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        allProducts = allProducts.filter(p => 
          p.nom_commercial?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.code?.toLowerCase().includes(searchLower) ||
          p.inci?.toLowerCase().includes(searchLower) ||
          p.benefices?.toLowerCase().includes(searchLower) ||
          p.gamme?.toLowerCase().includes(searchLower) ||
          p.certifications?.toLowerCase().includes(searchLower) ||
          p.valorisations?.toLowerCase().includes(searchLower) ||
          p.famille_olfactive?.toLowerCase().includes(searchLower) ||
          p.profil_olfactif?.toLowerCase().includes(searchLower)
        );
      }

      // Category filter (typologie_de_produit)
      if (filters?.typologie) {
        allProducts = allProducts.filter(p => 
          p.typologie_de_produit?.toUpperCase().includes(filters.typologie!.toUpperCase())
        );
      }

      if (filters?.gamme?.length) {
        allProducts = allProducts.filter(p => p.gamme && filters.gamme!.includes(p.gamme));
      }

      if (filters?.origine?.length) {
        allProducts = allProducts.filter(p => p.origine && filters.origine!.includes(p.origine));
      }

      if (filters?.solubilite?.length) {
        allProducts = allProducts.filter(p => p.solubilite && filters.solubilite!.includes(p.solubilite));
      }

      if (filters?.aspect?.length) {
        allProducts = allProducts.filter(p => p.aspect && filters.aspect!.includes(p.aspect));
      }

      if (filters?.certifications?.length) {
        allProducts = allProducts.filter(p => 
          p.certifications && filters.certifications!.some(c => p.certifications!.includes(c))
        );
      }

      if (filters?.application?.length) {
        allProducts = allProducts.filter(p => 
          p.application && filters.application!.some(a => p.application!.includes(a))
        );
      }

      if (filters?.familleOlfactive?.length) {
        allProducts = allProducts.filter(p => 
          p.famille_olfactive && filters.familleOlfactive!.includes(p.famille_olfactive)
        );
      }

      return allProducts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - avoid refetching
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

// Fetch a single product by code - check both tables
export const useProduct = (code: string, lang: Language = 'fr') => {
  return useQuery({
    queryKey: ['product', code, lang],
    queryFn: async () => {
      // Try cosmetique_fr first
      const { data: cosmetiqueData, error: cosmetiqueError } = await supabase
        .from('cosmetique_fr')
        .select('*')
        .eq('code', code)
        .eq('statut', 'ACTIF')
        .maybeSingle();
      
      if (cosmetiqueError) throw cosmetiqueError;
      
      if (cosmetiqueData) {
        return cosmetiqueData as Product;
      }

      // Try parfum_fr if not found in cosmetique
      const { data: parfumData, error: parfumError } = await supabase
        .from('parfum_fr')
        .select('*')
        .eq('code', code)
        .eq('statut', 'ACTIF')
        .maybeSingle();
      
      if (parfumError) {
        console.warn('parfum_fr table not accessible:', parfumError);
        return null;
      }
      
      return parfumData as Product | null;
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch filter options from both tables
export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const options: FilterOptions = {
        gammes: [],
        origines: [],
        solubilites: [],
        aspects: [],
        certifications: [],
        applications: [],
        typesDePeau: [],
        famillesOlfactives: [],
      };

      const gammeSet = new Set<string>();
      const origineSet = new Set<string>();
      const solubiliteSet = new Set<string>();
      const aspectSet = new Set<string>();
      const certificationSet = new Set<string>();
      const applicationSet = new Set<string>();
      const typeDePeauSet = new Set<string>();
      const familleOlfactiveSet = new Set<string>();

      // Fetch from cosmetique_fr
      const { data: cosmetiqueData, error: cosmetiqueError } = await supabase
        .from('cosmetique_fr')
        .select('gamme, origine, solubilite, aspect, certifications, application, type_de_peau')
        .eq('statut', 'ACTIF');
      
      if (cosmetiqueError) throw cosmetiqueError;

      cosmetiqueData?.forEach(p => {
        if (p.gamme) gammeSet.add(p.gamme);
        if (p.origine) origineSet.add(p.origine);
        if (p.solubilite) solubiliteSet.add(p.solubilite);
        if (p.aspect) aspectSet.add(p.aspect);
        if (p.certifications) {
          p.certifications.split(/[,\-\/]/).forEach(c => {
            const trimmed = c.trim();
            if (trimmed) certificationSet.add(trimmed);
          });
        }
        if (p.application) {
          p.application.split(/[,\/]/).forEach(a => {
            const trimmed = a.trim();
            if (trimmed) applicationSet.add(trimmed);
          });
        }
        if (p.type_de_peau) {
          p.type_de_peau.split(/[,\/]/).forEach(t => {
            const trimmed = t.trim();
            if (trimmed) typeDePeauSet.add(trimmed);
          });
        }
      });

      // Fetch from parfum_fr
      const { data: parfumData, error: parfumError } = await supabase
        .from('parfum_fr')
        .select('origine, aspect, certifications, famille_olfactive')
        .eq('statut', 'ACTIF');
      
      if (!parfumError && parfumData) {
        parfumData.forEach(p => {
          if (p.origine) origineSet.add(p.origine);
          if (p.aspect) aspectSet.add(p.aspect);
          if (p.famille_olfactive) familleOlfactiveSet.add(p.famille_olfactive);
          if (p.certifications) {
            p.certifications.split(/[,\-\/]/).forEach(c => {
              const trimmed = c.trim();
              if (trimmed) certificationSet.add(trimmed);
            });
          }
        });
      }

      options.gammes = [...gammeSet].sort();
      options.origines = [...origineSet].sort();
      options.solubilites = [...solubiliteSet].sort();
      options.aspects = [...aspectSet].sort();
      options.certifications = [...certificationSet].sort();
      options.applications = [...applicationSet].sort();
      options.typesDePeau = [...typeDePeauSet].sort();
      options.famillesOlfactives = [...familleOlfactiveSet].sort();

      return options;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
};

// Similar products based on gamme or benefices
export const useSimilarProducts = (currentProduct: Product | null, lang: Language = 'fr', limit = 4) => {
  return useQuery({
    queryKey: ['similar-products', currentProduct?.code, lang],
    queryFn: async () => {
      if (!currentProduct) return [];

      let allProducts: Product[] = [];

      // Fetch from cosmetique_fr
      const { data: cosmetiqueData, error: cosmetiqueError } = await supabase
        .from('cosmetique_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .neq('code', currentProduct.code)
        .limit(20);
      
      if (cosmetiqueError) throw cosmetiqueError;
      if (cosmetiqueData) {
        allProducts = [...(cosmetiqueData as Product[])];
      }

      // Fetch from parfum_fr
      const { data: parfumData, error: parfumError } = await supabase
        .from('parfum_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .neq('code', currentProduct.code)
        .limit(20);
      
      if (!parfumError && parfumData) {
        allProducts = [...allProducts, ...(parfumData as Product[])];
      }

      // Score products by similarity
      const scored = allProducts.map(p => {
        let score = 0;
        if (p.gamme === currentProduct.gamme) score += 3;
        if (p.origine === currentProduct.origine) score += 2;
        if (p.solubilite === currentProduct.solubilite) score += 1;
        if (p.typologie_de_produit === currentProduct.typologie_de_produit) score += 2;
        if (p.famille_olfactive && currentProduct.famille_olfactive && 
            p.famille_olfactive === currentProduct.famille_olfactive) score += 3;
        if (currentProduct.benefices && p.benefices) {
          const currentBenefices = currentProduct.benefices.toLowerCase().split(/[,\/]/);
          const pBenefices = p.benefices.toLowerCase().split(/[,\/]/);
          currentBenefices.forEach(b => {
            if (pBenefices.some(pb => pb.includes(b.trim()))) score += 1;
          });
        }
        return { product: p, score };
      });

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.product);
    },
    enabled: !!currentProduct,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
