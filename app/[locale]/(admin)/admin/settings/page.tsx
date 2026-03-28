import { Settings } from "lucide-react";

export default function SettingsGeneralPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Informations générales
        </h2>
        <p className="text-sm text-brand-secondary/50 mb-4">
          Informations de base sur votre plateforme.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
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
    </div>
  );
}
