import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Loader2, Plus, Trash2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarRatingInput } from "./StarRatingInput";
import { AIFieldBadge } from "./AIFieldBadge";
import {
  useProductStability,
  DEFAULT_STABILITY_BASES,
  type StabilityRow,
} from "@/hooks/useStability";

export interface StabilityTableRef {
  getData: () => Omit<StabilityRow, "id">[];
  hasChanges: () => boolean;
}

interface StabilityTableProps {
  productCode: string;
  onChange?: (hasChanges: boolean) => void;
}

export const StabilityTable = forwardRef<StabilityTableRef, StabilityTableProps>(
  ({ productCode, onChange }, ref) => {
    const { data: existingData, isLoading } = useProductStability(productCode);
    const [rows, setRows] = useState<Omit<StabilityRow, "id">[]>([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [hasExistingData, setHasExistingData] = useState(false);

    useEffect(() => {
      if (existingData && existingData.length > 0) {
        setRows(
          existingData.map((row) => ({
            product_code: row.product_code,
            ordre: row.ordre,
            ph_value: row.ph_value,
            base_name: row.base_name,
            odeur_rating: row.odeur_rating,
          }))
        );
        setInitialDataLoaded(true);
        setHasExistingData(true);
      } else if (!isLoading && !initialDataLoaded) {
        setRows(
          DEFAULT_STABILITY_BASES.map((base) => ({
            product_code: productCode,
            ordre: base.ordre,
            ph_value: base.default_ph,
            base_name: base.base_name,
            odeur_rating: null,
          }))
        );
        setInitialDataLoaded(true);
        setHasExistingData(false);
      }
    }, [existingData, isLoading, productCode, initialDataLoaded]);

    const updateRow = (
      ordre: number,
      field: "ph_value" | "odeur_rating" | "base_name",
      value: string | number | null
    ) => {
      setRows((prev) => {
        const updated = prev.map((row) =>
          row.ordre === ordre ? { ...row, [field]: value } : row
        );
        onChange?.(true);
        return updated;
      });
    };

    const addRow = () => {
      const maxOrdre = Math.max(...rows.map((r) => r.ordre), 0);
      setRows((prev) => [
        ...prev,
        {
          product_code: productCode,
          ordre: maxOrdre + 1,
          ph_value: "",
          base_name: "",
          odeur_rating: null,
        },
      ]);
      onChange?.(true);
    };

    const removeRow = (ordre: number) => {
      setRows((prev) => prev.filter((r) => r.ordre !== ordre));
      onChange?.(true);
    };

    useImperativeHandle(ref, () => ({
      getData: () => rows,
      hasChanges: () => true,
    }));

    if (isLoading) {
      return (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement...
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Stabilité & Odeurs</CardTitle>
            {hasExistingData && <AIFieldBadge />}
          </div>
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une base
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">pH</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead className="w-[200px]">Odeur</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ordre}>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={row.ph_value || ""}
                          onChange={(e) =>
                            updateRow(row.ordre, "ph_value", e.target.value || null)
                          }
                          className="w-16 h-8 text-center"
                          placeholder="pH"
                        />
                        {hasExistingData && row.ph_value && (
                          <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={row.base_name || ""}
                          onChange={(e) =>
                            updateRow(row.ordre, "base_name", e.target.value)
                          }
                          className="h-8 flex-1"
                          placeholder="Nom de la base"
                        />
                        {hasExistingData && row.base_name && (
                          <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StarRatingInput
                          value={row.odeur_rating}
                          onChange={(value) => updateRow(row.ordre, "odeur_rating", value)}
                          size="md"
                        />
                        {hasExistingData && row.odeur_rating && (
                          <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeRow(row.ordre)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Cliquez sur les étoiles pour définir l'odeur (1-5). Tous les champs sont éditables.
          </p>
        </CardContent>
      </Card>
    );
  }
);

StabilityTable.displayName = "StabilityTable";
