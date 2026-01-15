import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Loader2, HelpCircle } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StarRatingInput } from "./StarRatingInput";
import {
  useProductPerformance,
  type PerformanceRow,
} from "@/hooks/usePerformance";

export interface PerformanceTableRef {
  getData: () => Omit<PerformanceRow, "id" | "created_at" | "updated_at">[];
  hasChanges: () => boolean;
}

interface PerformanceTableProps {
  productCode: string;
  onChange?: (hasChanges: boolean) => void;
}

export const PerformanceTable = forwardRef<PerformanceTableRef, PerformanceTableProps>(
  ({ productCode, onChange }, ref) => {
    const { data: existingData, isLoading } = useProductPerformance(productCode);
    const [rows, setRows] = useState<Omit<PerformanceRow, "id" | "created_at" | "updated_at">[]>([]);
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

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
      } else if (!isLoading && !initialDataLoaded) {
        setRows(
          Array.from({ length: 6 }, (_, i) => ({
            product_code: productCode,
            ordre: i + 1,
            option_name: null,
            performance_value: null,
            performance_rating: null,
          }))
        );
        setInitialDataLoaded(true);
      }
    }, [existingData, isLoading, productCode, initialDataLoaded]);

    const updateRow = (
      ordre: number,
      field: "option_name" | "performance_value" | "performance_rating",
      value: string | number | null
    ) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.ordre === ordre) {
            if (field === "performance_value") {
              return { ...row, performance_value: value as string | null, performance_rating: value ? null : row.performance_rating };
            }
            if (field === "performance_rating") {
              return { ...row, performance_rating: value as number | null, performance_value: value ? null : row.performance_value };
            }
            if (field === "option_name") {
              return { ...row, option_name: value as string | null };
            }
          }
          return row;
        })
      );
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Performance
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Entrez une valeur texte OU une note étoiles (pas les deux)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Option</TableHead>
                  <TableHead>Valeur texte</TableHead>
                  <TableHead className="w-32 text-center">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.ordre}>
                    <TableCell>
                      <Input
                        value={row.option_name || ""}
                        onChange={(e) => updateRow(row.ordre, "option_name", e.target.value || null)}
                        placeholder={`Option ${row.ordre}`}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.performance_value || ""}
                        onChange={(e) => updateRow(row.ordre, "performance_value", e.target.value || null)}
                        placeholder="ex: Jusqu'à 3%"
                        className="h-8"
                        disabled={!!row.performance_rating}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <StarRatingInput
                          value={row.performance_rating}
                          onChange={(value) => updateRow(row.ordre, "performance_rating", value)}
                          size="md"
                          disabled={!!row.performance_value}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PerformanceTable.displayName = "PerformanceTable";
