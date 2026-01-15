import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      }
    }, [existingData, isLoading, productCode, initialDataLoaded]);

    const updateRow = (ordre: number, field: "ph_value" | "odeur_rating", value: string | number | null) => {
      setRows((prev) => {
        const updated = prev.map((row) => (row.ordre === ordre ? { ...row, [field]: value } : row));
        onChange?.(true);
        return updated;
      });
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
        <CardHeader>
          <CardTitle>Stabilité & Odeurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">pH</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead className="w-32 text-center">Odeur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ordre}>
                    <TableCell>
                      <Input
                        value={row.ph_value || ""}
                        onChange={(e) => updateRow(row.ordre, "ph_value", e.target.value || null)}
                        className="w-16 h-8 text-center"
                        placeholder="pH"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{row.base_name}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <StarRatingInput
                          value={row.odeur_rating}
                          onChange={(value) => updateRow(row.ordre, "odeur_rating", value)}
                          size="md"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Cliquez sur les étoiles pour définir la note d'odeur (1-5). Cliquez à nouveau pour effacer.
          </p>
        </CardContent>
      </Card>
    );
  }
);

StabilityTable.displayName = "StabilityTable";
