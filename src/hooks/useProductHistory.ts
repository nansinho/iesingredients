import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ProductType } from "./useAdminProducts";

export interface ProductHistoryEntry {
  id: string;
  product_type: string;
  product_code: string;
  action: "create" | "update" | "delete" | "duplicate";
  changes: Record<string, { old: unknown; new: unknown }> | null;
  user_id: string | null;
  user_email: string | null;
  created_at: string;
}

// Hook pour enregistrer une modification
export function useRecordProductHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productType,
      productCode,
      action,
      changes,
    }: {
      productType: ProductType;
      productCode: string;
      action: "create" | "update" | "delete" | "duplicate";
      changes?: Record<string, { old: unknown; new: unknown }>;
    }) => {
      const { error } = await supabase.from("product_history").insert([{
        product_type: productType,
        product_code: productCode,
        action,
        changes: changes ? JSON.parse(JSON.stringify(changes)) : null,
        user_id: user?.id || null,
        user_email: user?.email || null,
      }]);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-history", variables.productType, variables.productCode],
      });
    },
  });
}

// Hook pour récupérer l'historique d'un produit
export function useProductHistory(productType: ProductType, productCode: string | null) {
  return useQuery({
    queryKey: ["product-history", productType, productCode],
    queryFn: async () => {
      if (!productCode) return [];

      const { data, error } = await supabase
        .from("product_history")
        .select("*")
        .eq("product_type", productType)
        .eq("product_code", productCode)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as ProductHistoryEntry[];
    },
    enabled: !!productCode,
  });
}

// Utilitaire pour comparer deux objets et retourner les différences
export function getChangedFields(
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>
): Record<string, { old: unknown; new: unknown }> | null {
  const changes: Record<string, { old: unknown; new: unknown }> = {};

  for (const key of Object.keys(newValues)) {
    const oldVal = oldValues[key] ?? null;
    const newVal = newValues[key] ?? null;

    // Ignorer les champs techniques
    if (["id", "created_at", "updated_at"].includes(key)) continue;

    // Comparer les valeurs
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes[key] = { old: oldVal, new: newVal };
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
}
