"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export function BlogAdmin({
  initialArticles,
  locale,
}: {
  initialArticles: any[];
  locale: string;
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState("");

  const filtered = articles.filter(
    (a) =>
      !search ||
      a.title_fr?.toLowerCase().includes(search.toLowerCase()) ||
      a.slug?.toLowerCase().includes(search.toLowerCase())
  );

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
      key: "title_fr",
      label: "Titre",
      render: (item: any) => (
        <span className="font-medium">{item.title_fr}</span>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (item: any) => (
        <Badge variant="secondary">{item.category}</Badge>
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
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer">
              <Eye className="w-3 h-3 mr-1" /> Publié
            </Badge>
          ) : (
            <Badge variant="secondary" className="hover:bg-gray-200 transition-colors cursor-pointer">
              <EyeOff className="w-3 h-3 mr-1" /> Brouillon
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
          ? new Date(item.created_at).toLocaleDateString("fr-FR")
          : "",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Articles de Blog"
        subtitle={`${articles.length} articles`}
        actions={
          <Link href={`/${locale}/admin/blog/new`}>
            <Button size="sm" className="bg-forest-900 text-white hover:bg-forest-800 rounded-lg gap-2">
              <Plus className="w-4 h-4" />
              Nouvel article
            </Button>
          </Link>
        }
      />

      <AdminDataTable
        data={filtered}
        columns={columns}
        idKey="id"
        editPath={`/${locale}/admin/blog`}
        onDelete={handleDelete}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un article..."
      />
    </>
  );
}
