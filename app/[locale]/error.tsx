"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl">!</span>
        </div>
        <h2 className="font-serif text-2xl text-forest-900 mb-3">
          Une erreur est survenue
        </h2>
        <p className="text-forest-600 mb-6">
          Nous nous excusons pour ce désagrément. Veuillez réessayer.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <pre className="text-left text-xs bg-red-50 border border-red-200 rounded-xl p-4 mb-6 overflow-auto max-h-40 text-red-800">
            {error?.message || "Unknown error"}
            {error?.digest && `\nDigest: ${error.digest}`}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="bg-forest-900 hover:bg-forest-800 text-white rounded-full px-6">
            Réessayer
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="rounded-full px-6 border-forest-300"
          >
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
