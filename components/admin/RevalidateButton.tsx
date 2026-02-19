"use client";

import { useState } from "react";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export function RevalidateButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleRevalidate = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Cache revalidé avec succès");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error || `Erreur ${res.status}`);
      }
    } catch {
      setStatus("error");
      setMessage("Erreur réseau. Vérifiez votre connexion.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className={`text-xs ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {status === "success" && <CheckCircle className="w-3 h-3 inline mr-1" />}
          {status === "error" && <XCircle className="w-3 h-3 inline mr-1" />}
          {message}
        </span>
      )}
      <button
        type="button"
        onClick={handleRevalidate}
        disabled={status === "loading"}
        className="px-4 py-2 bg-forest-900 text-white text-sm rounded-lg hover:bg-forest-800 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {status === "loading" ? "Revalidation..." : "Revalider"}
      </button>
    </div>
  );
}
