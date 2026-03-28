import { AuditTimeline } from "@/components/admin/AuditTimeline";
import { Clock } from "lucide-react";

export default function SettingsAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historique d&apos;activité
        </h2>
        <p className="text-sm text-brand-secondary/50 mb-4">
          Suivi des actions réalisées par les administrateurs. Rétention : 2 ans.
        </p>
      </div>

      <AuditTimeline />
    </div>
  );
}
