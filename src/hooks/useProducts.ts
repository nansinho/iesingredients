import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/lib/i18n';

// Generic product type that works for both tables
export interface Product {
  id: number;
  code: string | null;
  nom_commercial: string | null;
  typologie_de_produit: string | null;
  gamme: string | null;
  origine: string | null;
  tracabilite: string | null;
  cas_no: string | null;
  inci: string | null;
  flavouring_preparation: string | null;
  benefices_aqueux: string | null;
  benefices_huileux: string | null;
  benefices: string | null;
  solubilite: string | null;
  partie_utilisee: string | null;
  description: string | null;
  aspect: string | null;
  conservateurs: string | null;
  application: string | null;
  type_de_peau: string | null;
  calendrier_des_recoltes: string | null;
  certifications: string | null;
  valorisations: string | null;
  statut: string | null;
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

// Helper to get the correct table name based on language
const getTableName = (lang: Language): 'cosmetique_fr' | 'cosmetique_en' => {
  return lang === 'en' ? 'cosmetique_en' : 'cosmetique_fr';
};

// Fetch all active products based on language
export const useProducts = (filters?: ProductFilters, lang: Language = 'fr') => {
  return useQuery({
    queryKey: ['products', filters, lang],
    queryFn: async () => {
      const tableName = getTableName(lang);
      
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('statut', 'ACTIF')
        .order('nom_commercial', { ascending: true });

      const { data, error } = await query;
      
      if (error) throw error;
      
      let products = (data || []) as Product[];

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

// Fetch a single product by code based on language
// Falls back to French if English translation doesn't exist
export const useProduct = (code: string, lang: Language = 'fr') => {
  return useQuery({
    queryKey: ['product', code, lang],
    queryFn: async () => {
      const tableName = getTableName(lang);
      
      // Try to get from the language-specific table first
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('code', code)
        .eq('statut', 'ACTIF')
        .maybeSingle();
      
      if (error) throw error;
      
      // If English and no translation exists, fallback to French
      if (!data && lang === 'en') {
        const { data: frenchData, error: frenchError } = await supabase
          .from('cosmetique_fr')
          .select('*')
          .eq('code', code)
          .eq('statut', 'ACTIF')
          .maybeSingle();
        
        if (frenchError) throw frenchError;
        return frenchData as Product | null;
      }
      
      return data as Product | null;
    },
    enabled: !!code,
  });
};

// Fetch filter options (always from French table as it's the source of truth)
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
export const useSimilarProducts = (currentProduct: Product | null, lang: Language = 'fr', limit = 4) => {
  return useQuery({
    queryKey: ['similar-products', currentProduct?.code, lang],
    queryFn: async () => {
      if (!currentProduct) return [];

      const tableName = getTableName(lang);

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('statut', 'ACTIF')
        .neq('code', currentProduct.code)
        .limit(20);
      
      if (error) throw error;

      // Score products by similarity
      const scored = ((data || []) as Product[]).map(p => {
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
