import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StabilityRow {
  id?: number;
  product_code: string;
  ordre: number;
  ph_value: string | null;
  base_name: string;
  odeur_rating: number | null;
}

export const DEFAULT_STABILITY_BASES = [
  { ordre: 1, base_name: "Nettoyant acide", default_ph: "2" },
  { ordre: 2, base_name: "Adoucissant textile", default_ph: "3" },
  { ordre: 3, base_name: "Anti-transpirant", default_ph: "3.5" },
  { ordre: 4, base_name: "Shampooing", default_ph: "6" },
  { ordre: 5, base_name: "APC", default_ph: "9" },
  { ordre: 6, base_name: "Lessive liquide", default_ph: "9" },
  { ordre: 7, base_name: "Savon", default_ph: "10" },
  { ordre: 8, base_name: "Lessive en poudre", default_ph: "10.5" },
  { ordre: 9, base_name: "Eau de Javel", default_ph: "11" },
];

// Hook pour récupérer les données de stabilité d'un produit
export function useProductStability(productCode: string | null) {
  return useQuery({
    queryKey: ["product-stability", productCode],
    queryFn: async () => {
      if (!productCode) return [];

      const { data, error } = await supabase
        .from("parfum_stabilite")
        .select("*")
        .eq("product_code", productCode)
        .order("ordre");

      if (error) throw error;
      return data || [];
    },
    enabled: !!productCode,
  });
}

// Hook pour mettre à jour les données de stabilité
export function useUpdateStability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productCode,
      stabilityData,
    }: {
      productCode: string;
      stabilityData: Omit<StabilityRow, "id" | "product_code">[];
    }) => {
      // Supprimer les anciennes données
      await supabase.from("parfum_stabilite").delete().eq("product_code", productCode);

      // Insérer les nouvelles données (filtrer les lignes vides)
      const rowsToInsert = stabilityData
        .filter((row) => row.ph_value || row.odeur_rating !== null)
        .map((row) => ({
          product_code: productCode,
          ordre: row.ordre,
          ph_value: row.ph_value,
          base_name: row.base_name,
          odeur_rating: row.odeur_rating,
        }));

      if (rowsToInsert.length > 0) {
        const { data, error } = await supabase
          .from("parfum_stabilite")
          .insert(rowsToInsert)
          .select();

        if (error) throw error;
        return data;
      }

      return [];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-stability", variables.productCode],
      });
      toast.success("Données de stabilité enregistrées");
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

// Créer les données initiales de stabilité à partir des valeurs par défaut
export function createInitialStabilityData(productCode: string): Omit<StabilityRow, "id">[] {
  return DEFAULT_STABILITY_BASES.map((base) => ({
    product_code: productCode,
    ordre: base.ordre,
    ph_value: base.default_ph,
    base_name: base.base_name,
    odeur_rating: null,
  }));
}
