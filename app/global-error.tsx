"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "#faf8f5",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <h2 style={{ fontSize: "1.5rem", color: "#0a2e1f", marginBottom: "0.75rem" }}>
              Une erreur est survenue
            </h2>
            <p style={{ color: "#4a6e5c", marginBottom: "1.5rem" }}>
              Veuillez rafraîchir la page ou revenir à l&apos;accueil.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#0a2e1f",
                  color: "white",
                  border: "none",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Réessayer
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "transparent",
                  color: "#0a2e1f",
                  border: "1px solid #c4d1ca",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Accueil
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
