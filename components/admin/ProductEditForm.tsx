"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

interface ProductEditFormProps {
  tableName: string;
  product: Record<string, any> | null;
  backPath: string;
  isNew: boolean;
}

export function ProductEditForm({ tableName, product, backPath, isNew }: ProductEditFormProps) {
  const router = useRouter();
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

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Le code est obligatoire");
      return;
    }
    if (!form.nom_commercial.trim()) {
      toast.error("Le nom commercial est obligatoire");
      return;
    }
    setIsSaving(true);

    try {
      const supabase = createClient();

      // Check code uniqueness for new products
      if (isNew) {
        const { data: existing } = await (supabase.from(tableName) as any)
          .select("code")
          .eq("code", form.code.trim())
          .maybeSingle();

        if (existing) {
          toast.error("Ce code existe déjà");
          setIsSaving(false);
          return;
        }
      }

      const data: Record<string, string> = {};
      for (const [key, value] of Object.entries(form)) {
        if (typeof value === "string" && value.trim() !== "") {
          data[key] = value.trim();
        } else if (typeof value === "string") {
          data[key] = value;
        }
      }
      // Always include statut
      data.statut = form.statut;

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

      router.push(backPath as any);
      router.refresh();
    } catch (err: unknown) {
      toast.error("Erreur: " + (err instanceof Error ? err.message : "Échec de la sauvegarde"));
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { key: "code", label: "Code *", disabled: !isNew },
    { key: "nom_commercial", label: "Nom commercial" },
    { key: "inci", label: "INCI" },
    { key: "cas_no", label: "N° CAS" },
    { key: "gamme", label: "Gamme" },
    { key: "origine", label: "Origine" },
    { key: "solubilite", label: "Solubilité" },
    { key: "aspect", label: "Aspect" },
    { key: "certifications", label: "Certifications" },
    { key: "food_grade", label: "Food Grade" },
    { key: "image_url", label: "Image URL" },
  ];

  const textareaFields = [
    { key: "description", label: "Description" },
    { key: "benefices", label: "Bénéfices" },
    { key: "application", label: "Application" },
  ];

  return (
    <>
      <AdminPageHeader
        title={isNew ? "Nouveau produit" : `Modifier: ${product?.nom_commercial || product?.code}`}
        actions={
          <Link href={backPath}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select value={form.statut} onValueChange={(v) => handleChange("statut", v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIF">ACTIF</SelectItem>
                <SelectItem value="INACTIF">INACTIF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  value={(form as any)[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  disabled={f.disabled}
                  className="h-10"
                />
              </div>
            ))}
          </div>

          {/* Textarea fields */}
          {textareaFields.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Textarea
                id={f.key}
                value={(form as any)[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                rows={3}
              />
            </div>
          ))}

          {/* Save */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-forest-900 text-white px-8"
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
        </div>
      </form>
    </>
  );
}
