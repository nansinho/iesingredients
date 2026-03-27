"use client";

import { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ExtractedData {
  text: string;
  pages: number;
  fileName: string;
}

type FieldKey =
  | "title_fr"
  | "title_en"
  | "excerpt_fr"
  | "excerpt_en"
  | "content_fr"
  | "content_en"
  | "author_name"
  | "meta_description";

const FIELD_OPTIONS: { value: FieldKey | ""; label: string }[] = [
  { value: "", label: "— Ignorer —" },
  { value: "title_fr", label: "Titre (FR)" },
  { value: "title_en", label: "Title (EN)" },
  { value: "excerpt_fr", label: "Extrait (FR)" },
  { value: "excerpt_en", label: "Excerpt (EN)" },
  { value: "content_fr", label: "Contenu (FR)" },
  { value: "content_en", label: "Content (EN)" },
  { value: "author_name", label: "Auteur" },
];

interface BlogPdfImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (fields: Partial<Record<FieldKey, string>>) => void;
}

export function BlogPdfImport({
  open,
  onOpenChange,
  onImport,
}: BlogPdfImportProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [assignments, setAssignments] = useState<
    { text: string; field: FieldKey }[]
  >([]);
  const [quickAssign, setQuickAssign] = useState<FieldKey | "">("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }

    setIsExtracting(true);
    setExtracted(null);
    setAssignments([]);
    setSelectedText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Extraction failed");
      }

      const data: ExtractedData = await res.json();

      if (!data.text.trim()) {
        toast.error("Le PDF ne contient pas de texte extractible");
        return;
      }

      setExtracted(data);
      toast.success(
        `${data.pages} page${data.pages > 1 ? "s" : ""} extraite${data.pages > 1 ? "s" : ""}`
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'extraction du PDF"
      );
    } finally {
      setIsExtracting(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  const assignField = (field: FieldKey) => {
    if (!selectedText) return;
    // Remove any existing assignment for this field
    setAssignments((prev) => [
      ...prev.filter((a) => a.field !== field),
      { text: selectedText, field },
    ]);
    setSelectedText("");
    setQuickAssign("");
    window.getSelection()?.removeAllRanges();
  };

  const removeAssignment = (field: FieldKey) => {
    setAssignments((prev) => prev.filter((a) => a.field !== field));
  };

  const handleImport = () => {
    const fields: Partial<Record<FieldKey, string>> = {};
    for (const a of assignments) {
      fields[a.field] = a.text;
    }
    onImport(fields);
    onOpenChange(false);
    toast.success(`${assignments.length} champ${assignments.length > 1 ? "s" : ""} importé${assignments.length > 1 ? "s" : ""}`);
    // Reset
    setExtracted(null);
    setAssignments([]);
    setSelectedText("");
  };

  const getFieldLabel = (key: FieldKey) =>
    FIELD_OPTIONS.find((o) => o.value === key)?.label || key;

  const assignedFields = new Set(assignments.map((a) => a.field));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto p-0"
      >
        <div className="p-6 border-b border-gray-100">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--brand-accent)]" />
              Import PDF
              {extracted && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {extracted.fileName}
                </span>
              )}
            </SheetTitle>
            <SheetDescription>
              Extrayez le texte d&apos;un PDF, sélectionnez-le puis assignez-le
              aux champs de l&apos;article
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex flex-col h-[calc(100vh-10rem)]">
          {/* Upload zone */}
          {!extracted && (
            <div className="flex-1 flex items-center justify-center p-6">
              <label
                htmlFor="pdf-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/5 transition-colors"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-10 w-10 text-[var(--brand-accent)] animate-spin mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      Extraction en cours...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      Glissez un PDF ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF uniquement, max 10 Mo
                    </p>
                  </>
                )}
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isExtracting}
                />
              </label>
            </div>
          )}

          {/* Extracted content + mapping */}
          {extracted && (
            <>
              {/* Toolbar */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {selectedText ? (
                    <>
                      <span className="text-xs text-gray-500 shrink-0">
                        Texte sélectionné
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <Select
                        value={quickAssign}
                        onValueChange={(v) => {
                          if (v) assignField(v as FieldKey);
                        }}
                      >
                        <SelectTrigger className="h-8 w-48 text-xs">
                          <SelectValue placeholder="Assigner à..." />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_OPTIONS.filter(
                            (o) => o.value && !assignedFields.has(o.value as FieldKey)
                          ).map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Sélectionnez du texte ci-dessous pour l&apos;assigner à un
                      champ
                    </span>
                  )}
                </div>
                <label
                  htmlFor="pdf-upload-change"
                  className="text-xs text-[var(--brand-accent)] hover:underline cursor-pointer shrink-0"
                >
                  Changer de PDF
                  <input
                    id="pdf-upload-change"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Extracted text */}
                <div
                  className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed text-gray-800 select-text cursor-text whitespace-pre-wrap"
                  onMouseUp={handleTextSelection}
                >
                  {extracted.text}
                </div>

                {/* Field mapping sidebar */}
                <div className="w-64 border-l border-gray-100 bg-gray-50/50 overflow-y-auto p-4 space-y-3 shrink-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Mapping des champs
                  </p>

                  {FIELD_OPTIONS.filter((o) => o.value).map((option) => {
                    const assignment = assignments.find(
                      (a) => a.field === option.value
                    );
                    return (
                      <div key={option.value} className="space-y-1">
                        <Label className="text-xs text-gray-600 flex items-center gap-1.5">
                          {assignment && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          {option.label}
                        </Label>
                        {assignment ? (
                          <div className="relative group">
                            <p className="text-xs text-gray-700 bg-white rounded-lg p-2 border border-green-200 line-clamp-2">
                              {assignment.text}
                            </p>
                            <button
                              onClick={() =>
                                removeAssignment(option.value as FieldKey)
                              }
                              className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 bg-white rounded-lg p-2 border border-dashed border-gray-200">
                            Non assigné
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Import button */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {assignments.length} champ
                  {assignments.length > 1 ? "s" : ""} assigné
                  {assignments.length > 1 ? "s" : ""}
                </p>
                <Button
                  onClick={handleImport}
                  disabled={assignments.length === 0}
                  variant="accent"
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Importer ({assignments.length} champ
                  {assignments.length > 1 ? "s" : ""})
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
