import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, Check, AlertCircle, X, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSmartImport, smartParseCSV, SmartParseResult, ProductType } from "@/hooks/useSmartImport";
import { cn } from "@/lib/utils";

interface SmartCSVImportProps {
  defaultProductType?: ProductType;
  onSuccess?: () => void;
  onClose?: () => void;
}

type ImportStep = "upload" | "preview" | "mapping" | "importing" | "success";

export function SmartCSVImport({ 
  defaultProductType = "parfum", 
  onSuccess,
  onClose 
}: SmartCSVImportProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<SmartParseResult | null>(null);
  const [productType, setProductType] = useState<ProductType>(defaultProductType);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const { importData, isImporting, progress } = useSmartImport();

  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = smartParseCSV(text);
      setParseResult(result);
      
      // Auto-detect product type
      if (result.detectedType) {
        setProductType(result.detectedType);
      }
      
      setStep("preview");
    };
    reader.readAsText(file, "UTF-8");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
      handleFileRead(droppedFile);
    }
  }, [handleFileRead]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileRead(selectedFile);
    }
  }, [handleFileRead]);

  const handleImport = async () => {
    if (!parseResult) return;
    
    setStep("importing");
    const result = await importData(parseResult, productType);
    setImportResult(result);
    
    if (result.success) {
      setStep("success");
      onSuccess?.();
    } else {
      setStep("preview"); // Go back to preview to show errors
    }
  };

  const reset = () => {
    setStep("upload");
    setFile(null);
    setParseResult(null);
    setImportResult(null);
  };

  // Upload Step
  if (step === "upload") {
    return (
      <div className="space-y-4">
        <div
          className={cn(
            "rounded-lg p-8 text-center transition-all bg-muted/30",
            isDragOver
              ? "bg-primary/10"
              : "hover:bg-muted/50"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Glissez-déposez votre fichier CSV ici
          </p>
          <p className="text-xs text-muted-foreground mb-4">ou</p>
          <label>
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Parcourir
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Import intelligent</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Détection automatique des colonnes, même avec des noms dupliqués. 
                  Synchronise automatiquement les données de performance et stabilité.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preview Step
  if (step === "preview" && parseResult) {
    return (
      <div className="space-y-4">
        {/* File info */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">{file?.name}</p>
              <p className="text-xs text-muted-foreground">
                {parseResult.products.length} produits détectés
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={reset}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Detection summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{parseResult.products.length}</p>
              <p className="text-xs text-muted-foreground">Produits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-500">{parseResult.performances.length}</p>
              <p className="text-xs text-muted-foreground">Performances</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-500">{parseResult.stabilities.length}</p>
              <p className="text-xs text-muted-foreground">Stabilités</p>
            </CardContent>
          </Card>
        </div>

        {/* Product type selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Type de produit:</span>
          <Select value={productType} onValueChange={(v) => setProductType(v as ProductType)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parfum">Parfum</SelectItem>
              <SelectItem value="cosmetique">Cosmétique</SelectItem>
              <SelectItem value="arome">Arôme</SelectItem>
            </SelectContent>
          </Select>
          {parseResult.detectedType && (
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Détecté: {parseResult.detectedType}
            </Badge>
          )}
        </div>

        {/* Errors */}
        {parseResult.errors.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {parseResult.errors.length} erreur(s) détectée(s)
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <ScrollArea className="h-20">
                <ul className="text-xs text-destructive space-y-1">
                  {parseResult.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Import errors from previous attempt */}
        {importResult?.errors && importResult.errors.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                Erreurs d'import
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <ScrollArea className="h-20">
                <ul className="text-xs text-destructive space-y-1">
                  {importResult.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Preview table */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Aperçu des données</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-48">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Code</TableHead>
                    <TableHead>Nom commercial</TableHead>
                    <TableHead className="w-[80px]">Perf.</TableHead>
                    <TableHead className="w-[80px]">Stab.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parseResult.products.slice(0, 10).map((product, i) => {
                    const perfCount = parseResult.performances.filter(p => p.product_code === product.code).length;
                    const stabCount = parseResult.stabilities.filter(s => s.product_code === product.code).length;
                    
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{product.code}</TableCell>
                        <TableCell className="truncate max-w-[200px]">{product.nom_commercial}</TableCell>
                        <TableCell>
                          {perfCount > 0 && (
                            <Badge variant="secondary" className="text-xs">{perfCount}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {stabCount > 0 && (
                            <Badge variant="secondary" className="text-xs">{stabCount}</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
            {parseResult.products.length > 10 && (
              <p className="text-xs text-muted-foreground text-center py-2 border-t-0">
                ... et {parseResult.products.length - 10} autres produits
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="flex-1">
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            className="flex-1"
            disabled={parseResult.products.length === 0}
          >
            Importer {parseResult.products.length} produit(s)
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Importing Step
  if (step === "importing") {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="font-medium">Import en cours...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Veuillez patienter pendant l'import des données
          </p>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-xs text-center text-muted-foreground">{progress}%</p>
      </div>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="font-medium text-lg">Import réussi !</p>
          <p className="text-sm text-muted-foreground mt-1">
            {importResult?.imported || 0} produits ont été importés avec succès
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="flex-1">
            Importer d'autres données
          </Button>
          <Button onClick={onClose} className="flex-1">
            Fermer
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
