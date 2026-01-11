import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseImageUploadOptions {
  bucket?: string;
  folder?: string;
  maxSizeMB?: number;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { bucket = "product-images", folder = "", maxSizeMB = 5 } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, customPath?: string): Promise<string | null> => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image");
      return null;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`L'image ne doit pas dépasser ${maxSizeMB}MB`);
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const ext = file.name.split(".").pop() || "jpg";
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = customPath || `${folder ? folder + "/" : ""}${timestamp}-${randomStr}.${ext}`;

      // Simulate progress (Supabase doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

      clearInterval(progressInterval);

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      setProgress(100);
      return publicUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'upload";
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      // Extract path from URL
      const urlParts = url.split(`${bucket}/`);
      if (urlParts.length < 2) return false;

      const path = urlParts[1];
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
      toast.error(message);
      return false;
    }
  };

  return {
    upload,
    deleteImage,
    isUploading,
    progress,
  };
}
