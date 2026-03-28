"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo } from "react";
import {
  Shield,
  User,
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  ShieldCheck,
  ShieldOff,
  Eye,
  Building2,
  Phone,
  Calendar,
  Copy,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { logAudit } from "@/lib/audit";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AccountTab = "all" | "internal" | "business" | "individual";

const tabs: { value: AccountTab; label: string; icon: typeof Users }[] = [
  { value: "all", label: "Tous", icon: Users },
  { value: "internal", label: "Équipe IES", icon: Shield },
  { value: "business", label: "Entreprises", icon: Briefcase },
  { value: "individual", label: "Particuliers", icon: User },
];

const accountTypeBadge: Record<string, { label: string; bg: string; text: string; border: string }> = {
  internal: { label: "IES", bg: "#2E1F3D", text: "#FAF8F6", border: "#2E1F3D" },
  business: { label: "Entreprise", bg: "#B87A6A", text: "#FFFFFF", border: "#B87A6A" },
  individual: { label: "Particulier", bg: "#E0DCD5", text: "#2E1F3D", border: "#C4C0BC" },
};

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name?: string | null): string {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-teal-100 text-teal-700",
  ];
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
}

function AccountTypeBadge({ type }: { type: string }) {
  const config = accountTypeBadge[type] || accountTypeBadge.individual;
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}
    >
      {config.label}
    </span>
  );
}

export function UsersAdmin({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AccountTab>("all");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const internal = users.filter((u) => u.account_type === "internal").length;
    const business = users.filter((u) => u.account_type === "business").length;
    const individual = users.filter((u) => u.account_type === "individual" || !u.account_type).length;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recent = users.filter(
      (u) => u.created_at && new Date(u.created_at) >= thirtyDaysAgo
    ).length;
    return { total, internal, business, individual, recent };
  }, [users]);

  // Filtered users
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.company?.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "all" ||
        (activeTab === "individual"
          ? u.account_type === "individual" || !u.account_type
          : u.account_type === activeTab);
      return matchSearch && matchTab;
    });
  }, [users, search, activeTab]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const user = users.find((u) => u.id === userId);

    // Only @ies-ingredients.com can be admin
    if (newRole === "admin" && user?.email && !user.email.endsWith("@ies-ingredients.com")) {
      toast.error("Seuls les emails @ies-ingredients.com peuvent être administrateurs");
      return;
    }

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      toast.error("Erreur lors du changement de rôle");
      return;
    }

    const { error: insertError } = await (supabase.from("user_roles") as any).insert({
      user_id: userId,
      role: newRole,
    });

    if (insertError) {
      toast.error("Erreur lors du changement de rôle");
      return;
    }

    logAudit({
      action: "update",
      entityType: "user_role",
      entityId: userId,
      entityLabel: user?.full_name || user?.email,
      details: { role: newRole },
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success(
      newRole === "admin"
        ? "Promu administrateur"
        : "Rétrogradé en utilisateur"
    );
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié");
  };

  const openDetail = (user: any) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  return (
    <>
      <AdminPageHeader
        title="Utilisateurs"
        subtitle={`${users.length} comptes enregistrés`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.internal}</p>
            <p className="text-xs text-gray-500">Équipe IES</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#B87A6A20" }}>
            <div className="w-full h-full flex items-center justify-center">
              <Briefcase className="w-5 h-5" style={{ color: "#B87A6A" }} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.business}</p>
            <p className="text-xs text-gray-500">Entreprises</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.individual}</p>
            <p className="text-xs text-gray-500">Particuliers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
            <p className="text-xs text-gray-500">Nouveaux (30j)</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.value
                ? "bg-white text-brand-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              activeTab === tab.value ? "bg-brand-primary/10 text-brand-primary" : "bg-gray-200 text-gray-500"
            )}>
              {tab.value === "all" ? stats.total
                : tab.value === "internal" ? stats.internal
                : tab.value === "business" ? stats.business
                : stats.individual}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou entreprise..."
            className="pl-9 h-10 rounded-xl border-gray-200 focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/80">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Utilisateur
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                  Entreprise
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Rôle
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                  Inscrit
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="text-sm">Aucun utilisateur trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-0 hover:bg-brand-primary/[0.03] transition-colors group"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {user.avatar_url && (
                            <AvatarImage src={user.avatar_url} alt={user.full_name} />
                          )}
                          <AvatarFallback
                            className={`text-xs font-semibold ${getAvatarColor(user.full_name)}`}
                          >
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.full_name || "Sans nom"}
                          </p>
                          <p className="text-xs text-gray-500 truncate md:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600 text-xs">{user.email}</span>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {user.company ? (
                        <span className="text-gray-600 text-xs">{user.company}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Account Type Badge */}
                    <td className="px-4 py-3">
                      <AccountTypeBadge type={user.account_type || "individual"} />
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      {user.role === "admin" ? (
                        <Badge variant="success" className="gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <User className="w-3 h-3" />
                          User
                        </Badge>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div>
                        <p className="text-gray-600 text-xs">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString("fr-FR")
                            : "—"}
                        </p>
                        {user.created_at && (
                          <p className="text-[11px] text-gray-400">
                            {timeAgo(user.created_at)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel className="text-xs text-gray-500">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem onClick={() => openDetail(user)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => user.email && copyEmail(user.email)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copier l&apos;email
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              user.email &&
                              window.open(`mailto:${user.email}`, "_blank")
                            }
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Envoyer un email
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => toggleRole(user.id, user.role)}
                          >
                            {user.role === "admin" ? (
                              <>
                                <ShieldOff className="w-4 h-4 mr-2" />
                                Retirer admin
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Promouvoir admin
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50/50 text-xs text-gray-500">
            {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} affiché
            {filtered.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* User Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profil utilisateur</DialogTitle>
            <DialogDescription>
              Détails du compte et informations
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 pt-2">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {selectedUser.avatar_url && (
                    <AvatarImage
                      src={selectedUser.avatar_url}
                      alt={selectedUser.full_name}
                    />
                  )}
                  <AvatarFallback
                    className={`text-lg font-bold ${getAvatarColor(selectedUser.full_name)}`}
                  >
                    {getInitials(selectedUser.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {selectedUser.full_name || "Sans nom"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <AccountTypeBadge type={selectedUser.account_type || "individual"} />
                    {selectedUser.role === "admin" ? (
                      <Badge variant="success" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <User className="w-3 h-3" />
                        User
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600 truncate">
                    {selectedUser.email || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    {selectedUser.company || "Non renseignée"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    {selectedUser.phone || "Non renseigné"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    Inscrit le{" "}
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => selectedUser.email && copyEmail(selectedUser.email)}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copier email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => selectedUser.email && window.open(`mailto:${selectedUser.email}`, "_blank")}
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  Envoyer email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-lg text-xs ${
                    selectedUser.role === "admin"
                      ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  }`}
                  onClick={() => {
                    toggleRole(selectedUser.id, selectedUser.role);
                    setSelectedUser((prev: any) =>
                      prev
                        ? { ...prev, role: prev.role === "admin" ? "user" : "admin" }
                        : null
                    );
                  }}
                >
                  {selectedUser.role === "admin" ? (
                    <>
                      <ShieldOff className="w-3.5 h-3.5 mr-1.5" />
                      Retirer admin
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                      Promouvoir admin
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
