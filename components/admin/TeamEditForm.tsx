"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export function TeamEditForm({
  member,
  backPath,
  isNew,
}: {
  member: Record<string, any> | null;
  backPath: string;
  isNew: boolean;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: member?.name || "",
    role_fr: member?.role_fr || member?.role || "",
    role_en: member?.role_en || "",
    email: member?.email || "",
    photo_url: member?.photo_url || "",
    bio_fr: member?.bio_fr || member?.bio || "",
    bio_en: member?.bio_en || "",
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

      if (isNew) {
        const { error } = await (supabase.from("team_members") as any).insert(form);
        if (error) throw error;
        toast.success("Membre créé");
      } else {
        const { error } = await (supabase.from("team_members") as any)
          .update(form)
          .eq("id", member?.id);
        if (error) throw error;
        toast.success("Membre mis à jour");
      }

      router.push(backPath);
      router.refresh();
    } catch (err: unknown) {
      toast.error("Erreur: " + (err instanceof Error ? err.message : "Échec"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={isNew ? "Nouveau membre" : `Modifier: ${member?.name}`}
        actions={
          <Link href={backPath}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rôle (FR)</Label>
              <Input value={form.role_fr} onChange={(e) => handleChange("role_fr", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Role (EN)</Label>
              <Input value={form.role_en} onChange={(e) => handleChange("role_en", e.target.value)} className="h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Photo URL</Label>
              <Input value={form.photo_url} onChange={(e) => handleChange("photo_url", e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Ordre d&apos;affichage</Label>
              <Input type="number" value={form.display_order} onChange={(e) => handleChange("display_order", parseInt(e.target.value) || 0)} className="h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio (FR)</Label>
            <Textarea value={form.bio_fr} onChange={(e) => handleChange("bio_fr", e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Bio (EN)</Label>
            <Textarea value={form.bio_en} onChange={(e) => handleChange("bio_en", e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="bg-forest-900 text-white px-8">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isNew ? "Créer" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
