"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useCallback } from "react";
import {
  Shield, User, Users, UserPlus, Search, Briefcase,
  Save, Loader2, Mail, Building2, Phone, ShieldCheck, ShieldOff,
  Linkedin, MapPin, Calendar,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlidePanel } from "@/components/admin/SlidePanel";
import { useRef } from "react";
import { Upload, X } from "lucide-react";
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
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name?: string | null): string {
  const colors = ["bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
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

function LogoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "image/svg+xml") {
      toast.error("Seuls les fichiers SVG sont acceptés");
      return;
    }
    if (file.size > 150 * 1024) {
      toast.error("Le fichier doit faire moins de 150 Ko");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "product-images");
    formData.append("folder", "logos");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Échec de l'upload");
      }
      const { url } = await res.json();
      onChange(url);
      toast.success("Logo uploadé");
    } catch (err) {
      toast.error("Erreur upload : " + (err instanceof Error ? err.message : "Échec"));
    }
  };

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <div className="relative w-20 h-20 rounded-xl border border-gray-200 bg-white p-2 flex items-center justify-center">
          <Image src={value} alt="Logo" width={64} height={64} className="w-full h-full object-contain" />
          <button type="button" onClick={() => onChange("")}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-accent/40 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-accent transition-colors">
          <Upload className="w-5 h-5" />
          <span className="text-[9px] font-medium">SVG</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept=".svg,image/svg+xml" className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </div>
  );
}

export function UsersAdmin({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AccountTab>("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

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
    setEditForm({
      full_name: user.full_name || "",
      email: user.email || "",
      company: user.company || "",
      phone: user.phone || user.team_phone || "",
      avatar_url: user.avatar_url || user.team_photo_url || "",
      linkedin_url: user.team_linkedin || "",
      bio_fr: user.team_bio_fr || "",
    });
    setPanelOpen(true);
  }, []);

  const handleSave = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      const supabase = createClient();
      await (supabase.from("profiles") as any)
        .update({
          full_name: editForm.full_name,
          company: editForm.company || null,
          phone: editForm.phone || null,
          avatar_url: editForm.avatar_url || null,
        })
        .eq("id", selectedUser.id);

      // Update team_members if linked
      if (selectedUser.team_member_id) {
        await (supabase.from("team_members") as any)
          .update({
            name: editForm.full_name,
            phone: editForm.phone || null,
            photo_url: editForm.avatar_url || null,
            linkedin_url: editForm.linkedin_url || null,
            bio_fr: editForm.bio_fr || null,
          })
          .eq("id", selectedUser.team_member_id);
      }

      logAudit({ action: "update", entityType: "user_profile", entityId: selectedUser.id, entityLabel: editForm.full_name });
      setUsers((prev) => prev.map((u) => u.id === selectedUser.id ? {
        ...u,
        full_name: editForm.full_name,
        company: editForm.company,
        phone: editForm.phone,
        avatar_url: editForm.avatar_url,
        team_linkedin: editForm.linkedin_url,
        team_bio_fr: editForm.bio_fr,
        team_phone: editForm.phone,
        team_photo_url: editForm.avatar_url,
      } : u));
      toast.success("Profil mis à jour");
      setPanelOpen(false);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const user = users.find((u) => u.id === userId);
    if (newRole === "admin" && user?.email && !user.email.endsWith("@ies-ingredients.com")) {
      toast.error("Seuls les emails @ies-ingredients.com peuvent être administrateurs");
      return;
    }
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

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => {
          const count = tab.value === "all" ? stats.total : tab.value === "internal" ? stats.internal : tab.value === "business" ? stats.business : stats.individual;
          return (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.value ? "bg-white text-brand-primary shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              <tab.icon className="w-4 h-4" />{tab.label}
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                activeTab === tab.value ? "bg-brand-primary/10 text-brand-primary" : "bg-gray-200 text-gray-500")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..." className="pl-9 h-10 rounded-xl border-gray-200" />
        </div>
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
                      <Avatar className="h-9 w-9">
                        {(user.avatar_url || user.team_photo_url) && <AvatarImage src={user.avatar_url || user.team_photo_url} alt={user.full_name} />}
                        <AvatarFallback className={`text-xs font-semibold ${getAvatarColor(user.full_name)}`}>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.full_name || "Sans nom"}</p>
                        {user.team_role_fr && <p className="text-[11px] text-gray-400 truncate">{user.team_role_fr}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-gray-600 text-xs">{user.email}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell">{user.company ? <span className="text-gray-600 text-xs">{user.company}</span> : <span className="text-gray-300">—</span>}</td>
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
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Profile card */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-primary flex items-center justify-center shrink-0">
                  {editForm.avatar_url ? (
                    <Image src={editForm.avatar_url} alt="" width={64} height={64} className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xl font-bold text-white/80">{getInitials(selectedUser.full_name)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-brand-primary truncate">{editForm.full_name || "Sans nom"}</h3>
                  <p className="text-sm text-gray-500 truncate">{selectedUser.team_role_fr || selectedUser.company || selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <AccountTypeBadge type={selectedUser.account_type || "individual"} />
                    {selectedUser.role === "admin"
                      ? <Badge variant="success" className="gap-1"><Shield className="w-3 h-3" />Admin</Badge>
                      : <Badge variant="secondary" className="gap-1"><User className="w-3 h-3" />User</Badge>}
                  </div>
                </div>
              </div>

              {/* Logo entreprise (clients business uniquement) */}
              {selectedUser.account_type !== "internal" && (selectedUser.account_type === "business" || selectedUser.company) && (
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Logo entreprise</p>
                  <p className="text-[11px] text-gray-400 mb-3">SVG uniquement, carré, max 150 Ko</p>
                  <LogoUpload
                    value={editForm.avatar_url}
                    onChange={(url) => setEditForm((prev: any) => ({ ...prev, avatar_url: url }))}
                  />
                </div>
              )}

              {/* Séparateur */}
              <div className="h-px bg-gray-100" />

              {/* Informations personnelles */}
              <div>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Informations personnelles</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-brand-primary text-xs flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Nom complet</Label>
                    <Input value={editForm.full_name} onChange={(e) => setEditForm((prev: any) => ({ ...prev, full_name: e.target.value }))} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-brand-primary text-xs flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
                    <Input value={editForm.email} disabled className="h-10 opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-brand-primary text-xs flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Téléphone</Label>
                      <Input value={editForm.phone} onChange={(e) => setEditForm((prev: any) => ({ ...prev, phone: e.target.value }))} className="h-10" placeholder="+33..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-brand-primary text-xs flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Entreprise</Label>
                      <Input value={editForm.company} onChange={(e) => setEditForm((prev: any) => ({ ...prev, company: e.target.value }))} className="h-10" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Infos équipe (si membre IES) */}
              {selectedUser.team_member_id && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Équipe IES</p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5 text-sm text-brand-primary bg-brand-primary/[0.04] rounded-xl px-4 py-3">
                          <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                          {selectedUser.team_department || "—"}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-brand-primary bg-brand-primary/[0.04] rounded-xl px-4 py-3">
                          <Briefcase className="w-4 h-4 text-brand-accent shrink-0" />
                          {selectedUser.team_role_fr || "—"}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-brand-primary text-xs flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</Label>
                        <Input value={editForm.linkedin_url} onChange={(e) => setEditForm((prev: any) => ({ ...prev, linkedin_url: e.target.value }))} className="h-10" placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-brand-primary text-xs">Bio</Label>
                        <Textarea value={editForm.bio_fr} onChange={(e) => setEditForm((prev: any) => ({ ...prev, bio_fr: e.target.value }))} rows={3} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Séparateur */}
              <div className="h-px bg-gray-100" />

              {/* Rôle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Rôle</p>
                  <p className="text-sm text-brand-primary font-medium">{selectedUser.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
                </div>
                <Button variant="outline" size="sm"
                  className={cn("rounded-xl text-xs", selectedUser.role === "admin" ? "text-orange-600 hover:bg-orange-50" : "text-brand-accent hover:bg-brand-accent/5")}
                  onClick={() => toggleRole(selectedUser.id, selectedUser.role)}>
                  {selectedUser.role === "admin"
                    ? <><ShieldOff className="w-3.5 h-3.5 mr-1.5" />Retirer</>
                    : <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" />Promouvoir</>}
                </Button>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
                <span className="font-mono">{selectedUser.id?.slice(0, 8)}</span>
              </div>

            </div>

            {/* Sticky footer */}
            <div className="shrink-0 border-t border-gray-100 bg-[#FAFAF8] px-6 py-4 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setPanelOpen(false)} className="rounded-lg">Annuler</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>
    </>
  );
}
