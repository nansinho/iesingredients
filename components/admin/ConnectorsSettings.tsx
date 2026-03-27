"use client";

import { useState, useEffect } from "react";
import { Check, Eye, EyeOff, Loader2, Plug, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Connector {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  keyPrefix: string;
  placeholder: string;
  docsUrl: string;
  color: string;
}

function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.1 11.3c0-2.1-1.5-3.5-3.6-3.5-2.7 0-4.8 2.2-4.8 5.1 0 2.1 1.5 3.5 3.6 3.5 2.7 0 4.8-2.2 4.8-5.1zm-8.4 1.6c0-3.9 2.8-7 6.5-7 3.1 0 5.2 2.1 5.2 5.2 0 3.9-2.8 7-6.5 7-3.1 0-5.2-2.1-5.2-5.2zM4.7 18.2l1.3-6.1H4.4l.4-1.7h1.6l.6-2.8C7.5 5.5 9 4.3 11.2 4.3c.8 0 1.4.1 1.8.3l-.5 1.8c-.3-.1-.7-.2-1.2-.2-1.2 0-1.9.6-2.2 2l-.5 2.6h2.3l-.4 1.7h-2.3L6.9 18.2H4.7z" />
    </svg>
  );
}

const connectors: Connector[] = [
  {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "Génération d'articles, traduction automatique, suggestions SEO",
    logo: <ClaudeLogo className="w-8 h-8" />,
    keyPrefix: "sk-ant-",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    color: "#D97757",
  },
];

export function ConnectorsSettings() {
  const [keys, setKeys] = useState<Record<string, { value: string; saved: boolean; testing: boolean }>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("api_connectors") as any)
        .select("connector_id, api_key, is_active")
        .order("created_at", { ascending: false });

      const loaded: Record<string, { value: string; saved: boolean; testing: boolean }> = {};
      (data || []).forEach((row: { connector_id: string; api_key: string }) => {
        loaded[row.connector_id] = { value: row.api_key, saved: true, testing: false };
      });
      setKeys(loaded);
    } catch {
      // Table might not exist yet
    } finally {
      setLoading(false);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 12) return "••••••••••••";
    return key.slice(0, 10) + "••••••••••••" + key.slice(-4);
  };

  const saveKey = async (connectorId: string) => {
    const entry = keys[connectorId];
    if (!entry?.value.trim()) return;

    const supabase = createClient();

    try {
      // Upsert the key
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("api_connectors") as any)
        .upsert(
          { connector_id: connectorId, api_key: entry.value, is_active: true, updated_at: new Date().toISOString() },
          { onConflict: "connector_id" }
        );

      if (error) throw error;

      setKeys((prev) => ({
        ...prev,
        [connectorId]: { ...prev[connectorId], saved: true },
      }));
      setVisibility((prev) => ({ ...prev, [connectorId]: false }));
      toast.success("Clé API enregistrée");
    } catch (err) {
      toast.error("Erreur : " + (err instanceof Error ? err.message : "Échec"));
    }
  };

  const testKey = async (connectorId: string) => {
    const entry = keys[connectorId];
    if (!entry?.value) return;

    setKeys((prev) => ({
      ...prev,
      [connectorId]: { ...prev[connectorId], testing: true },
    }));

    try {
      const res = await fetch("/api/test-connector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connector: connectorId, apiKey: entry.value }),
      });

      if (res.ok) {
        toast.success("Connexion réussie !");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Échec de la connexion");
      }
    } catch {
      toast.error("Impossible de tester la connexion");
    } finally {
      setKeys((prev) => ({
        ...prev,
        [connectorId]: { ...prev[connectorId], testing: false },
      }));
    }
  };

  const removeKey = async (connectorId: string) => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("api_connectors") as any)
      .delete()
      .eq("connector_id", connectorId);

    setKeys((prev) => {
      const next = { ...prev };
      delete next[connectorId];
      return next;
    });
    toast.success("Clé API supprimée");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-brand-secondary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connectors.map((connector) => {
        const entry = keys[connector.id];
        const isConnected = entry?.saved && entry?.value;
        const isVisible = visibility[connector.id];

        return (
          <div
            key={connector.id}
            className={cn(
              "rounded-2xl border-2 p-6 transition-all",
              isConnected
                ? "border-green-200 bg-green-50/30"
                : "border-gray-200 bg-white hover:border-brand-accent/30"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white"
                style={{ backgroundColor: connector.color }}
              >
                {connector.logo}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-brand-primary">{connector.name}</h3>
                  {isConnected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Connecté
                    </span>
                  )}
                </div>
                <p className="text-sm text-brand-secondary/60 mb-4">{connector.description}</p>

                {/* Key Input */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={isVisible ? "text" : "password"}
                      value={isConnected && !isVisible ? maskKey(entry.value) : (entry?.value || "")}
                      onChange={(e) =>
                        setKeys((prev) => ({
                          ...prev,
                          [connector.id]: { value: e.target.value, saved: false, testing: false },
                        }))
                      }
                      onFocus={() => {
                        if (isConnected && !isVisible) {
                          setVisibility((prev) => ({ ...prev, [connector.id]: true }));
                        }
                      }}
                      placeholder={connector.placeholder}
                      className="h-11 pr-10 font-mono text-sm rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setVisibility((prev) => ({ ...prev, [connector.id]: !prev[connector.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Save */}
                  {(!entry?.saved || (entry && !entry.saved)) && entry?.value && (
                    <Button
                      onClick={() => saveKey(connector.id)}
                      className="bg-brand-primary text-white hover:bg-brand-secondary rounded-xl h-11 px-5"
                    >
                      Enregistrer
                    </Button>
                  )}

                  {/* Test */}
                  {isConnected && (
                    <Button
                      variant="outline"
                      onClick={() => testKey(connector.id)}
                      disabled={entry?.testing}
                      className="rounded-xl h-11"
                    >
                      {entry?.testing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tester"}
                    </Button>
                  )}

                  {/* Remove */}
                  {isConnected && (
                    <Button
                      variant="outline"
                      onClick={() => removeKey(connector.id)}
                      className="rounded-xl h-11 px-3 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Help link */}
                <a
                  href={connector.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-brand-accent hover:text-brand-accent-hover font-medium transition-colors"
                >
                  Obtenir une clé API →
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
