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
  folder?: string;
}

const FOLDERS = [
  { value: "", label: "Tous" },
  { value: "blog", label: "Blog" },
  { value: "cosmetique_fr", label: "Cosmétiques" },
  { value: "parfum_fr", label: "Parfums" },
  { value: "aromes_fr", label: "Arômes" },
  { value: "uploads", label: "Uploads" },
];

export function MediaLibrary({ open, onClose, onSelect, folder: initialFolder }: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState(initialFolder || "");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [editingAlt, setEditingAlt] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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
    if (open) fetchMedia();
  }, [open, fetchMedia]);

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

        // Track
        await (supabase.from("media") as any).insert({
          file_name: webpName,
          file_url: publicUrl,
          file_size: webpFile.size,
          file_type: "image/webp",
          width: dims.width,
          height: dims.height,
          folder: targetFolder,
          alt_text: "",
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

  const handleSelect = (item: MediaItem) => {
    setSelected(item);
    setEditingAlt(item.alt_text || "");
    setEditingDesc(item.description || "");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 sm:inset-8 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-[#FAFAF8] shrink-0">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-[var(--brand-accent)]" />
            <h2 className="text-lg font-semibold text-[var(--brand-primary)]">Médiathèque</h2>
            <span className="text-sm text-[var(--brand-secondary)]/50">{media.length} fichiers</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Main grid */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
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
                        ? "bg-[var(--brand-primary)] text-white"
                        : "text-[var(--brand-secondary)]/60 hover:bg-gray-100"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-hover)] rounded-lg gap-1.5 shrink-0"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload
              </Button>
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
                  <Loader2 className="w-6 h-6 text-[var(--brand-accent)] animate-spin" />
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-[var(--brand-secondary)]/40">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-sm">Aucun media trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer group transition-all hover:shadow-md",
                        selected?.id === item.id
                          ? "border-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]/20"
                          : "border-transparent hover:border-gray-200"
                      )}
                    >
                      <img
                        src={item.file_url}
                        alt={item.alt_text || item.file_name}
                        className="w-full h-full object-cover"
                      />
                      {selected?.id === item.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--brand-accent)] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      {!item.alt_text && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-[10px] text-white font-medium">
                          No ALT
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details panel */}
          {selected && (
            <div className="w-72 border-l bg-[#FAFAF8] flex flex-col shrink-0">
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img src={selected.file_url} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="space-y-1 text-xs text-[var(--brand-secondary)]/60">
                  <p className="font-medium text-[var(--brand-primary)] text-sm truncate">{selected.file_name}</p>
                  <p>{selected.width}x{selected.height}px — {(selected.file_size / 1024).toFixed(0)} Ko</p>
                  <p>{new Date(selected.created_at).toLocaleDateString("fr-FR")}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--brand-primary)]">Texte alternatif (SEO)</label>
                  <Input
                    value={editingAlt}
                    onChange={(e) => setEditingAlt(e.target.value)}
                    placeholder="Description pour le SEO"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--brand-primary)]">Description</label>
                  <textarea
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                    placeholder="Description interne..."
                    rows={2}
                    className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--brand-accent)]"
                  />
                </div>

                <Button
                  size="sm"
                  onClick={handleSaveMeta}
                  className="w-full bg-[var(--brand-primary)] text-white rounded-lg text-xs"
                >
                  Enregistrer les métadonnées
                </Button>
              </div>

              {/* Actions */}
              <div className="p-4 border-t space-y-2">
                <Button
                  size="sm"
                  onClick={() => { onSelect(selected.file_url, editingAlt); onClose(); }}
                  className="w-full bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-hover)] rounded-lg gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Sélectionner
                </Button>
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
      </div>
    </div>
  );
}
