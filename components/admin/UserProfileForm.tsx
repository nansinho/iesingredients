"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Save, Loader2, Linkedin, Instagram, Globe, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UserProfileFormProps {
  profile: Record<string, any>;
  onSave?: () => void;
  onCancel?: () => void;
  showAvatar?: boolean;
}

export function UserProfileForm({ profile, onSave, onCancel }: UserProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: profile.first_name || (profile.full_name?.split(" ")[0]) || "",
    last_name: profile.last_name || (profile.full_name?.split(" ").slice(1).join(" ")) || "",
    email: profile.email || "",
    phone: profile.phone || "",
    company: profile.company || "",
    siret: profile.siret || "",
    tva_intracom: profile.tva_intracom || "",
    billing_address: profile.billing_address || "",
    billing_city: profile.billing_city || "",
    billing_postal_code: profile.billing_postal_code || "",
    billing_country: profile.billing_country || "France",
    shipping_address: profile.shipping_address || "",
    shipping_city: profile.shipping_city || "",
    shipping_postal_code: profile.shipping_postal_code || "",
    shipping_country: profile.shipping_country || "France",
    shipping_same_as_billing: profile.shipping_same_as_billing !== false,
    linkedin_url: profile.linkedin_url || "",
    instagram_url: profile.instagram_url || "",
    twitter_url: profile.twitter_url || "",
    website_url: profile.website_url || "",
  });

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const fullName = `${form.first_name} ${form.last_name}`.trim();

      await (supabase.from("profiles") as any)
        .update({
          first_name: form.first_name || null,
          last_name: form.last_name || null,
          full_name: fullName || null,
          phone: form.phone || null,
          company: form.company || null,
          siret: form.siret || null,
          tva_intracom: form.tva_intracom || null,
          billing_address: form.billing_address || null,
          billing_city: form.billing_city || null,
          billing_postal_code: form.billing_postal_code || null,
          billing_country: form.billing_country || null,
          shipping_same_as_billing: form.shipping_same_as_billing,
          shipping_address: form.shipping_same_as_billing ? null : (form.shipping_address || null),
          shipping_city: form.shipping_same_as_billing ? null : (form.shipping_city || null),
          shipping_postal_code: form.shipping_same_as_billing ? null : (form.shipping_postal_code || null),
          shipping_country: form.shipping_same_as_billing ? null : (form.shipping_country || null),
          linkedin_url: form.linkedin_url || null,
          instagram_url: form.instagram_url || null,
          twitter_url: form.twitter_url || null,
          website_url: form.website_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      toast.success("Profil mis à jour");
      onSave?.();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* ── Identité ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Nom</Label>
              <Input value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} className="h-10" placeholder="Dupont" />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">Prénom</Label>
              <Input value={form.first_name} onChange={(e) => handleChange("first_name", e.target.value)} className="h-10" placeholder="Jean" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-brand-primary">Email</Label>
            <Input value={form.email} disabled className="h-10 opacity-50 cursor-not-allowed" />
          </div>

          {/* ── Contact ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Téléphone</Label>
              <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="h-10" placeholder="+33..." />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">Entreprise</Label>
              <Input value={form.company} onChange={(e) => handleChange("company", e.target.value)} className="h-10" />
            </div>
          </div>

          {/* ── Entreprise ── */}
          {form.company && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">N° SIRET</Label>
                <Input value={form.siret} onChange={(e) => handleChange("siret", e.target.value)} className="h-10" placeholder="123 456 789 00012" />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">TVA intracommunautaire</Label>
                <Input value={form.tva_intracom} onChange={(e) => handleChange("tva_intracom", e.target.value)} className="h-10" placeholder="FR 12 345678901" />
              </div>
            </div>
          )}

          {/* ── Adresse de facturation ── */}
          <div className="space-y-3">
            <Label className="text-brand-primary font-semibold">Adresse de facturation</Label>
            <Input value={form.billing_address} onChange={(e) => handleChange("billing_address", e.target.value)} className="h-10" placeholder="Adresse" />
            <div className="grid grid-cols-3 gap-3">
              <Input value={form.billing_postal_code} onChange={(e) => handleChange("billing_postal_code", e.target.value)} className="h-10" placeholder="Code postal" />
              <Input value={form.billing_city} onChange={(e) => handleChange("billing_city", e.target.value)} className="h-10" placeholder="Ville" />
              <Input value={form.billing_country} onChange={(e) => handleChange("billing_country", e.target.value)} className="h-10" placeholder="Pays" />
            </div>
          </div>

          {/* ── Adresse de livraison ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-brand-primary font-semibold">Adresse de livraison</Label>
              <label className="flex items-center gap-2 text-xs text-brand-secondary/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.shipping_same_as_billing}
                  onChange={(e) => handleChange("shipping_same_as_billing", e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-brand-accent"
                />
                Identique à la facturation
              </label>
            </div>
            {!form.shipping_same_as_billing && (
              <>
                <Input value={form.shipping_address} onChange={(e) => handleChange("shipping_address", e.target.value)} className="h-10" placeholder="Adresse" />
                <div className="grid grid-cols-3 gap-3">
                  <Input value={form.shipping_postal_code} onChange={(e) => handleChange("shipping_postal_code", e.target.value)} className="h-10" placeholder="Code postal" />
                  <Input value={form.shipping_city} onChange={(e) => handleChange("shipping_city", e.target.value)} className="h-10" placeholder="Ville" />
                  <Input value={form.shipping_country} onChange={(e) => handleChange("shipping_country", e.target.value)} className="h-10" placeholder="Pays" />
                </div>
              </>
            )}
          </div>

          {/* ── Réseaux sociaux ── */}
          <div className="space-y-3">
            <Label className="text-brand-primary font-semibold">Réseaux sociaux</Label>
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-[#0A66C2] shrink-0" />
              <Input value={form.linkedin_url} onChange={(e) => handleChange("linkedin_url", e.target.value)} className="h-10 flex-1" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-[#E4405F] shrink-0" />
              <Input value={form.instagram_url} onChange={(e) => handleChange("instagram_url", e.target.value)} className="h-10 flex-1" placeholder="https://instagram.com/..." />
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-4 w-4 text-gray-800 shrink-0" />
              <Input value={form.twitter_url} onChange={(e) => handleChange("twitter_url", e.target.value)} className="h-10 flex-1" placeholder="https://x.com/..." />
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-brand-accent shrink-0" />
              <Input value={form.website_url} onChange={(e) => handleChange("website_url", e.target.value)} className="h-10 flex-1" placeholder="https://monsite.com" />
            </div>
          </div>

        </div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-gray-100 bg-[#FAFAF8] px-6 py-4 flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">Annuler</Button>
        )}
        <Button type="submit" disabled={isSaving} className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
