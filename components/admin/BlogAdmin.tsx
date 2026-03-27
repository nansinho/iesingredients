"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { Plus, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlidePanel } from "@/components/admin/SlidePanel";
import { BlogEditForm } from "@/components/admin/BlogEditForm";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function BlogAdmin({
  initialArticles,
}: {
  initialArticles: any[];
  locale: string;
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await (supabase.from("blog_articles") as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setArticles(data);
  }, []);

  const filtered = articles.filter(
    (a) =>
      !search ||
      a.title_fr?.toLowerCase().includes(search.toLowerCase()) ||
      a.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingArticle(null);
    setIsNew(true);
    setPanelOpen(true);
  };

  const openEdit = (article: any) => {
    setEditingArticle(article);
    setIsNew(false);
    setPanelOpen(true);
  };

  const handleSave = () => {
    setPanelOpen(false);
    refresh();
  };

  const togglePublish = async (id: string, published: boolean) => {
    const supabase = createClient();
    const { error } = await (supabase.from("blog_articles") as any)
      .update({
        published: !published,
        published_at: !published ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) {
      toast.error("Erreur");
      return;
    }
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, published: !published, published_at: !published ? new Date().toISOString() : null }
          : a
      )
    );
    toast.success(!published ? "Article publié" : "Article dépublié");
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from("blog_articles") as any)
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast.success("Article supprimé");
  };

  const columns = [
    {
      key: "cover_image_url",
      label: "",
      render: (item: any) =>
        item.cover_image_url ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--brand-primary)]/5 flex items-center justify-center text-[var(--brand-secondary)]/30 text-xs">
            IMG
          </div>
        ),
    },
    {
      key: "title_fr",
      label: "Titre",
      render: (item: any) => (
        <div>
          <span className="font-medium text-[var(--brand-primary)]">{item.title_fr}</span>
          <p className="text-xs text-[var(--brand-secondary)]/50 mt-0.5 font-mono">/{item.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (item: any) => (
        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
      ),
    },
    {
      key: "published",
      label: "Statut",
      render: (item: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePublish(item.id, item.published);
          }}
          className="flex items-center gap-1.5"
        >
          {item.published ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer gap-1">
              <Eye className="w-3 h-3" /> Publié
            </Badge>
          ) : (
            <Badge variant="secondary" className="hover:bg-gray-200 transition-colors cursor-pointer gap-1">
              <EyeOff className="w-3 h-3" /> Brouillon
            </Badge>
          )}
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (item: any) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Articles & Actualités"
        subtitle={`${articles.length} articles`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="rounded-lg gap-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={openNew}
              className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-secondary)] rounded-lg gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel article
            </Button>
          </div>
        }
      />

      <AdminDataTable
        data={filtered}
        columns={columns}
        idKey="id"
        onDelete={handleDelete}
        onRowClick={openEdit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un article..."
      />

      {/* Slide Panel for editing */}
      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={isNew ? "Nouvel article" : `Modifier : ${editingArticle?.title_fr || ""}`}
        subtitle={isNew ? "Créer un nouvel article" : `Slug: /${editingArticle?.slug || ""}`}
      >
        <BlogEditForm
          article={editingArticle}
          isNew={isNew}
          onSave={handleSave}
          onCancel={() => setPanelOpen(false)}
        />
      </SlidePanel>
    </>
  );
}
