"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, GripVertical, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Category {
  id: string;
  slug: string;
  label_fr: string;
  label_en: string;
  color_bg: string;
  color_text: string;
  color_border: string;
  sort_order: number;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-xs font-mono w-24"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({
    label_fr: "",
    label_en: "",
    color_bg: "#F0EDE8",
    color_text: "#2E1F3D",
    color_border: "#E0DCD5",
  });

  const refresh = useCallback(async () => {
    const res = await fetch("/api/blog-categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  }, []);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ ...cat });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setSaving(true);
    try {
      const res = await fetch("/api/blog-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast.success("Catégorie mise à jour");
      setEditingId(null);
      setEditForm(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newForm.label_fr.trim()) {
      toast.error("Le label français est requis");
      return;
    }
    setSaving(true);
    try {
      const slug = slugify(newForm.label_fr);
      const res = await fetch("/api/blog-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          ...newForm,
          label_en: newForm.label_en || newForm.label_fr,
          sort_order: categories.length + 1,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast.success("Catégorie créée");
      setIsAdding(false);
      setNewForm({
        label_fr: "",
        label_en: "",
        color_bg: "#EFF6FF",
        color_text: "#1D4ED8",
        color_border: "#BFDBFE",
      });
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/blog-categories?id=${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast.success("Catégorie supprimée");
      setDeleteId(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  };

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updated = [...categories];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    // Update sort_order for both
    const promises = updated.map((cat, i) =>
      fetch("/api/blog-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, sort_order: i + 1 }),
      })
    );

    setCategories(updated);
    await Promise.all(promises);
  };

  return (
    <div className="space-y-4">
      {/* Category List */}
      <div className="space-y-2">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {editingId === cat.id && editForm ? (
              /* Edit Mode */
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Slug</Label>
                    <Input
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      className="h-8 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Label FR</Label>
                    <Input
                      value={editForm.label_fr}
                      onChange={(e) => setEditForm({ ...editForm, label_fr: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Label EN</Label>
                    <Input
                      value={editForm.label_en}
                      onChange={(e) => setEditForm({ ...editForm, label_en: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                  <ColorInput
                    label="Fond"
                    value={editForm.color_bg}
                    onChange={(v) => setEditForm({ ...editForm, color_bg: v })}
                  />
                  <ColorInput
                    label="Texte"
                    value={editForm.color_text}
                    onChange={(v) => setEditForm({ ...editForm, color_text: v })}
                  />
                  <ColorInput
                    label="Bordure"
                    value={editForm.color_border}
                    onChange={(v) => setEditForm({ ...editForm, color_border: v })}
                  />

                  <div className="space-y-1">
                    <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Aperçu</Label>
                    <div
                      className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide"
                      style={{
                        backgroundColor: editForm.color_bg,
                        color: editForm.color_text,
                        borderColor: editForm.color_border,
                      }}
                    >
                      {editForm.label_fr}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button variant="outline" size="sm" onClick={cancelEdit} className="rounded-lg">
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    disabled={saving}
                    className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg gap-1.5"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex flex-col gap-0.5 text-gray-300">
                  <button
                    onClick={() => moveCategory(index, -1)}
                    disabled={index === 0}
                    className="hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide shrink-0"
                  style={{
                    backgroundColor: cat.color_bg,
                    color: cat.color_text,
                    borderColor: cat.color_border,
                  }}
                >
                  {cat.label_fr}
                </div>

                <span className="text-xs text-gray-400 font-mono">{cat.slug}</span>
                <span className="text-xs text-gray-400 hidden sm:inline">/ {cat.label_en}</span>

                <div className="ml-auto flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(cat)}
                    className="h-7 px-2.5 text-xs rounded-lg"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(cat.id)}
                    className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-200 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Aucune catégorie</p>
        )}
      </div>

      {/* Add New Category */}
      {isAdding ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-brand-accent/30 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Label FR *</Label>
              <Input
                value={newForm.label_fr}
                onChange={(e) => setNewForm({ ...newForm, label_fr: e.target.value })}
                className="h-8 text-sm"
                placeholder="Ex: Innovation"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Label EN</Label>
              <Input
                value={newForm.label_en}
                onChange={(e) => setNewForm({ ...newForm, label_en: e.target.value })}
                className="h-8 text-sm"
                placeholder="Ex: Innovation"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <ColorInput
              label="Fond"
              value={newForm.color_bg}
              onChange={(v) => setNewForm({ ...newForm, color_bg: v })}
            />
            <ColorInput
              label="Texte"
              value={newForm.color_text}
              onChange={(v) => setNewForm({ ...newForm, color_text: v })}
            />
            <ColorInput
              label="Bordure"
              value={newForm.color_border}
              onChange={(v) => setNewForm({ ...newForm, color_border: v })}
            />

            <div className="space-y-1">
              <Label className="text-[11px] text-gray-500 uppercase tracking-wider">Aperçu</Label>
              <div
                className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide"
                style={{
                  backgroundColor: newForm.color_bg,
                  color: newForm.color_text,
                  borderColor: newForm.color_border,
                }}
              >
                {newForm.label_fr || "Aperçu"}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="rounded-lg"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={saving}
              className="bg-brand-accent text-white hover:bg-brand-accent-hover rounded-lg gap-1.5"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Créer
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="w-full rounded-xl border-dashed gap-2 text-gray-500 hover:text-brand-accent hover:border-brand-accent/30"
        >
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </Button>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Si des articles utilisent cette catégorie, vous devrez les réassigner avant de pouvoir la supprimer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
