"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export function TeamAdmin({
  initialMembers,
  locale,
}: {
  initialMembers: any[];
  locale: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.role_fr?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from("team_members") as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur");
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Membre supprimé");
  };

  const columns = [
    {
      key: "name",
      label: "Nom",
      render: (item: any) => <span className="font-medium">{item.name}</span>,
    },
    { key: "role_fr", label: "Rôle" },
    { key: "email", label: "Email" },
    {
      key: "is_active",
      label: "Statut",
      render: (item: any) =>
        item.is_active !== false ? (
          <Badge className="bg-green-100 text-green-800">Actif</Badge>
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
          <Link href={`/${locale}/admin/equipe/new`}>
            <Button size="sm" className="bg-forest-900 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau membre
            </Button>
          </Link>
        }
      />

      <AdminDataTable
        data={filtered}
        columns={columns}
        idKey="id"
        editPath={`/${locale}/admin/equipe`}
        onDelete={handleDelete}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un membre..."
      />
    </>
  );
}
