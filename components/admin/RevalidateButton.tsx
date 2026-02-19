"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function RevalidateButton() {
  const [loading, setLoading] = useState(false);

  const handleRevalidate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      if (res.ok) {
        toast.success("Cache revalidé avec succès");
      } else {
        toast.error("Erreur lors de la revalidation");
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRevalidate}
      disabled={loading}
      className="px-4 py-2 bg-forest-900 text-white text-sm rounded-lg hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      {loading ? "Revalidation..." : "Revalider"}
    </button>
  );
}
