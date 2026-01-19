import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
  useProductPerformance,
  type PerformanceRow,
} from "@/hooks/usePerformance";

// Default performance options
const DEFAULT_OPTIONS = [
  "Niveau d'utilisation",
  "Ténacité sur buvard",
  "Ténacité sur peau",
  "Intensité olfactive",
  "Pouvoir couvrant",
  "Point éclair",
];

export interface PerformanceTableRef {
  getData: () => Omit<PerformanceRow, "id">[];
  hasChanges: () => boolean;
}

interface PerformanceTableProps {
  productCode: string;
  onChange?: (hasChanges: boolean) => void;
}

export const PerformanceTable = forwardRef<PerformanceTableRef, PerformanceTableProps>(
  ({ productCode, onChange }, ref) => {
    const { data: existingData, isLoading } = useProductPerformance(productCode);
    const [rows, setRows] = useState<Omit<PerformanceRow, "id">[]>([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [hasExistingData, setHasExistingData] = useState(false);

    useEffect(() => {
      if (existingData && existingData.length > 0) {
        setRows(
          existingData.map((row) => ({
            product_code: row.product_code,
            ordre: row.ordre,
            option_name: row.option_name,
            performance_value: row.performance_value,
            performance_rating: row.performance_rating,
          }))
        );
        setInitialDataLoaded(true);
        setHasExistingData(true);
      } else if (!isLoading && !initialDataLoaded) {
        // Create default rows
        setRows(
          DEFAULT_OPTIONS.map((option, index) => ({
            product_code: productCode,
            ordre: index + 1,
            option_name: option,
            performance_value: null,
            performance_rating: null,
          }))
        );
        setInitialDataLoaded(true);
        setHasExistingData(false);
      }
    }, [existingData, isLoading, productCode, initialDataLoaded]);

    const updateRow = (
      ordre: number,
      field: "option_name" | "performance_value" | "performance_rating",
      value: string | number | null
    ) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.ordre !== ordre) return row;
          
          // If setting a value, clear the rating (and vice versa)
          if (field === "performance_value" && value) {
            return { ...row, performance_value: value as string | null, performance_rating: null };
          }
          if (field === "performance_rating" && value) {
            return { ...row, performance_rating: value as number | null, performance_value: null };
          }
          if (field === "option_name") {
            return { ...row, option_name: value as string | null };
          }
          return { ...row, [field]: value };
        })
      );
      onChange?.(true);
    };

    const addRow = () => {
      const maxOrdre = Math.max(...rows.map((r) => r.ordre), 0);
      setRows((prev) => [
        ...prev,
        {
          product_code: productCode,
          ordre: maxOrdre + 1,
          option_name: "",
          performance_value: null,
          performance_rating: null,
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
            <CardTitle>Performance</CardTitle>
            {hasExistingData && <AIFieldBadge />}
          </div>
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une option
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Option</TableHead>
                  <TableHead className="w-[180px]">Valeur texte</TableHead>
                  <TableHead className="w-[200px]">Note</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ordre}>
                    <TableCell>
                      <Input
                        value={row.option_name || ""}
                        onChange={(e) => updateRow(row.ordre, "option_name", e.target.value)}
                        className="h-8"
                        placeholder="Nom de l'option"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.performance_value || ""}
                        onChange={(e) =>
                          updateRow(row.ordre, "performance_value", e.target.value || null)
                        }
                        className="h-8"
                        placeholder="Valeur"
                        disabled={row.performance_rating !== null}
                      />
                    </TableCell>
                    <TableCell>
                      <StarRatingInput
                        value={row.performance_rating}
                        onChange={(value) => updateRow(row.ordre, "performance_rating", value)}
                        size="md"
                        disabled={!!row.performance_value}
                      />
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
            Utilisez soit la valeur texte, soit la note étoilée (pas les deux). Tous les champs sont éditables.
          </p>
        </CardContent>
      </Card>
    );
  }
);

PerformanceTable.displayName = "PerformanceTable";
