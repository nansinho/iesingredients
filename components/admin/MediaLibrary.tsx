"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useRef } from "react";
import imageCompression from "browser-image-compression";
import {
  Search,
  Upload,
  Trash2,
  Check,
  ImageIcon,
  Loader2,
  FolderOpen,
  X,
  Sparkles,
  CheckSquare,
  Square,
  LayoutGrid,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  width: number;
  height: number;
  alt_text: string;
  description: string;
  folder: string;
  created_at: string;
}

interface MediaLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, alt: string) => void;
  onMultiSelect?: (images: { src: string; alt: string }[]) => void;
  folder?: string;
  standalone?: boolean;
  defaultMultiSelect?: boolean;
}

const FOLDERS = [
  { value: "", label: "Tous" },
  { value: "blog", label: "Blog" },
  { value: "cosmetique_fr", label: "Cosmétiques" },
  { value: "parfum_fr", label: "Parfums" },
  { value: "aromes_fr", label: "Arômes" },
  { value: "uploads", label: "Uploads" },
];

export function MediaLibrary({ open, onClose, onSelect, onMultiSelect, folder: initialFolder, standalone, defaultMultiSelect }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState(initialFolder || "");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [editingAlt, setEditingAlt] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [multiSelect, setMultiSelect] = useState(defaultMultiSelect || false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkAnalyzing, setBulkAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = (supabase.from("media") as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (folder) query = query.eq("folder", folder);
    if (search) query = query.ilike("file_name", `%${search}%`);

    const { data } = await query;
    setMedia(data || []);
    setLoading(false);
  }, [folder, search]);

  useEffect(() => {
    if (open || standalone) fetchMedia();
  }, [open, standalone, fetchMedia]);

  // Exit multi-select mode when closing
  useEffect(() => {
    if (!open && !standalone) {
      setMultiSelect(false);
      setSelectedIds(new Set());
    }
  }, [open, standalone]);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      try {
        // Compress
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
          fileType: "image/webp" as const,
        });

        const webpName = file.name.replace(/\.[^.]+$/, ".webp");
        const webpFile = new File([compressed], webpName, { type: "image/webp" });

        // Get dimensions
        const dims = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = document.createElement("img");
          img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(img.src); };
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = URL.createObjectURL(file);
        });

        // Upload
        const targetFolder = folder || "uploads";
        const fileName = `${targetFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, webpFile, { upsert: true, contentType: "image/webp" });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        // Generate alt text via AI
        let altText = "";
        try {
          const altForm = new FormData();
          altForm.append("file", webpFile);
          altForm.append("altOnly", "true");
          const altRes = await fetch("/api/extract-pdf", { method: "POST", body: altForm });
          if (altRes.ok) {
            const altData = await altRes.json();
            altText = altData.alt || "";
          }
        } catch {
          // Non-critical: alt text generation is optional
        }

        // Track
        await (supabase.from("media") as any).insert({
          file_name: webpName,
          file_url: publicUrl,
          file_size: webpFile.size,
          file_type: "image/webp",
          width: dims.width,
          height: dims.height,
          folder: targetFolder,
          alt_text: altText,
          description: "",
        });
      } catch {
        toast.error(`Erreur upload: ${file.name}`);
      }
    }

    setIsUploading(false);
    toast.success("Images uploadées");
    fetchMedia();
  };

  const handleDelete = async (item: MediaItem) => {
    const supabase = createClient();
    await (supabase.from("media") as any).delete().eq("id", item.id);
    setMedia((prev) => prev.filter((m) => m.id !== item.id));
    if (selected?.id === item.id) setSelected(null);
    toast.success("Supprimé");
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    const supabase = createClient();

    const ids = Array.from(selectedIds);
    await (supabase.from("media") as any).delete().in("id", ids);

    setMedia((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    if (selected && selectedIds.has(selected.id)) setSelected(null);
    setSelectedIds(new Set());
    setBulkDeleting(false);
    toast.success(`${ids.length} fichier${ids.length > 1 ? "s" : ""} supprimé${ids.length > 1 ? "s" : ""}`);
  };

  const handleSaveMeta = async () => {
    if (!selected) return;
    const supabase = createClient();
    await (supabase.from("media") as any)
      .update({ alt_text: editingAlt, description: editingDesc })
      .eq("id", selected.id);
    setMedia((prev) =>
      prev.map((m) =>
        m.id === selected.id ? { ...m, alt_text: editingAlt, description: editingDesc } : m
      )
    );
    toast.success("Métadonnées mises à jour");
  };

  // Analyze a single image with AI
  const handleAnalyzeOne = async (item: MediaItem) => {
    setAnalyzingIds((prev) => new Set(prev).add(item.id));

    try {
      // Fetch the image and send to AI for analysis
      const res = await fetch(item.file_url);
      const blob = await res.blob();
      const file = new File([blob], item.file_name || "image.jpg", { type: blob.type || "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("altOnly", "false");
      formData.append("analyzeMedia", "true");

      const aiRes = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (!aiRes.ok) throw new Error("Erreur analyse IA");
      const data = await aiRes.json();

      // Update in database
      const supabase = createClient();
      await (supabase.from("media") as any)
        .update({
          file_name: data.title || item.file_name,
          alt_text: data.alt || "",
          description: data.description || "",
        })
        .eq("id", item.id);

      // Update local state
      setMedia((prev) =>
        prev.map((m) =>
          m.id === item.id
            ? { ...m, file_name: data.title || m.file_name, alt_text: data.alt || "", description: data.description || "" }
            : m
        )
      );

      if (selected?.id === item.id) {
        setEditingAlt(data.alt || "");
        setEditingDesc(data.description || "");
      }

      toast.success("Image analysée par l'IA");
    } catch {
      toast.error("Erreur lors de l'analyse IA");
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  // Bulk analyze all images without alt text
  const handleBulkAnalyze = async () => {
    const toAnalyze = media.filter((m) => !m.alt_text);
    if (toAnalyze.length === 0) {
      toast.info("Toutes les images ont déjà un texte alternatif");
      return;
    }

    setBulkAnalyzing(true);
    let done = 0;

    for (const item of toAnalyze) {
      await handleAnalyzeOne(item);
      done++;
      if (done % 3 === 0) {
        toast.info(`Analyse en cours... ${done}/${toAnalyze.length}`);
      }
    }

    setBulkAnalyzing(false);
    toast.success(`${done} image${done > 1 ? "s" : ""} analysée${done > 1 ? "s" : ""}`);
  };

  const handleSelect = (item: MediaItem) => {
    if (multiSelect) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
      return;
    }
    setSelected(item);
    setEditingAlt(item.alt_text || "");
    setEditingDesc(item.description || "");
  };

  const toggleMultiSelect = () => {
    setMultiSelect((prev) => {
      if (prev) {
        setSelectedIds(new Set());
      }
      return !prev;
    });
    setSelected(null);
  };

  const unanalyzedCount = media.filter((m) => !m.alt_text).length;

  if (!open && !standalone) return null;

  const header = (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-[#FAFAF8] shrink-0">
      <div className="flex items-center gap-3">
        <FolderOpen className="w-5 h-5 text-brand-accent" />
        <h2 className="text-lg font-semibold text-brand-primary">Médiathèque</h2>
        <span className="text-sm text-brand-secondary/50">{media.length} fichiers</span>
        {unanalyzedCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
            {unanalyzedCount} sans ALT
          </span>
        )}
      </div>
      {!standalone && (
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}
    </div>
  );

  const content = (
    <>
      {header}
      <div className="flex flex-1 min-h-0">
        {/* Main grid */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-1">
              {FOLDERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFolder(f.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    folder === f.value
                      ? "bg-brand-primary text-white"
                      : "text-brand-secondary/60 hover:bg-gray-100"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Multi-select toggle */}
              <Button
                size="sm"
                variant={multiSelect ? "default" : "outline"}
                onClick={toggleMultiSelect}
                className={cn(
                  "rounded-lg gap-1.5 text-xs",
                  multiSelect && "bg-brand-primary text-white"
                )}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Sélection
              </Button>

              {/* Bulk analyze */}
              {unanalyzedCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkAnalyze}
                  disabled={bulkAnalyzing}
                  className="rounded-lg gap-1.5 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  {bulkAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Analyser tout ({unanalyzedCount})
                </Button>
              )}

              {/* Bulk delete */}
              {multiSelect && selectedIds.size > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="rounded-lg gap-1.5 text-xs text-red-500 border-red-200 hover:bg-red-50"
                >
                  {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Supprimer ({selectedIds.size})
                </Button>
              )}

              {/* Insert grid */}
              {multiSelect && selectedIds.size >= 2 && onMultiSelect && (
                <Button
                  size="sm"
                  onClick={() => {
                    const selected = media.filter((m) => selectedIds.has(m.id));
                    onMultiSelect(selected.map((m) => ({ src: m.file_url, alt: m.alt_text || "" })));
                    onClose();
                  }}
                  className="rounded-lg gap-1.5 text-xs bg-brand-accent text-white hover:bg-brand-accent-hover"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Insérer grille ({selectedIds.size})
                </Button>
              )}

              {/* Upload */}
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-brand-accent text-white hover:bg-brand-accent-hover rounded-lg gap-1.5 shrink-0"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
              </div>
            ) : media.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-brand-secondary/40">
                <ImageIcon className="w-10 h-10 mb-2" />
                <p className="text-sm">Aucun media trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {media.map((item) => {
                  const isSelected = multiSelect ? selectedIds.has(item.id) : selected?.id === item.id;
                  const isAnalyzing = analyzingIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer group transition-all hover:shadow-md",
                        isSelected
                          ? "border-brand-accent ring-2 ring-brand-accent/20"
                          : "border-transparent hover:border-gray-200"
                      )}
                    >
                      <img
                        src={item.file_url}
                        alt={item.alt_text || item.file_name}
                        className="w-full h-full object-cover"
                      />

                      {/* Multi-select checkbox */}
                      {multiSelect && (
                        <div className="absolute top-2 left-2 w-6 h-6 rounded bg-black/50 flex items-center justify-center">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-brand-accent" />
                          ) : (
                            <Square className="w-5 h-5 text-white" />
                          )}
                        </div>
                      )}

                      {/* Single select check */}
                      {!multiSelect && isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      {/* Analyzing spinner */}
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}

                      {/* No ALT badge */}
                      {!item.alt_text && !isAnalyzing && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-[10px] text-white font-medium">
                          No ALT
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Details panel */}
        {selected && !multiSelect && (
          <div className="w-72 border-l bg-[#FAFAF8] flex flex-col shrink-0">
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img src={selected.file_url} alt="" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-1 text-xs text-brand-secondary/60">
                <p className="font-medium text-brand-primary text-sm truncate">{selected.file_name}</p>
                <p>{selected.width}x{selected.height}px — {(selected.file_size / 1024).toFixed(0)} Ko</p>
                <p>{new Date(selected.created_at).toLocaleDateString("fr-FR")}</p>
              </div>

              {/* AI Analyze button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAnalyzeOne(selected)}
                disabled={analyzingIds.has(selected.id)}
                className="w-full rounded-lg gap-1.5 text-xs text-brand-accent border-brand-accent/20 hover:bg-brand-accent/5"
              >
                {analyzingIds.has(selected.id) ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {selected.alt_text ? "Ré-analyser avec l'IA" : "Analyser avec l'IA"}
              </Button>

              <div className="space-y-2">
                <label className="text-xs font-medium text-brand-primary">Texte alternatif (SEO)</label>
                <Input
                  value={editingAlt}
                  onChange={(e) => setEditingAlt(e.target.value)}
                  placeholder="Description pour le SEO"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-brand-primary">Description</label>
                <textarea
                  value={editingDesc}
                  onChange={(e) => setEditingDesc(e.target.value)}
                  placeholder="Description interne..."
                  rows={2}
                  className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                />
              </div>

              <Button
                size="sm"
                onClick={handleSaveMeta}
                className="w-full bg-brand-primary text-white rounded-lg text-xs"
              >
                Enregistrer les métadonnées
              </Button>
            </div>

            {/* Actions */}
            <div className="p-4 border-t space-y-2">
              {!standalone && (
                <Button
                  size="sm"
                  onClick={() => { onSelect(selected.file_url, editingAlt); onClose(); }}
                  className="w-full bg-brand-accent text-white hover:bg-brand-accent-hover rounded-lg gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Sélectionner
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(selected)}
                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (standalone) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden" style={{ minHeight: "calc(100vh - 10rem)" }}>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 sm:inset-8 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {content}
      </div>
    </div>
  );
}
