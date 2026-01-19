import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { History, Copy, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductHistory, type ProductHistoryEntry } from "@/hooks/useProductHistory";
import type { ProductType } from "@/hooks/useAdminProducts";

interface ProductHistoryProps {
  productType: ProductType;
  productCode: string | null;
}

const actionConfig = {
  create: {
    label: "Création",
    icon: Plus,
    variant: "default" as const,
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  update: {
    label: "Modification",
    icon: Pencil,
    variant: "secondary" as const,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  delete: {
    label: "Suppression",
    icon: Trash2,
    variant: "destructive" as const,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  duplicate: {
    label: "Duplication",
    icon: Copy,
    variant: "outline" as const,
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
};

function HistoryEntry({ entry }: { entry: ProductHistoryEntry }) {
  const config = actionConfig[entry.action] || actionConfig.update;
  const Icon = config.icon;
  
  const changedFields = entry.changes
    ? Object.keys(entry.changes).join(", ")
    : null;

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className={`p-1.5 rounded-full ${config.className}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={config.variant} className={`text-xs ${config.className}`}>
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(entry.created_at), "dd MMM yyyy à HH:mm", { locale: fr })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {entry.user_email || "Utilisateur inconnu"}
        </p>
        {changedFields && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Champs modifiés : {changedFields}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProductHistory({ productType, productCode }: ProductHistoryProps) {
  const { data: history, isLoading } = useProductHistory(productType, productCode);

  if (!productCode) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4" />
          Historique des modifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : history && history.length > 0 ? (
          <div>
            {history.map((entry) => (
              <HistoryEntry key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun historique pour ce produit
          </p>
        )}
      </CardContent>
    </Card>
  );
}
