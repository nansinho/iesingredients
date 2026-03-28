"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useCallback } from "react";
import {
  Shield, User, Users, UserPlus, Search, Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserProfileForm } from "@/components/admin/UserProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlidePanel } from "@/components/admin/SlidePanel";
import { createClient } from "@/lib/supabase/client";
import { logAudit } from "@/lib/audit";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AccountTab = "all" | "internal" | "business" | "individual";

const accountTypeBadge: Record<string, { label: string; bg: string; text: string; border: string }> = {
  internal: { label: "IES", bg: "#2E1F3D", text: "#FAF8F6", border: "#2E1F3D" },
  business: { label: "Entreprise", bg: "#B87A6A", text: "#FFFFFF", border: "#B87A6A" },
  individual: { label: "Particulier", bg: "#E0DCD5", text: "#2E1F3D", border: "#C4C0BC" },
};

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}


function timeAgo(dateStr: string): string {
  const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}

function AccountTypeBadge({ type }: { type: string }) {
  const config = accountTypeBadge[type] || accountTypeBadge.individual;
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}>
      {config.label}
    </span>
  );
}

export function UsersAdmin({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AccountTab>("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const stats = useMemo(() => {
    const total = users.length;
    const internal = users.filter((u) => u.account_type === "internal").length;
    const business = users.filter((u) => u.account_type === "business").length;
    const individual = users.filter((u) => u.account_type === "individual" || !u.account_type).length;
    const recent = users.filter((u) => u.created_at && Date.now() - new Date(u.created_at).getTime() < 30 * 86400000).length;
    return { total, internal, business, individual, recent };
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !search ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.company?.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === "all" ||
        (activeTab === "individual" ? u.account_type === "individual" || !u.account_type : u.account_type === activeTab);
      return matchSearch && matchTab;
    });
  }, [users, search, activeTab]);

  const openUser = useCallback((user: any) => {
    setSelectedUser(user);
    setPanelOpen(true);
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const user = users.find((u) => u.id === userId);

    const supabase = createClient();
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await (supabase.from("user_roles") as any).insert({ user_id: userId, role: newRole });
    logAudit({ action: "update", entityType: "user_role", entityId: userId, entityLabel: user?.full_name, details: { role: newRole } });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    setSelectedUser((prev: any) => prev?.id === userId ? { ...prev, role: newRole } : prev);
    toast.success(newRole === "admin" ? "Promu administrateur" : "Rétrogradé en utilisateur");
  };

  return (
    <>
      <AdminPageHeader title="Utilisateurs" subtitle={`${users.length} comptes enregistrés`} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "bg-brand-primary/10 text-brand-primary" },
          { label: "Équipe IES", value: stats.internal, icon: Shield, color: "bg-brand-primary/10 text-brand-primary" },
          { label: "Entreprises", value: stats.business, icon: Briefcase, color: "bg-[#B87A6A20] text-[#B87A6A]" },
          { label: "Particuliers", value: stats.individual, icon: User, color: "bg-gray-100 text-gray-600" },
          { label: "Nouveaux (30j)", value: stats.recent, icon: UserPlus, color: "bg-emerald-100 text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, entreprise..." className="pl-9 h-10 rounded-xl border-gray-200" />
        </div>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as AccountTab)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-sm text-brand-primary bg-white"
        >
          <option value="all">Tous ({stats.total})</option>
          <option value="internal">Équipe IES ({stats.internal})</option>
          <option value="business">Entreprises ({stats.business})</option>
          <option value="individual">Particuliers ({stats.individual})</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/80">
                {["Utilisateur", "Email", "Entreprise", "Type", "Rôle", "Inscrit"].map((h, i) => (
                  <th key={h} className={cn("text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500",
                    i === 1 && "hidden md:table-cell", i === 2 && "hidden lg:table-cell", i === 5 && "hidden sm:table-cell")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400"><Search className="w-8 h-8 opacity-30 mx-auto mb-2" /><p className="text-sm">Aucun utilisateur</p></td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} onClick={() => openUser(user)}
                  className="border-b last:border-0 hover:bg-brand-primary/[0.03] transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-brand-primary">
                        {(user.avatar_url || user.team_photo_url) && <AvatarImage src={user.avatar_url || user.team_photo_url} alt={user.full_name} className="p-1 object-contain" />}
                        <AvatarFallback className="text-xs font-semibold bg-brand-primary text-white">{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.full_name || "Sans nom"}</p>
                        {user.team_role_fr && <p className="text-[11px] text-gray-400 truncate">{user.team_role_fr}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-gray-600 text-xs">{user.email}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {user.company ? (
                      <span className="text-gray-600 text-xs flex items-center gap-1.5">
                        {user.company}
                        {user.company_closed && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full" title="Entreprise fermée selon l'INSEE">⚠ Fermée</span>}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3"><AccountTypeBadge type={user.account_type || "individual"} /></td>
                  <td className="px-4 py-3">
                    {user.role === "admin" ? <Badge variant="success" className="gap-1"><Shield className="w-3 h-3" />Admin</Badge>
                      : <Badge variant="secondary" className="gap-1"><User className="w-3 h-3" />User</Badge>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {user.created_at && <><p className="text-gray-600 text-xs">{new Date(user.created_at).toLocaleDateString("fr-FR")}</p><p className="text-[11px] text-gray-400">{timeAgo(user.created_at)}</p></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50 text-xs text-gray-500">
            {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* User Edit Panel */}
      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={selectedUser?.full_name || "Utilisateur"}
        subtitle={selectedUser?.email || ""}
        width="lg"
      >
        {selectedUser && (
          <>
            {/* Badges + Rôle header */}
            <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AccountTypeBadge type={selectedUser.account_type || "individual"} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!confirm(selectedUser.role === "admin" ? "Retirer les droits admin ?" : "Promouvoir en admin ?")) return;
                    toggleRole(selectedUser.id, selectedUser.role);
                  }}
                >
                  {selectedUser.role === "admin" ? (
                    <Badge variant="success" className="gap-1.5 cursor-pointer hover:bg-emerald-100">
                      <Shield className="w-3 h-3" /> Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1.5 cursor-pointer hover:bg-gray-200">
                      <User className="w-3 h-3" /> User
                    </Badge>
                  )}
                </button>
              </div>
              <p className="text-xs text-brand-secondary/40">
                {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : ""}
              </p>
            </div>

            {/* Formulaire partagé (logo inclus dedans) */}
            <UserProfileForm
              profile={selectedUser}
              onSave={() => { setPanelOpen(false); window.location.reload(); }}
              onCancel={() => setPanelOpen(false)}
            />
          </>
        )}
      </SlidePanel>
    </>
  );
}
