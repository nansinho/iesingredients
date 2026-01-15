import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface SampleRequest {
  id: string;
  user_id: string | null;
  status: string;
  company: string | null;
  message: string | null;
  contact_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
  items: SampleRequestItem[];
  profile?: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

interface SampleRequestItem {
  id: string;
  product_code: string;
  product_name: string;
  product_category: string | null;
  quantity: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  approved: { label: "Approuvée", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  rejected: { label: "Refusée", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  completed: { label: "Traitée", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
};

const categoryColors: Record<string, string> = {
  COSMETIQUE: "bg-primary/10 text-primary border-primary/20",
  AROMES: "bg-forest-100 text-forest-700 border-forest-200",
  PARFUM: "bg-gold-100 text-gold-700 border-gold-200",
};

export default function DemandeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: request, isLoading } = useQuery({
    queryKey: ["admin-sample-request", id],
    queryFn: async (): Promise<SampleRequest | null> => {
      const { data, error } = await supabase
        .from("sample_requests")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Fetch items
      const { data: items } = await supabase
        .from("sample_request_items")
        .select("*")
        .eq("request_id", id);

      // Fetch profile if user_id exists
      let profile = null;
      if (data.user_id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", data.user_id)
          .maybeSingle();
        profile = profileData;
      }

      return { ...data, items: items || [], profile } as SampleRequest;
    },
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase
        .from("sample_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sample-request", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-sample-requests"] });
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Demande non trouvée</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/demandes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const status = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const clientName = request.contact_name || request.profile?.full_name || "Non renseigné";
  const clientEmail = request.contact_email || request.profile?.email;
  const clientPhone = request.contact_phone || request.profile?.phone;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/demandes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Demande #{request.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-muted-foreground">
              Créée le {format(new Date(request.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={`${status.color} text-sm px-3 py-1`}>
          <StatusIcon className="h-4 w-4 mr-2" />
          {status.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produits demandés ({request.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {request.items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun produit dans cette demande
              </p>
            ) : (
              <div className="space-y-3">
                {request.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded">
                            {item.product_code}
                          </code>
                          {item.product_category && (
                            <Badge
                              variant="outline"
                              className={categoryColors[item.product_category] || ""}
                            >
                              {item.product_category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">x{item.quantity}</Badge>
                      <NavLink
                        to={`/fr/produit/${item.product_code}`}
                        target="_blank"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </NavLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Info & Actions */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{clientName}</p>
                </div>
              </div>

              {clientEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${clientEmail}`}
                      className="font-medium hover:underline text-primary"
                    >
                      {clientEmail}
                    </a>
                  </div>
                </div>
              )}

              {request.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Société</p>
                    <p className="font-medium">{request.company}</p>
                  </div>
                </div>
              )}

              {clientPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <a
                      href={`tel:${clientPhone}`}
                      className="font-medium hover:underline text-primary"
                    >
                      {clientPhone}
                    </a>
                  </div>
                </div>
              )}

              {request.message && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="text-sm mt-1">{request.message}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                  <p className="text-sm">
                    {format(new Date(request.updated_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {request.status === "pending" && (
                <>
                  <Button
                    className="w-full"
                    onClick={() => updateStatusMutation.mutate("approved")}
                    disabled={updateStatusMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver la demande
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => updateStatusMutation.mutate("rejected")}
                    disabled={updateStatusMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Refuser la demande
                  </Button>
                </>
              )}
              {request.status === "approved" && (
                <Button
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate("completed")}
                  disabled={updateStatusMutation.isPending}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Marquer comme traitée
                </Button>
              )}
              {(request.status === "rejected" || request.status === "completed") && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate("pending")}
                  disabled={updateStatusMutation.isPending}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Remettre en attente
                </Button>
              )}

              {clientEmail && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={`mailto:${clientEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
