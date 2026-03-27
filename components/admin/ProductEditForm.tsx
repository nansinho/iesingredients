"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProductEditFormProps {
  tableName: string;
  product: Record<string, any> | null;
  isNew: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function ProductEditForm({ tableName, product, isNew, onSave, onCancel }: ProductEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    code: product?.code || "",
    nom_commercial: product?.nom_commercial || "",
    inci: product?.inci || "",
    cas_no: product?.cas_no || "",
    gamme: product?.gamme || "",
    origine: product?.origine || "",
    description: product?.description || "",
    benefices: product?.benefices || "",
    application: product?.application || "",
    solubilite: product?.solubilite || "",
    aspect: product?.aspect || "",
    certifications: product?.certifications || "",
    statut: product?.statut || "ACTIF",
    image_url: product?.image_url || "",
    food_grade: product?.food_grade || "",
  });

  const handleChange = useCallback((key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) {
      toast.error("Le code est obligatoire");
      return;
    }
    setIsSaving(true);

    try {
      const supabase = createClient();
      const data = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== "")
      );

      if (isNew) {
        const { error } = await (supabase.from(tableName) as any).insert(data);
        if (error) throw error;
        toast.success("Produit créé");
      } else {
        const { error } = await (supabase.from(tableName) as any)
          .update(data)
          .eq("code", product?.code);
        if (error) throw error;
        toast.success("Produit mis à jour");
      }

      onSave?.();
    } catch (err: unknown) {
      toast.error("Erreur: " + (err instanceof Error ? err.message : "Échec"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* Status + Code row */}
          <div className="flex items-center gap-4">
            <Badge
              className={`text-sm px-3 py-1 cursor-pointer ${
                form.statut === "ACTIF"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              onClick={() => handleChange("statut", form.statut === "ACTIF" ? "INACTIF" : "ACTIF")}
            >
              {form.statut}
            </Badge>
          </div>

          {/* Photo */}
          <ImageUpload
            value={form.image_url}
            onChange={(url) => handleChange("image_url", url)}
            folder={tableName}
            label="Photo produit"
            aspect="square"
          />

          {/* Identity */}
          <div>
            <h3 className="text-sm font-semibold text-brand-primary mb-3 uppercase tracking-wider">Identification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  disabled={!isNew}
                  className="h-10 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Nom commercial</Label>
                <Input
                  value={form.nom_commercial}
                  onChange={(e) => handleChange("nom_commercial", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">INCI</Label>
                <Input
                  value={form.inci}
                  onChange={(e) => handleChange("inci", e.target.value)}
                  className="h-10 font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">N CAS</Label>
                <Input
                  value={form.cas_no}
                  onChange={(e) => handleChange("cas_no", e.target.value)}
                  className="h-10 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div>
            <h3 className="text-sm font-semibold text-brand-primary mb-3 uppercase tracking-wider">Classification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">Gamme</Label>
                <Input
                  value={form.gamme}
                  onChange={(e) => handleChange("gamme", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Origine</Label>
                <Input
                  value={form.origine}
                  onChange={(e) => handleChange("origine", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Solubilité</Label>
                <Input
                  value={form.solubilite}
                  onChange={(e) => handleChange("solubilite", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Aspect</Label>
                <Input
                  value={form.aspect}
                  onChange={(e) => handleChange("aspect", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Certifications</Label>
                <Input
                  value={form.certifications}
                  onChange={(e) => handleChange("certifications", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Statut</Label>
                <Select value={form.statut} onValueChange={(v) => handleChange("statut", v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIF">ACTIF</SelectItem>
                    <SelectItem value="INACTIF">INACTIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-sm font-semibold text-brand-primary mb-3 uppercase tracking-wider">Détails</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="text-sm"
                  placeholder="Description du produit..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Bénéfices</Label>
                <Textarea
                  value={form.benefices}
                  onChange={(e) => handleChange("benefices", e.target.value)}
                  rows={3}
                  className="text-sm"
                  placeholder="Bénéfices du produit..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Application</Label>
                <Textarea
                  value={form.application}
                  onChange={(e) => handleChange("application", e.target.value)}
                  rows={3}
                  className="text-sm"
                  placeholder="Applications recommandées..."
                />
              </div>
            </div>
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
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg px-6"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isNew ? "Créer" : "Enregistrer"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
