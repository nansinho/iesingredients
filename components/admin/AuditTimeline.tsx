"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  user_name: string | null;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_label: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const actionConfig: Record<string, { icon: typeof Plus; label: string; color: string; bg: string }> = {
  create: { icon: Plus, label: "Création", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  update: { icon: Pencil, label: "Modification", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  delete: { icon: Trash2, label: "Suppression", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const entityLabels: Record<string, string> = {
  blog_article: "Article",
  team_member: "Membre",
  product: "Produit",
  category: "Catégorie",
  user_role: "Rôle utilisateur",
};

const filterOptions = [
  { value: "", label: "Tout" },
  { value: "blog_article", label: "Articles" },
  { value: "product", label: "Produits" },
  { value: "team_member", label: "Équipe" },
  { value: "category", label: "Catégories" },
  { value: "user_role", label: "Utilisateurs" },
];

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD < 7) return `Il y a ${diffD}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.split(" ").filter(Boolean);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function AuditTimeline() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filter) params.set("entity_type", filter);
      const res = await fetch(`/api/audit?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setFilter(opt.value); setPage(1); }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filter === opt.value
                ? "bg-brand-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Aucune activité enregistrée
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const config = actionConfig[log.action] || actionConfig.update;
            const ActionIcon = config.icon;
            const entityLabel = entityLabels[log.entity_type] || log.entity_type;

            return (
              <div key={log.id} className="flex gap-3 py-3 group">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                    {getInitials(log.user_name, log.user_email)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm">
                      <span className="font-semibold text-brand-primary">
                        {log.user_name || log.user_email}
                      </span>
                      <span className="text-gray-500"> a </span>
                      <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border", config.bg)}>
                        <ActionIcon className="w-3 h-3" />
                        {config.label.toLowerCase()}
                      </span>
                      <span className="text-gray-500"> {entityLabel.toLowerCase()} </span>
                      {log.entity_label && (
                        <span className="font-medium text-brand-primary">« {log.entity_label} »</span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0 mt-0.5">
                      {timeAgo(log.created_at)}
                    </span>
                  </div>

                  {/* Details */}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 font-mono">
                      {Object.entries(log.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-400">{key}:</span>{" "}
                          <span className="text-gray-700">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">Page {page} / {totalPages}</p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-7 w-7 p-0 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="h-7 w-7 p-0 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
