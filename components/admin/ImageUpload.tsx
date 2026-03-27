"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { Upload, X, ImageIcon, Loader2, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  altValue?: string;
  bucket?: string;
  folder?: string;
  label?: string;
  aspect?: "square" | "video" | "banner";
  showAlt?: boolean;
  onOpenLibrary?: () => void;
}

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2048,
    useWebWorker: false,
    fileType: "image/webp" as const,
  };

  try {
    const compressed = await imageCompression(file, options);
    const webpName = file.name.replace(/\.[^.]+$/, ".webp");
    return new File([compressed], webpName, { type: "image/webp" });
  } catch {
    return file;
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
}

async function trackInMediaLibrary(file: File, url: string, folder: string, dimensions: { width: number; height: number }) {
  try {
    const supabase = createClient();
    await (supabase.from("media") as ReturnType<typeof supabase.from>).insert({
      file_name: file.name,
      file_url: url,
      file_size: file.size,
      file_type: file.type,
      width: dimensions.width,
      height: dimensions.height,
      folder,
      alt_text: "",
      description: "",
    });
  } catch {
    // Silently fail — media tracking is non-critical
  }
}

export function ImageUpload({
  value,
  onChange,
  onAltChange,
  altValue = "",
  bucket = "product-images",
  folder = "uploads",
  label = "Image",
  aspect = "video",
  showAlt = true,
  onOpenLibrary,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionSaved, setCompressionSaved] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  }[aspect];

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont acceptées");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Taille max : 10 Mo");
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setCompressionSaved(null);

    try {
      // 1. Get original dimensions
      const dimensions = await getImageDimensions(file);
      setProgress(20);

      // 2. Compress image
      const originalSize = file.size;
      const compressed = await compressImage(file);
      const savedPercent = Math.round((1 - compressed.size / originalSize) * 100);
      if (savedPercent > 5) {
        setCompressionSaved(`${savedPercent}% réduit (${(originalSize / 1024).toFixed(0)}→${(compressed.size / 1024).toFixed(0)} Ko)`);
      }
      setProgress(50);

      // 3. Upload to Supabase
      const supabase = createClient();
      const ext = compressed.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressed, { upsert: true, contentType: compressed.type });

      if (error) throw error;
      setProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // 4. Track in media library
      await trackInMediaLibrary(compressed, publicUrl, folder, dimensions);

      onChange(publicUrl);
      setProgress(100);
      toast.success("Image uploadée et optimisée");
    } catch (err) {
      toast.error("Erreur upload : " + (err instanceof Error ? err.message : "Échec"));
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [bucket, folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }, [uploadFile]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--brand-primary)]">{label}</label>
        {onOpenLibrary && (
          <button
            type="button"
            onClick={onOpenLibrary}
            className="text-xs text-[var(--brand-accent)] hover:text-[var(--brand-accent-hover)] font-medium transition-colors"
          >
            Médiathèque
          </button>
        )}
      </div>

      {value ? (
        <div className="space-y-2">
          <div className={cn("relative rounded-xl overflow-hidden border border-gray-200 group", aspectClass)}>
            <Image
              src={value}
              alt={altValue || "Preview"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-3 py-2 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Changer
                </button>
                {onOpenLibrary && (
                  <button
                    type="button"
                    onClick={onOpenLibrary}
                    className="px-3 py-2 rounded-lg bg-white text-sm font-medium text-[var(--brand-accent)] hover:bg-gray-100 transition-colors"
                  >
                    Médiathèque
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-2 rounded-lg bg-white text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Alt text for SEO */}
          {showAlt && onAltChange && (
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-[var(--brand-secondary)]/40 shrink-0" />
              <Input
                value={altValue}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Texte alternatif (SEO)"
                className="h-8 text-xs border-dashed"
              />
            </div>
          )}

          {compressionSaved && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Compression : {compressionSaved}
            </p>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "relative rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 py-10",
            isDragging
              ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/5 scale-[1.01]"
              : "border-gray-200 hover:border-[var(--brand-accent)]/50 hover:bg-[var(--brand-primary)]/[0.02]",
            isUploading && "pointer-events-none"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[var(--brand-accent)] animate-spin" />
              <p className="text-sm text-[var(--brand-secondary)]">Compression & upload...</p>
              <div className="w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand-accent)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/5 flex items-center justify-center">
                {isDragging ? (
                  <Upload className="w-6 h-6 text-[var(--brand-accent)]" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[var(--brand-secondary)]/50" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--brand-primary)]">
                  {isDragging ? "Déposez l'image ici" : "Glissez-déposez une image"}
                </p>
                <p className="text-xs text-[var(--brand-secondary)]/50 mt-1">
                  ou <span className="text-[var(--brand-accent)] font-medium">parcourir</span> — PNG, JPG, WebP (max 10 Mo)
                </p>
                <p className="text-xs text-[var(--brand-secondary)]/30 mt-0.5">
                  Auto-compressé en WebP
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
