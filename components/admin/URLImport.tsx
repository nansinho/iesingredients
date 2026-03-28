"use client";

import { useState } from "react";
import { Globe, Loader2, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface URLImportProps {
  onImport: (mapping: Record<string, string>) => void;
  onClose: () => void;
}

const URL_STEPS = [
  "Récupération de la page web...",
  "Extraction du contenu et des images...",
  "Analyse IA et optimisation SEO...",
  "Traduction en anglais...",
];

export function URLImport({ onImport, onClose }: URLImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [url, setUrl] = useState("");

  const handleImport = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("Veuillez entrer une URL");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      toast.error("URL invalide");
      return;
    }

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast.error("L'URL doit commencer par http:// ou https://");
      return;
    }

    setIsLoading(true);
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep((s) => (s < URL_STEPS.length - 1 ? s + 1 : s));
    }, 2000);

    try {
      const res = await fetch("/api/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
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

      console.log("[URL Import] API response debug:", data._debug);

      setIsDone(true);

      setTimeout(() => {
        onImport(data.fields);
        onClose();
        toast.success(`Article importé depuis l'URL`);
      }, 800);
    } catch (err) {
      clearInterval(stepInterval);
      setIsLoading(false);
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de l'import"
      );
    }
  };

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
              <Globe className="w-5 h-5 text-brand-accent" />
              <h2 className="text-lg font-semibold text-brand-primary">
                Importer depuis une URL
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
            {/* URL input */}
            {!isLoading && !isDone && (
              <div className="space-y-4">
                <div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleImport(); }}
                    placeholder="https://exemple.com/article..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-accent focus:outline-none text-sm transition-colors"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    L&apos;IA extraira le contenu, récupérera les images et créera un article optimisé SEO
                  </p>
                </div>
                <button
                  onClick={handleImport}
                  className="w-full py-3 rounded-xl bg-brand-accent text-white font-medium text-sm hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Importer l&apos;article
                </button>
              </div>
            )}

            {/* Loading state with steps */}
            {isLoading && !isDone && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="w-10 h-10 text-brand-accent animate-spin mb-6" />
                <div className="space-y-3 w-full max-w-xs">
                  {URL_STEPS.map((label, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        i <= step ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {i < step ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : i === step ? (
                        <Loader2 className="w-4 h-4 text-brand-accent animate-spin shrink-0" />
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
                <p className="text-sm font-medium text-brand-primary">
                  Article importé avec succès
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
