"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const PAGE_SIZE = 20;

export function UsersAdmin({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.company?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const supabase = createClient();

    // Upsert role
    const { error } = await (supabase.from("user_roles") as any)
      .upsert({ user_id: userId, role: newRole }, { onConflict: "user_id" });

    if (error) {
      toast.error(`Impossible de changer le rôle: ${error.message}`);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success(`Rôle modifié: ${newRole}`);
  };

  const columns = [
    {
      key: "full_name",
      label: "Nom",
      render: (item: any) => (
        <div>
          <span className="font-medium">{item.full_name || "Sans nom"}</span>
          {item.company && (
            <p className="text-xs text-gray-500">{item.company}</p>
          )}
        </div>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Rôle",
      render: (item: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleRole(item.id, item.role);
          }}
          className="gap-1.5"
        >
          {item.role === "admin" ? (
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          ) : (
            <Badge variant="secondary">
              <User className="w-3 h-3 mr-1" />
              User
            </Badge>
          )}
        </Button>
      ),
    },
    {
      key: "created_at",
      label: "Inscrit le",
      render: (item: any) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString("fr-FR")
          : "",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Utilisateurs"
        subtitle={`${users.length} comptes`}
      />

      <AdminDataTable
        data={paginated}
        columns={columns}
        idKey="id"
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Rechercher par nom, email ou entreprise..."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
