import { ConnectorsSettings } from "@/components/admin/ConnectorsSettings";
import { Plug } from "lucide-react";

export default function SettingsConnectorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
          <Plug className="w-5 h-5" />
          Connecteurs
        </h2>
        <p className="text-sm text-brand-secondary/50 mb-4">
          Connectez des services externes pour enrichir votre plateforme.
        </p>
      </div>

      <ConnectorsSettings />
    </div>
  );
}
