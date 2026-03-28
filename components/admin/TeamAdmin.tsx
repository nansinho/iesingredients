"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { Plus, RefreshCw, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlidePanel } from "@/components/admin/SlidePanel";
import { TeamEditForm } from "@/components/admin/TeamEditForm";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { getDepartmentLabel } from "@/lib/constants/departments";

export function TeamAdmin({
  initialMembers,
}: {
  initialMembers: any[];
  locale?: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [creatingAll, setCreatingAll] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await (supabase.from("team_members") as any)
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setMembers(data);
  }, []);

  const filtered = members.filter(
    (m) =>
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.role_fr?.toLowerCase().includes(search.toLowerCase()) ||
      m.department?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingMember(null);
    setIsNew(true);
    setPanelOpen(true);
  };

  const openEdit = (member: any) => {
    setEditingMember(member);
    setIsNew(false);
    setPanelOpen(true);
  };

  const handleSave = () => {
    setPanelOpen(false);
    refresh();
  };

  const handleDelete = async (id: string) => {
    const member = members.find((m) => m.id === id);
    const supabase = createClient();
    const { error } = await (supabase.from("team_members") as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur");
      return;
    }
    logAudit({ action: "delete", entityType: "team_member", entityId: id, entityLabel: member?.name });
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Membre supprimé");
  };

  const createAllAccounts = async () => {
    const iesMembers = members.filter(
      (m) => m.email && m.email.endsWith("@ies-ingredients.com")
    );
    if (iesMembers.length === 0) {
      toast.info("Aucun membre avec email @ies-ingredients.com trouvé");
      return;
    }

    setCreatingAll(true);
    let created = 0;
    let skipped = 0;

    for (const member of iesMembers) {
      try {
        const res = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: member.email, fullName: member.name }),
        });
        if (res.ok) {
          created++;
        } else {
          skipped++;
        }
      } catch {
        skipped++;
      }
    }

    setCreatingAll(false);
    if (created > 0) {
      toast.success(`${created} compte(s) créé(s) avec succès`);
    }
    if (skipped > 0) {
      toast.info(`${skipped} compte(s) existant(s) ou ignoré(s)`);
    }
  };

  const columns = [
    {
      key: "photo_url",
      label: "",
      render: (item: any) =>
        item.photo_url ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
            <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold">
            {(item.name || "?").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
          </div>
        ),
    },
    {
      key: "name",
      label: "Nom",
      render: (item: any) => (
        <div>
          <span className="font-medium text-brand-primary">{item.name}</span>
          <p className="text-xs text-gray-500 mt-0.5">{item.role_fr}</p>
        </div>
      ),
    },
    {
      key: "department",
      label: "Département",
      render: (item: any) =>
        item.department ? (
          <Badge variant="default">{getDepartmentLabel(item.department, "fr")}</Badge>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "email",
      label: "Email",
      render: (item: any) => (
        <span className="text-xs text-gray-600">{item.email || "—"}</span>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      render: (item: any) =>
        item.is_active !== false ? (
          <Badge variant="success" className="gap-1">Actif</Badge>
        ) : (
          <Badge variant="secondary">Inactif</Badge>
        ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Équipe"
        subtitle={`${members.length} membres`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={createAllAccounts}
              disabled={creatingAll}
              className="rounded-lg gap-2"
            >
              {creatingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Créer tous les comptes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="rounded-lg gap-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={openNew}
              className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau membre
            </Button>
          </div>
        }
      />

      <AdminDataTable
        data={filtered}
        columns={columns}
        idKey="id"
        onDelete={handleDelete}
        onRowClick={openEdit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un membre..."
      />

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={isNew ? "Nouveau membre" : `Modifier : ${editingMember?.name || ""}`}
        subtitle={isNew ? "Ajouter un membre à l'équipe" : editingMember?.role_fr || ""}
      >
        <TeamEditForm
          member={editingMember}
          isNew={isNew}
          onSave={handleSave}
          onCancel={() => setPanelOpen(false)}
        />
      </SlidePanel>
    </>
  );
}
