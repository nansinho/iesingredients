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

export function BlogEditForm({
  article,
  backPath,
  isNew,
}: {
  article: Record<string, any> | null;
  backPath: string;
  isNew: boolean;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title_fr: article?.title_fr || "",
    title_en: article?.title_en || "",
    slug: article?.slug || "",
    category: article?.category || "news",
    excerpt_fr: article?.excerpt_fr || "",
    excerpt_en: article?.excerpt_en || "",
    content_fr: article?.content_fr || "",
    content_en: article?.content_en || "",
    cover_image_url: article?.cover_image_url || "",
    author_name: article?.author_name || "",
    published: article?.published || false,
  });

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "title_fr" && isNew) {
      const slug = (value as string)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_fr || !form.slug) {
      toast.error("Le titre et le slug sont obligatoires");
      return;
    }
    setIsSaving(true);

    try {
      const supabase = createClient();
      const data = {
        ...form,
        published_at: form.published ? article?.published_at || new Date().toISOString() : null,
      };

      if (isNew) {
        const { error } = await (supabase.from("blog_articles") as any).insert(data);
        if (error) throw error;
        toast.success("Article créé");
      } else {
        const { error } = await (supabase.from("blog_articles") as any)
          .update(data)
          .eq("id", article?.id);
        if (error) throw error;
        toast.success("Article mis à jour");
      }

      router.push(backPath as any);
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
        title={isNew ? "Nouvel article" : `Modifier: ${article?.title_fr}`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titre (FR) *</Label>
              <Input
                value={form.title_fr}
                onChange={(e) => handleChange("title_fr", e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (EN)</Label>
              <Input
                value={form.title_en}
                onChange={(e) => handleChange("title_en", e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="h-10 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">Nouveautés</SelectItem>
                  <SelectItem value="events">Événements</SelectItem>
                  <SelectItem value="certifications">Certifications</SelectItem>
                  <SelectItem value="trends">Tendances</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input
                value={form.author_name}
                onChange={(e) => handleChange("author_name", e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>Image de couverture (URL)</Label>
              <Input
                value={form.cover_image_url}
                onChange={(e) => handleChange("cover_image_url", e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Extrait (FR)</Label>
            <Textarea
              value={form.excerpt_fr}
              onChange={(e) => handleChange("excerpt_fr", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu (FR) - HTML</Label>
            <Textarea
              value={form.content_fr}
              onChange={(e) => handleChange("content_fr", e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Content (EN) - HTML</Label>
            <Textarea
              value={form.content_en}
              onChange={(e) => handleChange("content_en", e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="bg-forest-900 text-white px-8">
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
