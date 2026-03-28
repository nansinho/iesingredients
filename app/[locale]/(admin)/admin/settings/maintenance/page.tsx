import { Wrench } from "lucide-react";

export default function SettingsMaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Maintenance
        </h2>
        <p className="text-sm text-brand-secondary/50 mb-4">
          Outils de maintenance et diagnostics.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-brand-primary mb-4">
          Actions de maintenance
        </h3>
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
  );
}
