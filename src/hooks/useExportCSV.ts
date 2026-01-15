import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ProductType = "parfum" | "cosmetique" | "arome";

const tableMap: Record<ProductType, string> = {
  parfum: "parfum_fr",
  cosmetique: "cosmetique_fr",
  arome: "aromes_fr",
};

const typeLabels: Record<ProductType, string> = {
  parfum: "parfums",
  cosmetique: "cosmetiques",
  arome: "aromes",
};

export function useExportCSV() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (type: ProductType) => {
    setIsExporting(true);
    try {
      const table = tableMap[type] as "parfum_fr" | "cosmetique_fr" | "aromes_fr";
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("code", { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("Aucun produit à exporter");
        return;
      }

      // Convert to CSV
      const csv = Papa.unparse(data, {
        quotes: true,
        delimiter: ";",
      });

      // Add BOM for Excel UTF-8 compatibility
      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `${typeLabels[type]}_export_${date}.csv`;

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${data.length} produits exportés`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToCSV, isExporting };
}
