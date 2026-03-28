"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useRef, useEffect } from "react";
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
import { RichTextEditor, type RichTextEditorHandle } from "@/components/admin/RichTextEditor";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PDFImport } from "@/components/admin/PDFImport";
import { URLImport } from "@/components/admin/URLImport";
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
  const [mediaLibraryTarget, setMediaLibraryTarget] = useState<"cover" | "content_fr" | "content_en">("cover");
  const [showPDFImport, setShowPDFImport] = useState(false);
  const [showURLImport, setShowURLImport] = useState(false);
  const [isNewArticle, setIsNewArticle] = useState(isNew);
  const articleIdRef = useRef<string | null>(article?.id || null);
  const editorFrRef = useRef<RichTextEditorHandle | null>(null);
  const editorEnRef = useRef<RichTextEditorHandle | null>(null);
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
      if (key === "title_fr" && isNewArticle) {
        next.slug = (value as string)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
  }, [isNewArticle]);

  const saveArticle = useCallback(async (formData: typeof form) => {
    const supabase = createClient();
    const data = {
      ...formData,
      published_at: formData.published ? article?.published_at || new Date().toISOString() : null,
    };

    if (isNewArticle) {
      const { data: inserted, error } = await (supabase.from("blog_articles") as any)
        .insert(data)
        .select("id")
        .single();
      if (error) throw error;
      setIsNewArticle(false);
      articleIdRef.current = inserted.id;
      return inserted.id;
    } else {
      const { error } = await (supabase.from("blog_articles") as any)
        .update(data)
        .eq("id", articleIdRef.current);
      if (error) throw error;
      return articleIdRef.current;
    }
  }, [isNewArticle, article?.published_at]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_fr || !form.slug) {
      toast.error("Le titre et le slug sont obligatoires");
      return;
    }
    setIsSaving(true);

    try {
      await saveArticle(form);
      toast.success(isNewArticle ? "Article créé" : "Article mis à jour");
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
      // Use suggested_slug from AI or auto-generate from title
      if (isNewArticle) {
        if (mapping.suggested_slug) {
          next.slug = mapping.suggested_slug;
        } else if (mapping.title_fr) {
          next.slug = mapping.title_fr
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        }
      }
      return next;
    });
    setShowPDFImport(false);
    toast.success("Article importé et optimisé SEO");
  }, [isNewArticle]);

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch("/api/blog-categories")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c) => ({ value: c.slug, label: c.label_fr })));
        }
      })
      .catch(() => {
        // Fallback si la table n'existe pas encore
        setCategories([
          { value: "news", label: "Actualités" },
          { value: "press", label: "Presse" },
          { value: "events", label: "Événements" },
          { value: "trends", label: "Tendances" },
        ]);
      });
  }, []);

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* ── Tools Row ── */}
          <div className="flex gap-3">
            {/* AI Generation */}
            <div className="flex-1 rounded-xl border border-brand-accent/20 bg-brand-accent/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-accent" />
                <span className="text-sm font-semibold text-brand-primary">Générer avec l&apos;IA</span>
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
                className="bg-brand-accent text-white hover:bg-brand-accent-hover shrink-0"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="ml-2 hidden sm:inline">Générer</span>
              </Button>
            </div>
          </div>

            {/* PDF Import */}
            <div className="w-36 rounded-xl border border-brand-primary/10 bg-brand-primary/[0.02] p-4 flex flex-col items-center justify-center gap-2 shrink-0">
              <FileText className="w-5 h-5 text-brand-secondary/50" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPDFImport(true)}
                className="text-xs rounded-lg w-full"
              >
                Importer PDF
              </Button>
            </div>

            {/* URL Import */}
            <div className="w-36 rounded-xl border border-brand-primary/10 bg-brand-primary/[0.02] p-4 flex flex-col items-center justify-center gap-2 shrink-0">
              <Globe className="w-5 h-5 text-brand-secondary/50" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowURLImport(true)}
                className="text-xs rounded-lg w-full"
              >
                Importer URL
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
            onOpenLibrary={() => { setMediaLibraryTarget("cover"); setShowMediaLibrary(true); }}
          />

          {/* ── Meta Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">Catégorie</Label>
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
              <Label className="text-brand-primary">Auteur</Label>
              <Input
                value={form.author_name}
                onChange={(e) => handleChange("author_name", e.target.value)}
                placeholder="Nom de l'auteur"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="h-10 font-mono text-sm"
                placeholder="mon-article"
              />
            </div>
          </div>

          {/* ── Language Tabs ── */}
          <div className="flex items-center gap-1 p-1 bg-brand-primary/5 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("fr")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "fr"
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-brand-secondary/60 hover:text-brand-primary"
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
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-brand-secondary/60 hover:text-brand-primary"
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
                <Label className="text-brand-primary">Titre (FR) *</Label>
                <Input
                  value={form.title_fr}
                  onChange={(e) => handleChange("title_fr", e.target.value)}
                  className="h-12 text-lg font-medium"
                  placeholder="Titre de l'article"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Extrait (FR)</Label>
                <Textarea
                  value={form.excerpt_fr}
                  onChange={(e) => handleChange("excerpt_fr", e.target.value)}
                  rows={2}
                  placeholder="Résumé court de l'article..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Contenu (FR)</Label>
                <RichTextEditor
                  content={form.content_fr}
                  onChange={(html) => handleChange("content_fr", html)}
                  placeholder="Rédigez votre article ici..."
                  onOpenLibrary={() => { setMediaLibraryTarget("content_fr"); setShowMediaLibrary(true); }}
                  editorRef={editorFrRef}
                />
              </div>
            </div>
          )}

          {/* ── EN Content ── */}
          {activeTab === "en" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Label className="text-brand-primary">Title (EN)</Label>
                <Input
                  value={form.title_en}
                  onChange={(e) => handleChange("title_en", e.target.value)}
                  className="h-12 text-lg font-medium"
                  placeholder="Article title"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Excerpt (EN)</Label>
                <Textarea
                  value={form.excerpt_en}
                  onChange={(e) => handleChange("excerpt_en", e.target.value)}
                  rows={2}
                  placeholder="Short article summary..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">Content (EN)</Label>
                <RichTextEditor
                  content={form.content_en}
                  onChange={(html) => handleChange("content_en", html)}
                  placeholder="Write your article here..."
                  onOpenLibrary={() => { setMediaLibraryTarget("content_en"); setShowMediaLibrary(true); }}
                  editorRef={editorEnRef}
                />
              </div>
            </div>
          )}

          {/* ── SEO Section ── */}
          {(() => {
            const metaTitle = form.meta_title || form.title_fr;
            const metaDesc = form.meta_description || form.excerpt_fr;
            const contentText = form.content_fr.replace(/<[^>]*>/g, "");
            const wordCount = contentText.split(/\s+/).filter(Boolean).length;
            const hasH2 = /<h2/i.test(form.content_fr);
            const hasLists = /<[ou]l/i.test(form.content_fr);
            const hasStrong = /<strong/i.test(form.content_fr);

            const checks = [
              { ok: metaTitle.length > 0 && metaTitle.length <= 60, label: `Titre SEO (${metaTitle.length}/60)` },
              { ok: metaDesc.length >= 120 && metaDesc.length <= 155, label: `Description (${metaDesc.length}/155)` },
              { ok: wordCount >= 300, label: `Contenu (${wordCount} mots, min 300)` },
              { ok: hasH2, label: "Titres H2 présents" },
              { ok: hasLists, label: "Listes à puces" },
              { ok: hasStrong, label: "Mots-clés en gras" },
              { ok: !!form.cover_image_url, label: "Image de couverture" },
              { ok: !!form.slug, label: "Slug défini" },
            ];
            const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
            const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-500" : "text-red-500";
            const barColor = score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-400" : "bg-red-500";

            return (
              <div className="rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowSeo(!showSeo)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/[0.02] transition-colors rounded-xl"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-secondary/50" />
                    SEO & Métadonnées
                  </span>
                  <span className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${scoreColor}`}>{score}%</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${score}%` }} />
                    </div>
                    {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {showSeo && (
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                    {/* Score breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {checks.map((check) => (
                        <div key={check.label} className={`flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 ${check.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          <span>{check.ok ? "✓" : "✗"}</span>
                          <span className="truncate">{check.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-brand-primary">Meta Title</Label>
                      <Input
                        value={form.meta_title}
                        onChange={(e) => handleChange("meta_title", e.target.value)}
                        placeholder={form.title_fr || "Titre SEO"}
                        className="h-10"
                      />
                      <p className={`text-xs ${metaTitle.length > 60 ? "text-red-500" : "text-brand-secondary/50"}`}>
                        {metaTitle.length}/60 caractères
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-brand-primary">Meta Description</Label>
                      <Textarea
                        value={form.meta_description}
                        onChange={(e) => handleChange("meta_description", e.target.value)}
                        placeholder={form.excerpt_fr || "Description SEO"}
                        rows={2}
                        className="text-sm"
                      />
                      <p className={`text-xs ${metaDesc.length > 155 ? "text-red-500" : "text-brand-secondary/50"}`}>
                        {metaDesc.length}/155 caractères
                      </p>
                    </div>

                    {/* Google Preview */}
                    <div className="rounded-lg bg-white border border-gray-100 p-4 space-y-1">
                      <p className="text-xs text-brand-secondary/40 uppercase tracking-wider font-medium mb-2">Aperçu Google</p>
                      <p className="text-[#1a0dab] text-base font-medium leading-tight truncate">
                        {metaTitle || "Titre de l'article"}
                      </p>
                      <p className="text-[#006621] text-xs truncate">
                        ies-ingredients.com &rsaquo; actualites &rsaquo; {form.slug || "mon-article"}
                      </p>
                      <p className="text-[#545454] text-xs leading-relaxed line-clamp-2">
                        {metaDesc || "Description de l'article..."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
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
              <Badge variant="success" className="gap-1.5 cursor-pointer hover:bg-emerald-100">
                <Eye className="w-3.5 h-3.5" /> Publié
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1.5 cursor-pointer hover:bg-gray-200">
                <EyeOff className="w-3.5 h-3.5" /> Brouillon
              </Badge>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {form.slug && (
            <Button
              type="button"
              variant="outline"
              className="rounded-lg gap-1.5"
              onClick={async () => {
                if (!form.title_fr || !form.slug) {
                  toast.error("Le titre et le slug sont obligatoires pour l'aperçu");
                  return;
                }
                try {
                  await saveArticle(form);
                  toast.success("Brouillon sauvegardé");
                  window.open(`/fr/actualites/${form.slug}?preview=true`, "_blank");
                } catch (err) {
                  toast.error("Erreur sauvegarde : " + (err instanceof Error ? err.message : "Échec"));
                }
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Aperçu
            </Button>
          )}
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
                {isNewArticle ? "Créer" : "Enregistrer"}
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
          if (mediaLibraryTarget === "cover") {
            handleChange("cover_image_url", url);
            setCoverAlt(alt);
          } else {
            const ref = mediaLibraryTarget === "content_fr" ? editorFrRef : editorEnRef;
            ref.current?.insertImage(url, alt);
          }
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
      {showURLImport && (
        <URLImport
          onImport={handlePDFImport}
          onClose={() => setShowURLImport(false)}
        />
      )}
    </>
  );
}
