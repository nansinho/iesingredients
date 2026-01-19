import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ImportCSVProps {
  onImport: (data: Record<string, unknown>[]) => Promise<void>;
  expectedColumns?: string[];
  columnMappings?: Record<string, string>;
  isLoading?: boolean;
}

interface ParsedData {
  headers: string[];
  rows: Record<string, string>[];
  errors: string[];
}

export function ImportCSV({
  onImport,
  expectedColumns = [],
  columnMappings = {},
  isLoading = false,
}: ImportCSVProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

  const parseFile = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, string>[];
        const errors: string[] = [];

        // Check for parsing errors
        if (results.errors.length > 0) {
          results.errors.forEach((err) => {
            errors.push(`Ligne ${err.row}: ${err.message}`);
          });
        }

        // Validate required columns
        if (expectedColumns.length > 0) {
          const missingColumns = expectedColumns.filter(
            (col) =>
              !headers.includes(col) &&
              !Object.keys(columnMappings).some((key) => headers.includes(key) && columnMappings[key] === col)
          );
          if (missingColumns.length > 0) {
            errors.push(`Colonnes manquantes: ${missingColumns.join(", ")}`);
          }
        }

        setParsedData({ headers, rows, errors });
        setImportStatus("idle");
      },
      error: (error) => {
        setParsedData({
          headers: [],
          rows: [],
          errors: [`Erreur de parsing: ${error.message}`],
        });
      },
    });
  }, [expectedColumns, columnMappings]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        parseFile(file);
      }
    },
    [parseFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        parseFile(file);
      }
    },
    [parseFile]
  );

  const handleImport = async () => {
    if (!parsedData || parsedData.rows.length === 0) return;

    try {
      // Apply column mappings
      const mappedData = parsedData.rows.map((row) => {
        const mapped: Record<string, unknown> = {};
        Object.entries(row).forEach(([key, value]) => {
          const mappedKey = columnMappings[key] || key;
          mapped[mappedKey] = value || null;
        });
        return mapped;
      });

      await onImport(mappedData);
      setImportStatus("success");
    } catch {
      setImportStatus("error");
    }
  };

  const reset = () => {
    setParsedData(null);
    setImportStatus("idle");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (importStatus === "success") {
    return (
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Import réussi !
            </h3>
            <p className="text-muted-foreground mb-4">
              {parsedData?.rows.length} produits ont été importés.
            </p>
            <Button onClick={reset}>Importer un autre fichier</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (parsedData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Aperçu de l'import
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={reset}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{parsedData.headers.length} colonnes</Badge>
            <Badge variant="secondary">{parsedData.rows.length} lignes</Badge>
            {parsedData.errors.length > 0 && (
              <Badge variant="destructive">{parsedData.errors.length} erreurs</Badge>
            )}
          </div>

          {/* Errors */}
          {parsedData.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {parsedData.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {parsedData.errors.length > 5 && (
                    <li>... et {parsedData.errors.length - 5} autres erreurs</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview table */}
          <ScrollArea className="h-64 rounded-md border border-forest-100">
            <Table>
              <TableHeader>
                <TableRow>
                  {parsedData.headers.slice(0, 6).map((header) => (
                    <TableHead key={header} className="whitespace-nowrap">
                      {header}
                    </TableHead>
                  ))}
                  {parsedData.headers.length > 6 && (
                    <TableHead>+{parsedData.headers.length - 6} cols</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedData.rows.slice(0, 10).map((row, i) => (
                  <TableRow key={i}>
                    {parsedData.headers.slice(0, 6).map((header) => (
                      <TableCell key={header} className="max-w-32 truncate">
                        {row[header] || "-"}
                      </TableCell>
                    ))}
                    {parsedData.headers.length > 6 && <TableCell>...</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {parsedData.rows.length > 10 && (
            <p className="text-sm text-muted-foreground text-center">
              Affichage des 10 premières lignes sur {parsedData.rows.length}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={reset}>
              Annuler
            </Button>
            <Button
              onClick={handleImport}
              disabled={isLoading || parsedData.errors.length > 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importer {parsedData.rows.length} produits
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-forest-200 hover:border-primary/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "p-4 rounded-full transition-colors",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}
        >
          <FileSpreadsheet
            className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-1">
            Glissez-déposez votre fichier CSV
          </h3>
          <p className="text-sm text-muted-foreground">
            ou{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-primary hover:underline"
            >
              parcourez vos fichiers
            </button>
          </p>
        </div>

        {expectedColumns.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Colonnes attendues: {expectedColumns.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
