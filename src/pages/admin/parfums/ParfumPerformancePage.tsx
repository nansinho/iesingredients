import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StabilityTable } from "@/components/admin/StabilityTable";
import { PerformanceTable } from "@/components/admin/PerformanceTable";
import { useAdminProduct } from "@/hooks/useAdminProducts";

export default function ParfumPerformancePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading } = useAdminProduct("parfum", code || null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Produit non trouvé</p>
        <Button variant="link" onClick={() => navigate("/admin/parfums")}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/parfums")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance & Stabilité</h1>
          <p className="text-muted-foreground">
            {product.nom_commercial || product.code}
          </p>
        </div>
      </div>

      {/* Performance Table */}
      <PerformanceTable productCode={code!} />

      {/* Stability Table */}
      <StabilityTable productCode={code!} />
    </div>
  );
}
