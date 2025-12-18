import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Product = Tables<'cosmetique_fr'>;

export interface ProductFilters {
  search?: string;
  gamme?: string[];
  origine?: string[];
  solubilite?: string[];
  aspect?: string[];
  certifications?: string[];
  application?: string[];
  typeDePeau?: string[];
}

export interface FilterOptions {
  gammes: string[];
  origines: string[];
  solubilites: string[];
  aspects: string[];
  certifications: string[];
  applications: string[];
  typesDePeau: string[];
}

// Fetch all active products
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('cosmetique_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .order('nom_commercial', { ascending: true });

      const { data, error } = await query;
      
      if (error) throw error;
      
      let products = data || [];

      // Apply client-side filters
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.nom_commercial?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.code?.toLowerCase().includes(searchLower) ||
          p.inci?.toLowerCase().includes(searchLower) ||
          p.benefices?.toLowerCase().includes(searchLower) ||
          p.gamme?.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.gamme?.length) {
        products = products.filter(p => p.gamme && filters.gamme!.includes(p.gamme));
      }

      if (filters?.origine?.length) {
        products = products.filter(p => p.origine && filters.origine!.includes(p.origine));
      }

      if (filters?.solubilite?.length) {
        products = products.filter(p => p.solubilite && filters.solubilite!.includes(p.solubilite));
      }

      if (filters?.aspect?.length) {
        products = products.filter(p => p.aspect && filters.aspect!.includes(p.aspect));
      }

      if (filters?.certifications?.length) {
        products = products.filter(p => 
          p.certifications && filters.certifications!.some(c => p.certifications!.includes(c))
        );
      }

      if (filters?.application?.length) {
        products = products.filter(p => 
          p.application && filters.application!.some(a => p.application!.includes(a))
        );
      }

      return products;
    },
  });
};

// Fetch a single product by code
export const useProduct = (code: string) => {
  return useQuery({
    queryKey: ['product', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cosmetique_fr')
        .select('*')
        .eq('code', code)
        .eq('statut', 'ACTIF')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!code,
  });
};

// Fetch filter options from products
export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cosmetique_fr')
        .select('gamme, origine, solubilite, aspect, certifications, application, type_de_peau')
        .eq('statut', 'ACTIF');
      
      if (error) throw error;

      const options: FilterOptions = {
        gammes: [],
        origines: [],
        solubilites: [],
        aspects: [],
        certifications: [],
        applications: [],
        typesDePeau: [],
      };

      const gammeSet = new Set<string>();
      const origineSet = new Set<string>();
      const solubiliteSet = new Set<string>();
      const aspectSet = new Set<string>();
      const certificationSet = new Set<string>();
      const applicationSet = new Set<string>();
      const typeDePeauSet = new Set<string>();

      data?.forEach(p => {
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

      options.gammes = [...gammeSet].sort();
      options.origines = [...origineSet].sort();
      options.solubilites = [...solubiliteSet].sort();
      options.aspects = [...aspectSet].sort();
      options.certifications = [...certificationSet].sort();
      options.applications = [...applicationSet].sort();
      options.typesDePeau = [...typeDePeauSet].sort();

      return options;
    },
  });
};

// Similar products based on gamme or benefices
export const useSimilarProducts = (currentProduct: Product | null, limit = 4) => {
  return useQuery({
    queryKey: ['similar-products', currentProduct?.code],
    queryFn: async () => {
      if (!currentProduct) return [];

      const { data, error } = await supabase
        .from('cosmetique_fr')
        .select('*')
        .eq('statut', 'ACTIF')
        .neq('code', currentProduct.code)
        .limit(20);
      
      if (error) throw error;

      // Score products by similarity
      const scored = (data || []).map(p => {
        let score = 0;
        if (p.gamme === currentProduct.gamme) score += 3;
        if (p.origine === currentProduct.origine) score += 2;
        if (p.solubilite === currentProduct.solubilite) score += 1;
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
  });
};
