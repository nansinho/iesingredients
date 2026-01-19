import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PerformanceRow {
  id?: number;
  product_code: string;
  ordre: number;
  option_name: string | null;
  performance_value: string | null;
  performance_rating: number | null;
}

export const DEFAULT_PERFORMANCE_COUNT = 6;

// Hook pour récupérer les données de performance d'un produit
export function useProductPerformance(productCode: string | null) {
  return useQuery({
    queryKey: ["product-performance", productCode],
    queryFn: async () => {
      if (!productCode) return [];

      const { data, error } = await supabase
        .from("parfum_performance")
        .select("*")
        .eq("product_code", productCode)
        .order("ordre");

      if (error) throw error;
      return (data || []) as PerformanceRow[];
    },
    enabled: !!productCode,
  });
}

// Hook pour mettre à jour les données de performance
export function useUpdatePerformance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productCode,
      performanceData,
    }: {
      productCode: string;
      performanceData: Omit<PerformanceRow, "id" | "product_code">[];
    }) => {
      // Supprimer les anciennes données
      await supabase.from("parfum_performance").delete().eq("product_code", productCode);

      // Insérer les nouvelles données (filtrer les lignes vides)
      const rowsToInsert = performanceData
        .filter((row) => row.option_name || row.performance_rating !== null || row.performance_value)
        .map((row) => ({
          product_code: productCode,
          ordre: row.ordre,
          option_name: row.option_name,
          performance_value: row.performance_value,
          performance_rating: row.performance_rating,
        }));

      if (rowsToInsert.length > 0) {
        const { data, error } = await supabase
          .from("parfum_performance")
          .insert(rowsToInsert)
          .select();

        if (error) throw error;
        return data;
      }

      return [];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-performance", variables.productCode],
      });
      toast.success("Données de performance enregistrées");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Créer les données initiales de performance (6 lignes vides)
export function createInitialPerformanceData(productCode: string): Omit<PerformanceRow, "id">[] {
  return Array.from({ length: DEFAULT_PERFORMANCE_COUNT }, (_, i) => ({
    product_code: productCode,
    ordre: i + 1,
    option_name: null,
    performance_value: null,
    performance_rating: null,
  }));
}

// Hook public pour récupérer les données de performance (frontend)
export function useProductPerformancePublic(productCode: string | null) {
  return useQuery({
    queryKey: ["product-performance-public", productCode],
    queryFn: async () => {
      if (!productCode) return [];

      const { data, error } = await supabase
        .from("parfum_performance")
        .select("*")
        .eq("product_code", productCode)
        .order("ordre");

      if (error) throw error;
      return (data || []) as PerformanceRow[];
    },
    enabled: !!productCode,
  });
}
