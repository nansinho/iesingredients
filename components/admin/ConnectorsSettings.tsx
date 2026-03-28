"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Eye, EyeOff, Loader2, Trash2, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Connector {
  id: string;
  name: string;
  description: string;
  logo: string;
  keyPrefix: string;
  placeholder: string;
  docsUrl: string;
}

const connectors: Connector[] = [
  {
    id: "claude",
    name: "Claude (Anthropic)",
    description: "Génération d'articles, traduction automatique, suggestions SEO",
    logo: "/images/Connecteurs/Claude_AI_logo.svg",
    keyPrefix: "sk-ant-",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Modèles GPT, génération d'images, embeddings",
    logo: "/images/Connecteurs/OpenAI_Logo.svg",
    keyPrefix: "sk-",
    placeholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
];

export function ConnectorsSettings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [keys, setKeys] = useState<Record<string, { value: string; saved: boolean; testing: boolean }>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

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
    <div className="space-y-3">
      {connectors.map((connector) => {
        const entry = keys[connector.id];
        const isConnected = entry?.saved && entry?.value;
        const isOpen = openId === connector.id;
        const isVisible = visibility[connector.id];

        return (
          <div
            key={connector.id}
            className={cn(
              "rounded-xl border bg-white overflow-hidden transition-all duration-200",
              isOpen ? "border-brand-primary/20 shadow-sm" : "border-gray-200 hover:border-gray-300"
            )}
          >
            {/* Card Header - always visible */}
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : connector.id)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-2">
                <Image
                  src={connector.logo}
                  alt={connector.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-semibold text-sm text-brand-primary">{connector.name}</h3>
                  {isConnected ? (
                    <Badge variant="success" className="gap-1">
                      <Check className="w-3 h-3" />
                      Connecté
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Non configuré</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{connector.description}</p>
              </div>

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {/* Expandable Panel */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    {/* API Key Input */}
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 block">
                      Clé API
                    </label>
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
                          className="h-10 pr-10 font-mono text-xs rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setVisibility((prev) => ({ ...prev, [connector.id]: !prev[connector.id] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <a
                        href={connector.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-accent hover:text-brand-accent-hover font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Obtenir une clé API
                      </a>

                      <div className="flex items-center gap-2">
                        {isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeKey(connector.id)}
                            className="h-8 px-2.5 text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {isConnected && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testKey(connector.id)}
                            disabled={entry?.testing}
                            className="h-8 rounded-lg"
                          >
                            {entry?.testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Tester"}
                          </Button>
                        )}

                        {entry?.value && !entry?.saved && (
                          <Button
                            size="sm"
                            onClick={() => saveKey(connector.id)}
                            className="h-8 bg-brand-primary text-white hover:bg-brand-secondary rounded-lg"
                          >
                            Enregistrer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
