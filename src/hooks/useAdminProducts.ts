import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProductType = "cosmetique" | "parfum" | "arome";

export interface AdminProduct {
  id: number;
  code: string | null;
  nom_commercial: string | null;
  gamme?: string | null;
  famille_olfactive?: string | null;
  origine: string | null;
  statut: string | null;
  image_url: string | null;
  [key: string]: unknown;
}

const tableMap = {
  cosmetique: "cosmetique_fr",
  parfum: "parfum_fr",
  arome: "aromes_fr",
} as const;

interface ProductFilters {
  search?: string;
  gamme?: string;
  origine?: string;
  statut?: string;
  page?: number;
  pageSize?: number;
}

// Hook pour lister les produits avec pagination et filtres
export function useAdminProducts(type: ProductType, filters: ProductFilters = {}) {
  const table = tableMap[type];
  const { search, gamme, origine, statut, page = 1, pageSize = 20 } = filters;

  return useQuery({
    queryKey: ["admin-products", type, filters],
    queryFn: async () => {
      let query = supabase
        .from(table)
        .select("*", { count: "exact" })
        .order("nom_commercial", { ascending: true });

      if (search) {
        query = query.or(
          `nom_commercial.ilike.%${search}%,code.ilike.%${search}%`
        );
      }

      if (gamme && type !== "parfum") {
        query = query.eq("gamme" as never, gamme);
      }
      
      if (gamme && type === "parfum") {
        query = query.eq("famille_olfactive" as never, gamme);
      }

      if (origine) {
        query = query.eq("origine", origine);
      }

      if (statut) {
        query = query.eq("statut", statut);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Map data to common shape
      const products = (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as number,
        code: p.code as string,
        nom_commercial: p.nom_commercial as string | null,
        gamme: (p.gamme || p.famille_olfactive || null) as string | null,
        origine: p.origine as string | null,
        statut: p.statut as string | null,
        image_url: p.image_url as string | null,
      }));

      return {
        products,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

// Hook pour récupérer un produit par code
export function useAdminProduct(type: ProductType, code: string | null) {
  const table = tableMap[type];

  return useQuery({
    queryKey: ["admin-product", type, code],
    queryFn: async () => {
      if (!code) return null;

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("code", code)
        .single();

      if (error) throw error;
      return data as AdminProduct;
    },
    enabled: !!code,
  });
}

// Hook pour créer/mettre à jour un produit
export function useUpsertProduct(type: ProductType) {
  const queryClient = useQueryClient();
  const table = tableMap[type];

  return useMutation({
    mutationFn: async (product: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from(table)
        .upsert(product as never, { onConflict: "code" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products", type] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Produit enregistré avec succès");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Hook pour supprimer un produit
export function useDeleteProduct(type: ProductType) {
  const queryClient = useQueryClient();
  const table = tableMap[type];

  return useMutation({
    mutationFn: async (code: string) => {
      const { error } = await supabase.from(table).delete().eq("code", code);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products", type] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Produit supprimé");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Hook pour l'import CSV en masse
export function useBulkImport(type: ProductType) {
  const queryClient = useQueryClient();
  const table = tableMap[type];

  return useMutation({
    mutationFn: async (products: Record<string, unknown>[]) => {
      const { data, error } = await supabase
        .from(table)
        .upsert(products as never[], { onConflict: "code" })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products", type] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(`${data?.length || 0} produits importés avec succès`);
    },
    onError: (error) => {
      toast.error(`Erreur d'import: ${error.message}`);
    },
  });
}

// Hook pour les options de filtre
export function useAdminFilterOptions(type: ProductType) {
  const table = tableMap[type];

  return useQuery({
    queryKey: ["admin-filter-options", type],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*");

      if (error) throw error;

      const allData = data || [];
      
      const gammes = [...new Set(allData.map((p: Record<string, unknown>) => 
        (p.gamme || p.famille_olfactive) as string
      ).filter(Boolean))].sort();
      
      const origines = [...new Set(allData.map((p: Record<string, unknown>) => 
        p.origine as string
      ).filter(Boolean))].sort();
      
      const statuts = [...new Set(allData.map((p: Record<string, unknown>) => 
        p.statut as string
      ).filter(Boolean))].sort();

      return { gammes, origines, statuts };
    },
  });
}
