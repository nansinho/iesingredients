"use client";

import { useState, useCallback, useRef } from "react";
import { FileText, Upload, Loader2, ArrowRight, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PDFImportProps {
  onImport: (mapping: Record<string, string>) => void;
  onClose: () => void;
}

const FIELDS = [
  { key: "title_fr", label: "Titre (FR)" },
  { key: "title_en", label: "Title (EN)" },
  { key: "excerpt_fr", label: "Extrait (FR)" },
  { key: "excerpt_en", label: "Excerpt (EN)" },
  { key: "content_fr", label: "Contenu (FR)" },
  { key: "content_en", label: "Content (EN)" },
  { key: "author_name", label: "Auteur" },
  { key: "meta_description", label: "Meta Description" },
];

export function PDFImport({ onImport, onClose }: PDFImportProps) {
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const extractPDF = useCallback(async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageText = content.items
          .map((item: any) => item.str || "")
          .join(" ");
        fullText += `\n--- Page ${i} ---\n${pageText}`;
      }

      setExtractedText(fullText.trim());
    } catch {
      setExtractedText("Erreur lors de l'extraction du PDF. Essayez un autre fichier.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      extractPDF(file);
    }
    e.target.value = "";
  }, [extractPDF]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      extractPDF(file);
    }
  }, [extractPDF]);

  const handleTextSelect = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    if (start !== end) {
      setSelectedText(extractedText.slice(start, end));
    }
  };

  const assignToField = (fieldKey: string) => {
    if (!selectedText) return;
    setMappings((prev) => ({ ...prev, [fieldKey]: selectedText }));
    setSelectedText("");
    setActiveField(null);
  };

  const handleImport = () => {
    // Convert plain text to basic HTML for content fields
    const processed = { ...mappings };
    if (processed.content_fr) {
      processed.content_fr = processed.content_fr
        .split("\n\n")
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
    }
    if (processed.content_en) {
      processed.content_en = processed.content_en
        .split("\n\n")
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
    }
    onImport(processed);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 sm:inset-8 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-[#FAFAF8] shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[var(--brand-accent)]" />
            <h2 className="text-lg font-semibold text-[var(--brand-primary)]">Import PDF</h2>
            {fileName && <span className="text-sm text-[var(--brand-secondary)]/50">{fileName}</span>}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left: PDF text */}
          <div className="flex-1 flex flex-col border-r min-w-0">
            {!extractedText && !isLoading ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors m-4 rounded-xl border-2 border-dashed border-gray-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-accent)]/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[var(--brand-accent)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--brand-primary)]">Glissez un PDF ici</p>
                  <p className="text-xs text-[var(--brand-secondary)]/50 mt-1">
                    ou <span className="text-[var(--brand-accent)]">parcourir</span>
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex-1 flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-[var(--brand-accent)] animate-spin" />
                <p className="text-sm text-[var(--brand-secondary)]">Extraction du texte...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    Texte extrait — sélectionnez du texte puis assignez-le
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs rounded-lg"
                  >
                    Changer de PDF
                  </Button>
                </div>
                <Textarea
                  ref={textareaRef}
                  value={extractedText}
                  readOnly
                  onMouseUp={handleTextSelect}
                  className="flex-1 text-sm font-mono resize-none bg-[#FAFAF8]"
                />
                {selectedText && (
                  <div className="mt-2 p-3 rounded-lg bg-[var(--brand-accent)]/5 border border-[var(--brand-accent)]/20">
                    <p className="text-xs font-medium text-[var(--brand-primary)] mb-1">Texte sélectionné :</p>
                    <p className="text-xs text-[var(--brand-secondary)] line-clamp-2">{selectedText}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <ArrowRight className="w-3 h-3 text-[var(--brand-accent)]" />
                      {FIELDS.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => assignToField(f.key)}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                            mappings[f.key]
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-[var(--brand-accent)]/10 hover:text-[var(--brand-accent)]"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Right: Mapping */}
          <div className="w-80 flex flex-col bg-[#FAFAF8] shrink-0">
            <div className="p-4 border-b">
              <p className="text-sm font-semibold text-[var(--brand-primary)]">Mapping des champs</p>
              <p className="text-xs text-[var(--brand-secondary)]/50 mt-1">
                Sélectionnez du texte à gauche, puis assignez-le à un champ
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <button
                    onClick={() => setActiveField(activeField === f.key ? null : f.key)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                      mappings[f.key]
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-white border border-gray-200 text-[var(--brand-primary)] hover:border-[var(--brand-accent)]/30"
                    )}
                  >
                    <span className="font-medium text-xs">{f.label}</span>
                    {mappings[f.key] ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-green-600">Rempli</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMappings((prev) => { const next = { ...prev }; delete next[f.key]; return next; });
                          }}
                          className="p-0.5 rounded hover:bg-green-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", activeField === f.key && "rotate-180")} />
                    )}
                  </button>
                  {activeField === f.key && mappings[f.key] && (
                    <div className="mt-1 p-2 rounded-lg bg-white border border-gray-100 text-xs text-gray-600 line-clamp-3">
                      {mappings[f.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t space-y-2">
              <Button
                onClick={handleImport}
                disabled={Object.keys(mappings).length === 0}
                className="w-full bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-hover)] rounded-lg gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                Importer ({Object.keys(mappings).length} champs)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
