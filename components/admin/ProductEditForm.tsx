"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// Select remplacé par ComboboxField
import { ImageUpload } from "@/components/admin/ImageUpload";
import { StarRatingInput } from "@/components/admin/StarRatingInput";
import { ComboboxField } from "@/components/admin/ComboboxField";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { PerformanceRow, StabiliteRow } from "@/lib/product-types";

interface ProductEditFormProps {
  tableName: string;
  product: Record<string, any> | null;
  isNew: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  performanceData?: PerformanceRow[];
  stabiliteData?: StabiliteRow[];
}

const PERF_DEFAULTS: Omit<PerformanceRow, "product_code">[] = [
  { ordre: 1, option_name: "Niveau d'utilisation", performance_value: "", performance_rating: null },
  { ordre: 2, option_name: "Ténacité sur buvard", performance_value: "", performance_rating: null },
  { ordre: 3, option_name: "Efficacité de combustion", performance_value: null, performance_rating: null },
  { ordre: 4, option_name: "Amortissement de substance", performance_value: null, performance_rating: null },
  { ordre: 5, option_name: "Substance sèche", performance_value: null, performance_rating: null },
  { ordre: 6, option_name: "Éclosion dans le savon", performance_value: null, performance_rating: null },
];

const STAB_DEFAULTS: Omit<StabiliteRow, "product_code">[] = [
  { ordre: 1, base_name: "Nettoyant acide", ph_value: "2", odeur_rating: null },
  { ordre: 2, base_name: "Adoucissant textile", ph_value: "3", odeur_rating: null },
  { ordre: 3, base_name: "Anti-transpirant", ph_value: "3.5", odeur_rating: null },
  { ordre: 4, base_name: "Shampooing", ph_value: "6", odeur_rating: null },
  { ordre: 5, base_name: "APC", ph_value: "9", odeur_rating: null },
  { ordre: 6, base_name: "Lessive liquide pour le linge", ph_value: "9", odeur_rating: null },
  { ordre: 7, base_name: "Savon", ph_value: "10", odeur_rating: null },
  { ordre: 8, base_name: "Lessive en poudre", ph_value: "10,5", odeur_rating: null },
  { ordre: 9, base_name: "Eau de Javel liquide", ph_value: "11", odeur_rating: null },
];

// ── Options prédéfinies par catalogue (extraites de l'Excel) ──
const OPTIONS = {
  famille_arome: ["Citrus", "High Intensity", "Kitchen", "Preservation & Texture", "Synthétique", "Wellness & Nutri"],
  saveur_arome: ["Agrume", "Aldéhydique", "Ambré", "Aromatique", "Balsamique", "Botaniques", "Citron", "Clémentine", "Conservateur", "Floral", "Fruit & Légume", "Fruité", "Gourmand", "Lime", "Mandarine", "Molécule", "Musqué", "Orange", "Pamplemousse", "Poudre de fromage", "Preservation & Texture", "Savoureux", "Smoke & Grill", "Sweet & Brown", "Terpènes", "Vert", "Wellness & Nutri", "Épicé"],
  aspect_arome: ["Liquide", "Solide"],
  famille_cosmetique: ["ACTIF", "EXTRAITS VÉGÉTAUX", "HUILE ESSENTIELLE", "PERFORMANCE", "SOLAIRE", "VITAMINE"],
  origine_cosmetique: ["Animal", "Biotechnologie", "Biotechnologie Synthétique", "Biotechnologie Végétale", "Minéral", "Naturel", "Synthétique", "Synthétique & Végétale", "Végétale"],
  solubilite: ["HYDROSOLUBLE", "HYDROSOLUBLE / LIPOSOLUBLE", "LIPOSOLUBLE"],
  aspect_cosmetique: ["LIQUIDE", "PATE", "POUDRE"],
  conservateurs: ["Avec conservateur", "Sans conservateur"],
  application: ["Capillaire", "Corps", "Visage", "Visage - Sun", "Visage / Capillaire", "Visage / Corps", "Visage / Corps - Peau mature", "Visage / Corps - Sun", "Visage / Corps / Capillaire", "Visage / Corps / Capillaire / Sun"],
  type_de_peau: ["Peau sensible", "Peau sèche"],
  famille_olfactive: ["Aldéhydique", "Ambré", "Animal", "Aromatique", "Balsamique", "Boisé", "Chypre", "Floral", "Fruité", "Gourmand", "Hespéridé", "Indéfini", "Marine", "Musqué", "Vert", "Épicé"],
  origine_parfum: ["Naturel", "Synthétique"],
  aspect_parfum: ["Liquide", "Solide"],
  food_grade: ["OUI", "NON"],
  flavouring_preparation: ["OUI", "NON"],
  statut: ["ACTIF", "INACTIF"],
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-brand-primary">{label}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-brand-primary mb-3 uppercase tracking-wider">
      {children}
    </h3>
  );
}

export function ProductEditForm({
  tableName,
  product,
  isNew,
  onSave,
  onCancel,
  performanceData,
  stabiliteData,
}: ProductEditFormProps) {
  const isParfum = tableName === "parfum_fr";
  const isCosmetique = tableName === "cosmetique_fr";
  const isArome = tableName === "aromes_fr";

  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {
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
      valorisations: product?.valorisations || "",
      statut: product?.statut || "ACTIF",
      image_url: product?.image_url || "",
      tracabilite: product?.tracabilite || "",
      typologie_de_produit: product?.typologie_de_produit || "",
    };

    if (isArome) {
      base.famille_arome = product?.famille_arome || "";
      base.saveur = product?.saveur || "";
      base.profil_aromatique = product?.profil_aromatique || "";
      base.dosage = product?.dosage || "";
      base.ph = product?.ph || "";
      base.base = product?.base || "";
      base.food_grade = product?.food_grade || "";
    }

    if (isCosmetique) {
      base.famille_cosmetique = product?.famille_cosmetique || "";
      base.type_de_peau = product?.type_de_peau || "";
      base.partie_utilisee = product?.partie_utilisee || "";
      base.benefices_aqueux = product?.benefices_aqueux || "";
      base.benefices_huileux = product?.benefices_huileux || "";
      base.calendrier_des_recoltes = product?.calendrier_des_recoltes || "";
      base.conservateurs = product?.conservateurs || "";
    }

    if (isParfum) {
      base.famille_olfactive = product?.famille_olfactive || "";
      base.profil_olfactif = product?.profil_olfactif || "";
      base.odeur = product?.odeur || "";
      base.nom_latin = product?.nom_latin || "";
      base.food_grade = product?.food_grade || "";
      base.calendrier_recoltes = product?.calendrier_recoltes || product?.calendrier_des_recoltes || "";
      base.flavouring_preparation = product?.flavouring_preparation || "";
    }

    return base;
  });

  // Performance & Stability state (parfums only)
  const [perfRows, setPerfRows] = useState<Omit<PerformanceRow, "product_code">[]>(() => {
    if (!isParfum) return [];
    if (performanceData && performanceData.length > 0) {
      return performanceData.map((r) => ({
        ordre: r.ordre,
        option_name: r.option_name,
        performance_value: r.performance_value,
        performance_rating: r.performance_rating,
      }));
    }
    return PERF_DEFAULTS;
  });

  const [stabRows, setStabRows] = useState<Omit<StabiliteRow, "product_code">[]>(() => {
    if (!isParfum) return [];
    if (stabiliteData && stabiliteData.length > 0) {
      return stabiliteData.map((r) => ({
        ordre: r.ordre,
        base_name: r.base_name,
        ph_value: r.ph_value,
        odeur_rating: r.odeur_rating,
      }));
    }
    return STAB_DEFAULTS;
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

      // Save performance & stability for parfums
      if (isParfum && form.code) {
        // Performance
        await (supabase.from("parfum_performance") as any).delete().eq("product_code", form.code);
        const validPerf = perfRows
          .filter((r) => r.performance_value || r.performance_rating)
          .map((r) => ({ ...r, product_code: form.code }));
        if (validPerf.length > 0) {
          await (supabase.from("parfum_performance") as any).insert(validPerf);
        }

        // Stability
        await (supabase.from("parfum_stabilite") as any).delete().eq("product_code", form.code);
        const validStab = stabRows
          .filter((r) => r.odeur_rating !== null && r.odeur_rating > 0)
          .map((r) => ({ ...r, product_code: form.code }));
        if (validStab.length > 0) {
          await (supabase.from("parfum_stabilite") as any).insert(validStab);
        }
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

          {/* Status */}
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

          {/* ── Identification ── */}
          <div>
            <SectionTitle>Identification</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Code *">
                <Input value={form.code} onChange={(e) => handleChange("code", e.target.value)} disabled={!isNew} className="h-10 font-mono" />
              </Field>
              <Field label="Nom commercial">
                <Input value={form.nom_commercial} onChange={(e) => handleChange("nom_commercial", e.target.value)} className="h-10" />
              </Field>
              <Field label="INCI">
                <Input value={form.inci} onChange={(e) => handleChange("inci", e.target.value)} className="h-10 font-mono text-sm" />
              </Field>
              <Field label="N° CAS">
                <Input value={form.cas_no} onChange={(e) => handleChange("cas_no", e.target.value)} className="h-10 font-mono text-sm" />
              </Field>
            </div>
          </div>

          {/* ── Classification ── */}
          <div>
            <SectionTitle>Classification</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isArome && (
                <>
                  <ComboboxField label="Famille aromatique" value={form.famille_arome} onChange={(v) => handleChange("famille_arome", v)} options={OPTIONS.famille_arome} placeholder="Sélectionner..." />
                  <ComboboxField label="Saveur" value={form.saveur} onChange={(v) => handleChange("saveur", v)} options={OPTIONS.saveur_arome} placeholder="Sélectionner..." />
                </>
              )}
              {isCosmetique && (
                <>
                  <ComboboxField label="Famille cosmétique" value={form.famille_cosmetique} onChange={(v) => handleChange("famille_cosmetique", v)} options={OPTIONS.famille_cosmetique} placeholder="Sélectionner..." />
                  <ComboboxField label="Origine" value={form.origine} onChange={(v) => handleChange("origine", v)} options={OPTIONS.origine_cosmetique} placeholder="Sélectionner..." />
                  <ComboboxField label="Solubilité" value={form.solubilite} onChange={(v) => handleChange("solubilite", v)} options={OPTIONS.solubilite} placeholder="Sélectionner..." />
                  <ComboboxField label="Aspect" value={form.aspect} onChange={(v) => handleChange("aspect", v)} options={OPTIONS.aspect_cosmetique} placeholder="Sélectionner..." />
                  <ComboboxField label="Conservateurs" value={form.conservateurs} onChange={(v) => handleChange("conservateurs", v)} options={OPTIONS.conservateurs} placeholder="Sélectionner..." />
                  <ComboboxField label="Application" value={form.application} onChange={(v) => handleChange("application", v)} options={OPTIONS.application} placeholder="Sélectionner..." />
                  <ComboboxField label="Type de peau" value={form.type_de_peau} onChange={(v) => handleChange("type_de_peau", v)} options={OPTIONS.type_de_peau} placeholder="Sélectionner..." />
                </>
              )}
              {isParfum && (
                <>
                  <ComboboxField label="Famille olfactive" value={form.famille_olfactive} onChange={(v) => handleChange("famille_olfactive", v)} options={OPTIONS.famille_olfactive} placeholder="Sélectionner..." />
                  <ComboboxField label="Origine" value={form.origine} onChange={(v) => handleChange("origine", v)} options={OPTIONS.origine_parfum} placeholder="Sélectionner..." />
                  <ComboboxField label="Aspect" value={form.aspect} onChange={(v) => handleChange("aspect", v)} options={OPTIONS.aspect_parfum} placeholder="Sélectionner..." />
                  <ComboboxField label="Food Grade" value={form.food_grade} onChange={(v) => handleChange("food_grade", v)} options={OPTIONS.food_grade} placeholder="Sélectionner..." />
                  <ComboboxField label="Flavouring Preparation" value={form.flavouring_preparation} onChange={(v) => handleChange("flavouring_preparation", v)} options={OPTIONS.flavouring_preparation} placeholder="Sélectionner..." />
                </>
              )}
              {isArome && (
                <ComboboxField label="Aspect" value={form.aspect} onChange={(v) => handleChange("aspect", v)} options={OPTIONS.aspect_arome} placeholder="Sélectionner..." />
              )}
              <Field label="Gamme">
                <Input value={form.gamme} onChange={(e) => handleChange("gamme", e.target.value)} className="h-10" />
              </Field>
              <Field label="Certifications">
                <Input value={form.certifications} onChange={(e) => handleChange("certifications", e.target.value)} className="h-10" />
              </Field>
              <Field label="Valorisations">
                <Input value={form.valorisations} onChange={(e) => handleChange("valorisations", e.target.value)} className="h-10" />
              </Field>
              <ComboboxField label="Statut" value={form.statut} onChange={(v) => handleChange("statut", v)} options={OPTIONS.statut} placeholder="Sélectionner..." />
            </div>
          </div>

          {/* ── Détails ── */}
          <div>
            <SectionTitle>Détails</SectionTitle>
            <div className="space-y-4">
              <Field label="Description">
                <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={3} className="text-sm" placeholder="Description du produit..." />
              </Field>
              <Field label="Bénéfices">
                <Textarea value={form.benefices} onChange={(e) => handleChange("benefices", e.target.value)} rows={3} className="text-sm" placeholder="Bénéfices du produit..." />
              </Field>
              <Field label="Application">
                <Textarea value={form.application} onChange={(e) => handleChange("application", e.target.value)} rows={3} className="text-sm" placeholder="Applications recommandées..." />
              </Field>
            </div>
          </div>

          {/* ── Aromes : section spécifique ── */}
          {isArome && (
            <div>
              <SectionTitle>Profil aromatique</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Profil aromatique">
                  <Input value={form.profil_aromatique} onChange={(e) => handleChange("profil_aromatique", e.target.value)} className="h-10" />
                </Field>
                <Field label="Dosage">
                  <Input value={form.dosage} onChange={(e) => handleChange("dosage", e.target.value)} className="h-10" />
                </Field>
                <Field label="Base">
                  <Input value={form.base} onChange={(e) => handleChange("base", e.target.value)} className="h-10" />
                </Field>
                <ComboboxField label="Food Grade" value={form.food_grade} onChange={(v) => handleChange("food_grade", v)} options={OPTIONS.food_grade} placeholder="Sélectionner..." />
              </div>
            </div>
          )}

          {/* ── Cosmétiques : section spécifique ── */}
          {isCosmetique && (
            <div>
              <SectionTitle>Détails cosmétiques</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Partie utilisée">
                  <Input value={form.partie_utilisee} onChange={(e) => handleChange("partie_utilisee", e.target.value)} className="h-10" />
                </Field>
                <Field label="Calendrier des récoltes">
                  <Input value={form.calendrier_des_recoltes} onChange={(e) => handleChange("calendrier_des_recoltes", e.target.value)} className="h-10" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Bénéfices aqueux">
                  <Textarea value={form.benefices_aqueux} onChange={(e) => handleChange("benefices_aqueux", e.target.value)} rows={2} className="text-sm" />
                </Field>
                <Field label="Bénéfices huileux">
                  <Textarea value={form.benefices_huileux} onChange={(e) => handleChange("benefices_huileux", e.target.value)} rows={2} className="text-sm" />
                </Field>
              </div>
            </div>
          )}

          {/* ── Parfums : section spécifique ── */}
          {isParfum && (
            <>
              <div>
                <SectionTitle>Profil olfactif</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Profil olfactif">
                    <Textarea value={form.profil_olfactif} onChange={(e) => handleChange("profil_olfactif", e.target.value)} rows={2} className="text-sm" />
                  </Field>
                  <Field label="Odeur">
                    <Input value={form.odeur} onChange={(e) => handleChange("odeur", e.target.value)} className="h-10" />
                  </Field>
                  <Field label="Nom latin">
                    <Input value={form.nom_latin} onChange={(e) => handleChange("nom_latin", e.target.value)} className="h-10 italic" />
                  </Field>
                  <Field label="Food Grade">
                    <Input value={form.food_grade} onChange={(e) => handleChange("food_grade", e.target.value)} className="h-10" />
                  </Field>
                  <Field label="Flavouring Preparation">
                    <Input value={form.flavouring_preparation} onChange={(e) => handleChange("flavouring_preparation", e.target.value)} className="h-10" />
                  </Field>
                  <Field label="Calendrier des récoltes">
                    <Input value={form.calendrier_recoltes} onChange={(e) => handleChange("calendrier_recoltes", e.target.value)} className="h-10" />
                  </Field>
                </div>
              </div>

              {/* ── Performance ── */}
              <div>
                <SectionTitle>Performance</SectionTitle>
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-100/50">
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Critère</th>
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Valeur</th>
                        <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perfRows.map((row, i) => (
                        <tr key={row.ordre} className="border-b last:border-0">
                          <td className="px-4 py-2.5 font-medium text-gray-700">{row.option_name}</td>
                          <td className="px-4 py-2.5">
                            {row.ordre <= 2 ? (
                              <Input
                                value={row.performance_value || ""}
                                onChange={(e) => {
                                  const updated = [...perfRows];
                                  updated[i] = { ...updated[i], performance_value: e.target.value };
                                  setPerfRows(updated);
                                }}
                                className="h-8 text-sm"
                                placeholder="Ex: 0,1% - 2%"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 flex justify-center">
                            {row.ordre > 2 ? (
                              <StarRatingInput
                                value={row.performance_rating}
                                onChange={(v) => {
                                  const updated = [...perfRows];
                                  updated[i] = { ...updated[i], performance_rating: v };
                                  setPerfRows(updated);
                                }}
                                size="sm"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Stabilité ── */}
              <div>
                <SectionTitle>Stabilité</SectionTitle>
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-100/50">
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-16">pH</th>
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Base</th>
                        <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Odeur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stabRows.map((row, i) => (
                        <tr key={row.ordre} className="border-b last:border-0">
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center justify-center w-10 h-6 rounded-md bg-brand-primary/10 text-brand-primary text-xs font-bold">
                              {row.ph_value}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-medium text-gray-700">{row.base_name}</td>
                          <td className="px-4 py-2.5 flex justify-center">
                            <StarRatingInput
                              value={row.odeur_rating}
                              onChange={(v) => {
                                const updated = [...stabRows];
                                updated[i] = { ...updated[i], odeur_rating: v };
                                setStabRows(updated);
                              }}
                              size="sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
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
