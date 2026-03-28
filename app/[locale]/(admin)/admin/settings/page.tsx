import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConnectorsSettings } from "@/components/admin/ConnectorsSettings";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { createClient } from "@/lib/supabase/server";
import { Settings, Plug, Tag } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categories } = await (supabase.from("blog_categories") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminPageHeader
        title="Paramètres"
        subtitle="Configuration de la plateforme"
      />

      <div className="max-w-3xl space-y-8">
        {/* Catégories d'articles */}
        <div>
          <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Catégories d&apos;articles
          </h2>
          <p className="text-sm text-brand-secondary/50 mb-4">
            Gérez les catégories et leurs couleurs pour le blog.
          </p>
          <CategoryManager initialCategories={categories || []} />
        </div>

        {/* Connecteurs */}
        <div>
          <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
            <Plug className="w-5 h-5" />
            Connecteurs
          </h2>
          <p className="text-sm text-brand-secondary/50 mb-4">
            Connectez des services externes pour enrichir votre plateforme.
          </p>
          <ConnectorsSettings />
        </div>

        {/* Informations générales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-primary mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informations générales
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Nom du site</span>
              <span className="font-medium">IES Ingredients</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">URL</span>
              <span className="font-medium">ies-ingredients.com</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Framework</span>
              <span className="font-medium">Next.js 16</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Base de données</span>
              <span className="font-medium">Supabase (PostgreSQL)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Langues</span>
              <span className="font-medium">Français, English</span>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-brand-primary mb-4">
            Actions de maintenance
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Revalider le cache</p>
                <p className="text-xs text-gray-500">Force la régénération des pages statiques</p>
              </div>
              <form action="/api/revalidate" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-secondary transition-colors"
                >
                  Revalider
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
