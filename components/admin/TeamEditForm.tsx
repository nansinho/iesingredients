"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Save, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { DEPARTMENTS } from "@/lib/constants/departments";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export function TeamEditForm({
  member,
  isNew,
  onSave,
  onCancel,
}: {
  member: Record<string, any> | null;
  isNew: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [createAccount, setCreateAccount] = useState(isNew);
  const [form, setForm] = useState({
    name: member?.name || "",
    role_fr: member?.role_fr || member?.role || "",
    role_en: member?.role_en || "",
    email: member?.email || "",
    phone: member?.phone || "",
    linkedin_url: member?.linkedin_url || "",
    photo_url: member?.photo_url || "",
    bio_fr: member?.bio_fr || member?.bio || "",
    bio_en: member?.bio_en || "",
    department: member?.department || "",
    display_order: member?.display_order || 0,
  });

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Le nom est obligatoire");
      return;
    }
    setIsSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        ...form,
        department: form.department || null,
        phone: form.phone || null,
        linkedin_url: form.linkedin_url || null,
        photo_url: form.photo_url || null,
      };

      if (isNew) {
        const { error } = await (supabase.from("team_members") as any).insert(payload);
        if (error) throw error;

        if (createAccount && form.email) {
          try {
            const res = await fetch("/api/admin/create-user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: form.email, fullName: form.name }),
            });
            if (res.ok) {
              toast.success("Compte utilisateur créé (mdp : 1234IES-*-)");
            } else {
              const err = await res.json();
              toast.warning(err.error || "Membre créé mais le compte n'a pas pu être créé");
            }
          } catch {
            toast.warning("Membre créé mais erreur lors de la création du compte");
          }
        } else {
          toast.success("Membre créé");
        }

        logAudit({ action: "create", entityType: "team_member", entityId: form.name, entityLabel: form.name });
      } else {
        const { error } = await (supabase.from("team_members") as any)
          .update(payload)
          .eq("id", member?.id);
        if (error) throw error;
        logAudit({ action: "update", entityType: "team_member", entityId: member?.id, entityLabel: form.name });
        toast.success("Membre mis à jour");
      }

      onSave?.();
    } catch (err: unknown) {
      toast.error("Erreur: " + (err instanceof Error ? err.message : "Échec"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* Photo */}
          <ImageUpload
            value={form.photo_url}
            onChange={(url) => handleChange("photo_url", url)}
            folder="team"
            label="Photo"
            aspect="square"
            showAlt={false}
            onOpenLibrary={() => setShowMediaLibrary(true)}
          />

          {/* Nom + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Nom *</Label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">Email</Label>
              <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="h-10" />
            </div>
          </div>

          {/* Create account checkbox */}
          {isNew && form.email && (
            <label className="flex items-center gap-3 p-3 rounded-xl border border-brand-accent/20 bg-brand-accent/5 cursor-pointer">
              <input
                type="checkbox"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="w-4 h-4 rounded border-brand-accent/30 text-brand-accent focus:ring-brand-accent/20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-primary">
                  <UserPlus className="w-4 h-4 text-brand-accent" />
                  Créer un compte utilisateur
                </div>
                <p className="text-xs text-brand-secondary/50 mt-0.5">
                  Mot de passe temporaire : <code className="text-brand-accent">1234IES-*-</code>
                </p>
              </div>
            </label>
          )}

          {/* Téléphone + LinkedIn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Téléphone</Label>
              <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+33 4 93 00 00 00" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">LinkedIn</Label>
              <Input value={form.linkedin_url} onChange={(e) => handleChange("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." className="h-10" />
            </div>
          </div>

          {/* Rôles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Rôle (FR)</Label>
              <Input value={form.role_fr} onChange={(e) => handleChange("role_fr", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">Role (EN)</Label>
              <Input value={form.role_en} onChange={(e) => handleChange("role_en", e.target.value)} className="h-10" />
            </div>
          </div>

          {/* Département + Ordre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Département</Label>
              <select
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="flex h-10 w-full rounded-lg border-0 bg-brand-primary/[0.04] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/20"
              >
                <option value="">— Aucun —</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.labelFr}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">Ordre d&apos;affichage</Label>
              <Input type="number" value={form.display_order} onChange={(e) => handleChange("display_order", parseInt(e.target.value) || 0)} className="h-10" />
            </div>
          </div>

          {/* Bios */}
          <div className="space-y-2">
            <Label className="text-brand-primary">Bio (FR)</Label>
            <Textarea value={form.bio_fr} onChange={(e) => handleChange("bio_fr", e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">Bio (EN)</Label>
            <Textarea value={form.bio_en} onChange={(e) => handleChange("bio_en", e.target.value)} rows={3} />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-[#FAFAF8] px-6 py-4 flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSaving} className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? "Créer" : "Enregistrer"}
        </Button>
      </div>
    </form>
    {showMediaLibrary && (
      <MediaLibrary
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(url) => {
          handleChange("photo_url", url);
          setShowMediaLibrary(false);
        }}
        folder="team"
      />
    )}
    </>
  );
}
