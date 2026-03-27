"use client";

import { useState, useCallback, useRef } from "react";
import { FileText, Upload, Loader2, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PDFImportProps {
  onImport: (mapping: Record<string, string>) => void;
  onClose: () => void;
}

const STEPS = [
  "Extraction du texte du PDF...",
  "Analyse IA du contenu...",
  "Structuration et mise en forme...",
  "Traduction en anglais...",
];

export function PDFImport({ onImport, onClose }: PDFImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        toast.error("Veuillez sélectionner un fichier PDF");
        return;
      }

      setIsLoading(true);
      setStep(0);

      // Animate steps
      const stepInterval = setInterval(() => {
        setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
      }, 1500);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        });

        clearInterval(stepInterval);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erreur d'extraction");
        }

        const data = await res.json();

        if (!data.fields) {
          throw new Error("Aucun contenu structuré retourné");
        }

        setIsDone(true);

        // Small delay to show success state
        setTimeout(() => {
          onImport(data.fields);
          onClose();
          toast.success(
            `Article importé depuis "${file.name}" — ${data.pages} page${data.pages > 1 ? "s" : ""}`
          );
        }, 800);
      } catch (err) {
        clearInterval(stepInterval);
        setIsLoading(false);
        toast.error(
          err instanceof Error ? err.message : "Erreur lors de l'import"
        );
      }
    },
    [onImport, onClose]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-[#FAFAF8]">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[var(--brand-accent)]" />
              <h2 className="text-lg font-semibold text-[var(--brand-primary)]">
                Importer un PDF
              </h2>
            </div>
            {!isLoading && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          <div className="p-6">
            {/* Upload zone */}
            {!isLoading && !isDone && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl border-2 border-dashed border-gray-200 py-12 px-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-accent)]/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[var(--brand-accent)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--brand-primary)]">
                    Glissez un PDF ou cliquez pour sélectionner
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Communiqué de presse, article, document...
                  </p>
                  <p className="text-xs text-gray-400">
                    Le contenu sera analysé et l&apos;article pré-rempli
                    automatiquement
                  </p>
                </div>
              </div>
            )}

            {/* Loading state with steps */}
            {isLoading && !isDone && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="w-10 h-10 text-[var(--brand-accent)] animate-spin mb-6" />
                <div className="space-y-3 w-full max-w-xs">
                  {STEPS.map((label, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        i <= step ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {i < step ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : i === step ? (
                        <Loader2 className="w-4 h-4 text-[var(--brand-accent)] animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
                      )}
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Done state */}
            {isDone && (
              <div className="flex flex-col items-center py-10">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-sm font-medium text-[var(--brand-primary)]">
                  Article importé avec succès
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
