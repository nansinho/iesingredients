"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  aspect?: "square" | "video" | "banner";
}

export function ImageUpload({
  value,
  onChange,
  bucket = "product-images",
  folder = "uploads",
  label = "Image",
  aspect = "video",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Taille max : 5 Mo");
      return;
    }

    setIsUploading(true);
    setProgress(20);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      setProgress(50);

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      setProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      setProgress(100);
      toast.success("Image uploadée");
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
  }, [uploadFile]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--brand-primary)]">{label}</label>

      {value ? (
        <div className={cn("relative rounded-xl overflow-hidden border border-gray-200 group", aspectClass)}>
          <Image
            src={value}
            alt="Preview"
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
              <p className="text-sm text-[var(--brand-secondary)]">Upload en cours...</p>
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
                  ou <span className="text-[var(--brand-accent)] font-medium">parcourir</span> — PNG, JPG, WebP (max 5 Mo)
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
