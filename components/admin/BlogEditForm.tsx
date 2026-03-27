"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { Save, Loader2, Sparkles, Globe, Eye, EyeOff, ChevronDown, ChevronUp, FileText } from "lucide-react";
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
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PDFImport } from "@/components/admin/PDFImport";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface BlogEditFormProps {
  article: Record<string, any> | null;
  isNew: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function BlogEditForm({ article, isNew, onSave, onCancel }: BlogEditFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr");
  const [showSeo, setShowSeo] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showPDFImport, setShowPDFImport] = useState(false);
  const [coverAlt, setCoverAlt] = useState(article?.cover_image_alt || "");
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
    meta_title: article?.meta_title || "",
    meta_description: article?.meta_description || "",
  });

  const handleChange = useCallback((key: string, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title_fr" && isNew) {
        next.slug = (value as string)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
  }, [isNew]);

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

      onSave?.();
    } catch (err: unknown) {
      toast.error("Erreur: " + (err instanceof Error ? err.message : "Échec"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Décrivez le sujet de votre article");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_article",
          prompt: aiPrompt,
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error("Erreur API");
      const result = await res.json();

      if (result.title_fr) handleChange("title_fr", result.title_fr);
      if (result.title_en) handleChange("title_en", result.title_en);
      if (result.excerpt_fr) handleChange("excerpt_fr", result.excerpt_fr);
      if (result.excerpt_en) handleChange("excerpt_en", result.excerpt_en);
      if (result.content_fr) handleChange("content_fr", result.content_fr);
      if (result.content_en) handleChange("content_en", result.content_en);
      if (result.meta_title) handleChange("meta_title", result.meta_title);
      if (result.meta_description) handleChange("meta_description", result.meta_description);

      toast.success("Article généré par IA !");
    } catch {
      toast.error("La génération IA n'est pas encore configurée. Ajoutez l'endpoint /api/translate avec l'action generate_article.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePDFImport = useCallback((mapping: Record<string, string>) => {
    // Debug: log what we're importing
    console.log("[BlogEditForm] PDF import content_fr:", mapping.content_fr?.substring(0, 300));
    console.log("[BlogEditForm] PDF import keys:", Object.keys(mapping));

    setForm((prev) => {
      const next = { ...prev };
      Object.entries(mapping).forEach(([key, value]) => {
        if (key in next) {
          (next as any)[key] = value;
        }
      });
      // Auto-generate slug from title if new
      if (isNew && mapping.title_fr) {
        next.slug = mapping.title_fr
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
    setShowPDFImport(false);
    toast.success("Contenu importé du PDF");
  }, [isNew]);

  const categories = [
    { value: "news", label: "Nouveautés" },
    { value: "press", label: "Communiqué de presse" },
    { value: "events", label: "Événements" },
    { value: "certifications", label: "Certifications" },
    { value: "trends", label: "Tendances" },
  ];

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* ── Tools Row ── */}
          <div className="flex gap-3">
            {/* AI Generation */}
            <div className="flex-1 rounded-xl border border-[var(--brand-accent)]/20 bg-[var(--brand-accent)]/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[var(--brand-accent)]" />
                <span className="text-sm font-semibold text-[var(--brand-primary)]">Générer avec l&apos;IA</span>
              </div>
            <div className="flex gap-2">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Un article sur les bienfaits de l'huile d'argan en cosmétique..."
                className="flex-1 h-10 text-sm"
              />
              <Button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="bg-[var(--brand-accent)] text-white hover:bg-[var(--brand-accent-hover)] shrink-0"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="ml-2 hidden sm:inline">Générer</span>
              </Button>
            </div>
          </div>

            {/* PDF Import */}
            <div className="w-48 rounded-xl border border-[var(--brand-primary)]/10 bg-[var(--brand-primary)]/[0.02] p-4 flex flex-col items-center justify-center gap-2 shrink-0">
              <FileText className="w-5 h-5 text-[var(--brand-secondary)]/50" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPDFImport(true)}
                className="text-xs rounded-lg w-full"
              >
                Importer un PDF
              </Button>
            </div>
          </div>

          {/* ── Cover Image ── */}
          <ImageUpload
            value={form.cover_image_url}
            onChange={(url) => handleChange("cover_image_url", url)}
            onAltChange={setCoverAlt}
            altValue={coverAlt}
            folder="blog"
            label="Image de couverture"
            aspect="banner"
            showAlt={true}
            onOpenLibrary={() => setShowMediaLibrary(true)}
          />

          {/* ── Meta Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[var(--brand-primary)]">Catégorie</Label>
              <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--brand-primary)]">Auteur</Label>
              <Input
                value={form.author_name}
                onChange={(e) => handleChange("author_name", e.target.value)}
                placeholder="Nom de l'auteur"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[var(--brand-primary)]">Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="h-10 font-mono text-sm"
                placeholder="mon-article"
              />
            </div>
          </div>

          {/* ── Language Tabs ── */}
          <div className="flex items-center gap-1 p-1 bg-[var(--brand-primary)]/5 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("fr")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "fr"
                  ? "bg-white text-[var(--brand-primary)] shadow-sm"
                  : "text-[var(--brand-secondary)]/60 hover:text-[var(--brand-primary)]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Français
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "en"
                  ? "bg-white text-[var(--brand-primary)] shadow-sm"
                  : "text-[var(--brand-secondary)]/60 hover:text-[var(--brand-primary)]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                English
              </span>
            </button>
          </div>

          {/* ── FR Content ── */}
          {activeTab === "fr" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Label className="text-[var(--brand-primary)]">Titre (FR) *</Label>
                <Input
                  value={form.title_fr}
                  onChange={(e) => handleChange("title_fr", e.target.value)}
                  className="h-12 text-lg font-medium"
                  placeholder="Titre de l'article"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--brand-primary)]">Extrait (FR)</Label>
                <Textarea
                  value={form.excerpt_fr}
                  onChange={(e) => handleChange("excerpt_fr", e.target.value)}
                  rows={2}
                  placeholder="Résumé court de l'article..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--brand-primary)]">Contenu (FR)</Label>
                <RichTextEditor
                  content={form.content_fr}
                  onChange={(html) => handleChange("content_fr", html)}
                  placeholder="Rédigez votre article ici..."
                />
              </div>
            </div>
          )}

          {/* ── EN Content ── */}
          {activeTab === "en" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Label className="text-[var(--brand-primary)]">Title (EN)</Label>
                <Input
                  value={form.title_en}
                  onChange={(e) => handleChange("title_en", e.target.value)}
                  className="h-12 text-lg font-medium"
                  placeholder="Article title"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--brand-primary)]">Excerpt (EN)</Label>
                <Textarea
                  value={form.excerpt_en}
                  onChange={(e) => handleChange("excerpt_en", e.target.value)}
                  rows={2}
                  placeholder="Short article summary..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--brand-primary)]">Content (EN)</Label>
                <RichTextEditor
                  content={form.content_en}
                  onChange={(html) => handleChange("content_en", html)}
                  placeholder="Write your article here..."
                />
              </div>
            </div>
          )}

          {/* ── SEO Section ── */}
          <div className="rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.02] transition-colors rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--brand-secondary)]/50" />
                SEO & Métadonnées
              </span>
              {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showSeo && (
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                <div className="space-y-2">
                  <Label className="text-[var(--brand-primary)]">Meta Title</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => handleChange("meta_title", e.target.value)}
                    placeholder={form.title_fr || "Titre SEO"}
                    className="h-10"
                  />
                  <p className="text-xs text-[var(--brand-secondary)]/50">
                    {(form.meta_title || form.title_fr).length}/60 caractères recommandés
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--brand-primary)]">Meta Description</Label>
                  <Textarea
                    value={form.meta_description}
                    onChange={(e) => handleChange("meta_description", e.target.value)}
                    placeholder={form.excerpt_fr || "Description SEO"}
                    rows={2}
                    className="text-sm"
                  />
                  <p className="text-xs text-[var(--brand-secondary)]/50">
                    {(form.meta_description || form.excerpt_fr).length}/155 caractères recommandés
                  </p>
                </div>
                {/* SEO Preview */}
                <div className="rounded-lg bg-[#FAFAF8] p-4 space-y-1">
                  <p className="text-xs text-[var(--brand-secondary)]/40 uppercase tracking-wider font-medium">Aperçu Google</p>
                  <p className="text-[#1a0dab] text-base font-medium leading-tight truncate">
                    {form.meta_title || form.title_fr || "Titre de l'article"}
                  </p>
                  <p className="text-[#006621] text-xs truncate">
                    wpgrok.fr/actualites/{form.slug || "mon-article"}
                  </p>
                  <p className="text-[#545454] text-xs leading-relaxed line-clamp-2">
                    {form.meta_description || form.excerpt_fr || "Description de l'article..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky Footer ── */}
      <div className="shrink-0 border-t border-gray-100 bg-[#FAFAF8] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange("published", !form.published)}
            className="flex items-center gap-2 text-sm"
          >
            {form.published ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer gap-1.5 px-3 py-1">
                <Eye className="w-3.5 h-3.5" /> Publié
              </Badge>
            ) : (
              <Badge variant="secondary" className="cursor-pointer gap-1.5 px-3 py-1 hover:bg-gray-200 transition-colors">
                <EyeOff className="w-3.5 h-3.5" /> Brouillon
              </Badge>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-lg">
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-secondary)] rounded-lg px-6"
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

      {/* Media Library Modal */}
      <MediaLibrary
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(url, alt) => {
          handleChange("cover_image_url", url);
          setCoverAlt(alt);
        }}
        folder="blog"
      />

      {/* PDF Import Modal */}
      {showPDFImport && (
        <PDFImport
          onImport={handlePDFImport}
          onClose={() => setShowPDFImport(false)}
        />
      )}
    </>
  );
}
