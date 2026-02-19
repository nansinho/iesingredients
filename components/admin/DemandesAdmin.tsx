"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusConfig: Record<string, { icon: React.ElementType; label: string; class: string }> = {
  pending: { icon: Clock, label: "En attente", class: "bg-amber-100 text-amber-800" },
  approved: { icon: CheckCircle, label: "Approuvé", class: "bg-green-100 text-green-800" },
  rejected: { icon: XCircle, label: "Rejeté", class: "bg-red-100 text-red-800" },
  completed: { icon: Package, label: "Complété", class: "bg-blue-100 text-blue-800" },
};

export function DemandesAdmin({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [selected, setSelected] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from("sample_requests") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Erreur");
      return;
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    if (selected?.id === id) setSelected({ ...selected, status });
    toast.success(`Statut mis à jour: ${statusConfig[status]?.label || status}`);
  };

  const statusCounts = requests.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <AdminPageHeader
        title="Demandes d'échantillons"
        subtitle={`${requests.length} demandes`}
      />

      {/* Status pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full",
            filter === "all" && "bg-forest-900 hover:bg-forest-800"
          )}
        >
          Tous ({requests.length})
        </Button>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full gap-1.5",
                filter === key && "bg-forest-900 hover:bg-forest-800"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cfg.label} ({statusCounts[key] || 0})
            </Button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const config = statusConfig[req.status] || statusConfig.pending;
          const Icon = config.icon;
          const items = req.sample_request_items || [];
          return (
            <div
              key={req.id}
              onClick={() => setSelected(req)}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-forest-900">
                      {req.contact_name || "Utilisateur connecté"}
                    </span>
                    <Badge className={config.class}>
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {items.length} produit{items.length > 1 ? "s" : ""} demandé{items.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {req.contact_email || ""} &middot;{" "}
                    {req.created_at
                      ? new Date(req.created_at).toLocaleDateString("fr-FR")
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune demande</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détail de la demande</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Contact</p>
                  <p className="font-medium">{selected.contact_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selected.contact_email || "N/A"}</p>
                </div>
                {selected.company && (
                  <div>
                    <p className="text-gray-500">Entreprise</p>
                    <p className="font-medium">{selected.company}</p>
                  </div>
                )}
              </div>

              {selected.message && (
                <div>
                  <p className="text-gray-500 text-sm mb-1">Message</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selected.message}</p>
                </div>
              )}

              <div>
                <p className="text-gray-500 text-sm mb-2">Produits demandés</p>
                <div className="space-y-2">
                  {(selected.sample_request_items || []).map((item: any) => (
                    <div key={item.id} className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium">{item.product_name} ({item.product_code})</span>
                      <span>x{item.quantity || 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {["pending", "approved", "rejected", "completed"].map((s) => {
                  const cfg = statusConfig[s];
                  const Icon = cfg.icon;
                  const isCurrentStatus = selected.status === s;
                  return (
                    <Button
                      key={s}
                      size="sm"
                      variant={isCurrentStatus ? "default" : "outline"}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={isCurrentStatus}
                      className={cn(
                        "rounded-lg gap-1.5",
                        isCurrentStatus && "bg-forest-900"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {cfg.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
