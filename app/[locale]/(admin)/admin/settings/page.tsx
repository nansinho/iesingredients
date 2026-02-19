import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  return (
    <>
      <AdminPageHeader
        title="Paramètres"
        subtitle="Configuration de la plateforme"
      />

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-forest-900 mb-4 flex items-center gap-2">
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

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-forest-900 mb-4">
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
                  className="px-4 py-2 bg-forest-900 text-white text-sm rounded-lg hover:bg-forest-800 transition-colors"
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
