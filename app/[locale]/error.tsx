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
    <div className="min-h-screen flex items-center justify-center bg-cream-light dark:bg-dark px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
          <span className="text-2xl text-red-600 dark:text-red-400">!</span>
        </div>
        <h2 className="font-playfair tracking-wide text-2xl text-dark dark:text-cream-light mb-3">
          Une erreur est survenue
        </h2>
        <p className="text-dark/60 dark:text-cream-light/50 mb-6">
          Nous nous excusons pour ce désagrément. Veuillez réessayer.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <pre className="text-left text-xs bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 overflow-auto max-h-40 text-red-800 dark:text-red-300">
            {error?.message || "Unknown error"}
            {error?.digest && `\nDigest: ${error.digest}`}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="peach" className="rounded-full px-6">
            Réessayer
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="rounded-full px-6 border-brown/15 dark:border-brown/10 text-dark dark:text-cream-light"
          >
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
