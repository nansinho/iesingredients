import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  useUpdateStability,
  DEFAULT_STABILITY_BASES,
  type StabilityRow,
} from "@/hooks/useStability";

interface StabilityTableProps {
  productCode: string;
}

export function StabilityTable({ productCode }: StabilityTableProps) {
  const { data: existingData, isLoading } = useProductStability(productCode);
  const updateMutation = useUpdateStability();

  const [rows, setRows] = useState<Omit<StabilityRow, "id" | "product_code">[]>([]);

  // Initialize rows when data loads
  useEffect(() => {
    if (existingData && existingData.length > 0) {
      // Use existing data
      setRows(
        existingData.map((row) => ({
          ordre: row.ordre,
          ph_value: row.ph_value,
          base_name: row.base_name,
          odeur_rating: row.odeur_rating,
        }))
      );
    } else {
      // Use default structure
      setRows(
        DEFAULT_STABILITY_BASES.map((base) => ({
          ordre: base.ordre,
          ph_value: base.default_ph,
          base_name: base.base_name,
          odeur_rating: null,
        }))
      );
    }
  }, [existingData]);

  const updateRow = (ordre: number, field: "ph_value" | "odeur_rating", value: string | number | null) => {
    setRows((prev) =>
      prev.map((row) => (row.ordre === ordre ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    updateMutation.mutate({
      productCode,
      stabilityData: rows,
    });
  };

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
        <CardTitle>Stabilité & Odeurs</CardTitle>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Enregistrer
        </Button>
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
                      onChange={(e) => updateRow(row.ordre, "ph_value", e.target.value)}
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
