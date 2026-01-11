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
  useProductPerformance,
  useUpdatePerformance,
  DEFAULT_PERFORMANCE_COUNT,
  type PerformanceRow,
} from "@/hooks/usePerformance";

interface PerformanceTableProps {
  productCode: string;
}

export function PerformanceTable({ productCode }: PerformanceTableProps) {
  const { data: existingData, isLoading } = useProductPerformance(productCode);
  const updateMutation = useUpdatePerformance();

  const [rows, setRows] = useState<Omit<PerformanceRow, "id" | "product_code">[]>([]);

  // Initialize rows when data loads
  useEffect(() => {
    if (existingData && existingData.length > 0) {
      // Ensure we always have 6 rows
      const existingRows = existingData.map((row) => ({
        ordre: row.ordre,
        option_name: row.option_name,
        performance_rating: row.performance_rating,
      }));

      // Fill missing rows up to 6
      const allRows = [...existingRows];
      for (let i = existingRows.length; i < DEFAULT_PERFORMANCE_COUNT; i++) {
        allRows.push({
          ordre: i + 1,
          option_name: null,
          performance_rating: null,
        });
      }

      setRows(allRows);
    } else {
      // Create 6 empty rows
      setRows(
        Array.from({ length: DEFAULT_PERFORMANCE_COUNT }, (_, i) => ({
          ordre: i + 1,
          option_name: null,
          performance_rating: null,
        }))
      );
    }
  }, [existingData]);

  const updateRow = (
    ordre: number,
    field: "option_name" | "performance_rating",
    value: string | number | null
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.ordre === ordre ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    updateMutation.mutate({
      productCode,
      performanceData: rows,
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
        <CardTitle>Options & Performance</CardTitle>
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
                <TableHead className="w-12">#</TableHead>
                <TableHead>Option</TableHead>
                <TableHead className="w-32 text-center">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.ordre}>
                  <TableCell className="text-muted-foreground">{row.ordre}</TableCell>
                  <TableCell>
                    <Input
                      value={row.option_name || ""}
                      onChange={(e) =>
                        updateRow(row.ordre, "option_name", e.target.value || null)
                      }
                      placeholder={`Option ${row.ordre}`}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <StarRatingInput
                        value={row.performance_rating}
                        onChange={(value) => updateRow(row.ordre, "performance_rating", value)}
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
          Définissez jusqu'à 6 options avec leur note de performance (1-5 étoiles).
        </p>
      </CardContent>
    </Card>
  );
}
