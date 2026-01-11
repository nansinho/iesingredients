import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = "", className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const { upload, deleteImage, isUploading, progress } = useImageUpload({ folder });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Upload to Supabase
    const publicUrl = await upload(file);

    if (publicUrl) {
      onChange(publicUrl);
      setPreviewUrl(publicUrl);
    } else {
      // Revert on error
      setPreviewUrl(value || null);
    }

    // Clean up local URL
    URL.revokeObjectURL(localUrl);

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (value) {
      await deleteImage(value);
    }
    onChange(null);
    setPreviewUrl(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">{progress}%</p>
              </div>
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                >
                  Changer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "w-full h-48 border-2 border-dashed border-border rounded-lg",
            "flex flex-col items-center justify-center gap-2",
            "text-muted-foreground hover:text-foreground hover:border-primary/50",
            "transition-colors cursor-pointer",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin" />
              <span className="text-sm">Upload en cours... {progress}%</span>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-muted">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
              <span className="text-xs">PNG, JPG jusqu'à 5MB</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
