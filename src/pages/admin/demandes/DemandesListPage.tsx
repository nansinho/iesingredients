import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  User,
  Building2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { cn } from "@/lib/utils";

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
  items?: SampleRequestItem[];
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}

interface SampleRequestItem {
  id: string;
  product_code: string;
  product_name: string;
  product_category: string | null;
  quantity: number;
}

const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "default" | "info"; icon: React.ElementType }> = {
  pending: { label: "En attente", variant: "warning", icon: Clock },
  approved: { label: "Approuvée", variant: "success", icon: CheckCircle },
  rejected: { label: "Refusée", variant: "default", icon: XCircle },
  completed: { label: "Traitée", variant: "info", icon: Package },
};

const statusBadgeClasses: Record<string, string> = {
  pending: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
  approved: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
};

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl border-0 bg-card animate-pulse"
        >
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function DemandesListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-sample-requests", statusFilter],
    queryFn: async (): Promise<SampleRequest[]> => {
      let query = supabase
        .from("sample_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch items for each request
      const requestsWithItems = await Promise.all(
        (data || []).map(async (request: any) => {
          const { data: items } = await supabase
            .from("sample_request_items")
            .select("*")
            .eq("request_id", request.id);

          // Fetch profile if user_id exists
          let profile = null;
          if (request.user_id) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("full_name, email")
              .eq("id", request.user_id)
              .maybeSingle();
            profile = profileData;
          }

          return { ...request, items: items || [], profile };
        })
      );

      return requestsWithItems;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("sample_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sample-requests"] });
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const filteredRequests = requests?.filter((request) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      request.contact_name?.toLowerCase().includes(searchLower) ||
      request.contact_email?.toLowerCase().includes(searchLower) ||
      request.company?.toLowerCase().includes(searchLower) ||
      request.profile?.full_name?.toLowerCase().includes(searchLower) ||
      request.profile?.email?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: requests?.length || 0,
    pending: requests?.filter((r) => r.status === "pending").length || 0,
    approved: requests?.filter((r) => r.status === "approved").length || 0,
    completed: requests?.filter((r) => r.status === "completed").length || 0,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="Demandes d'échantillons"
        subtitle="Gérez les demandes de devis et d'échantillons"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total"
          value={stats.total}
          icon={Package}
          isLoading={isLoading}
        />
        <StatCard
          title="En attente"
          value={stats.pending}
          icon={Clock}
          variant="warning"
          isLoading={isLoading}
        />
        <StatCard
          title="Approuvées"
          value={stats.approved}
          icon={CheckCircle}
          variant="success"
          isLoading={isLoading}
        />
        <StatCard
          title="Traitées"
          value={stats.completed}
          icon={Package}
          variant="info"
          isLoading={isLoading}
        />
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, société..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Refusées</SelectItem>
                <SelectItem value="completed">Traitées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : filteredRequests?.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground rounded-xl border-0 bg-muted/20">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Aucune demande trouvée</p>
              <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-hidden rounded-xl border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Client</TableHead>
                      <TableHead className="font-semibold">Société</TableHead>
                      <TableHead className="text-center font-semibold">Produits</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests?.map((request, index) => {
                      const status = statusConfig[request.status] || statusConfig.pending;
                      const StatusIcon = status.icon;
                      const clientName = request.contact_name || request.profile?.full_name || "—";
                      const clientEmail = request.contact_email || request.profile?.email || "—";

                      return (
                        <TableRow
                          key={request.id}
                          className={cn(
                            "transition-colors",
                            index % 2 === 0 ? "bg-background" : "bg-muted/20"
                          )}
                        >
                          <TableCell className="whitespace-nowrap py-3">
                            <div className="text-sm font-medium">
                              {format(new Date(request.created_at), "dd MMM yyyy", { locale: fr })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(request.created_at), "HH:mm")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{clientName}</div>
                            <div className="text-xs text-muted-foreground">{clientEmail}</div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{request.company || "—"}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-medium">
                              {request.items?.length || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("font-medium", statusBadgeClasses[request.status])}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <NavLink to={`/admin/demandes/${request.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir détails
                                  </NavLink>
                                </DropdownMenuItem>
                                {request.status === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatusMutation.mutate({ id: request.id, status: "approved" })
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                      Approuver
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatusMutation.mutate({ id: request.id, status: "rejected" })
                                      }
                                    >
                                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                      Refuser
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {request.status === "approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatusMutation.mutate({ id: request.id, status: "completed" })
                                    }
                                  >
                                    <Package className="h-4 w-4 mr-2 text-blue-600" />
                                    Marquer comme traitée
                                  </DropdownMenuItem>
                                )}
                                {request.status !== "pending" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatusMutation.mutate({ id: request.id, status: "pending" })
                                    }
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Remettre en attente
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredRequests?.map((request) => {
                  const status = statusConfig[request.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  const clientName = request.contact_name || request.profile?.full_name || "—";
                  const clientEmail = request.contact_email || request.profile?.email || "—";

                  return (
                    <div
                      key={request.id}
                      className="p-4 rounded-xl border-0 bg-card transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-foreground truncate">{clientName}</p>
                              <p className="text-xs text-muted-foreground truncate">{clientEmail}</p>
                            </div>
                            <Badge variant="outline" className={cn("shrink-0 text-xs", statusBadgeClasses[request.status])}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {request.company && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {request.company}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {request.items?.length || 0} produits
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t-0">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(request.created_at), "dd MMM yyyy à HH:mm", { locale: fr })}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild className="h-8">
                            <NavLink to={`/admin/demandes/${request.id}`}>
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Détails
                            </NavLink>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {request.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatusMutation.mutate({ id: request.id, status: "approved" })
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    Approuver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatusMutation.mutate({ id: request.id, status: "rejected" })
                                    }
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Refuser
                                  </DropdownMenuItem>
                                </>
                              )}
                              {request.status === "approved" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatusMutation.mutate({ id: request.id, status: "completed" })
                                  }
                                >
                                  <Package className="h-4 w-4 mr-2 text-blue-600" />
                                  Marquer comme traitée
                                </DropdownMenuItem>
                              )}
                              {request.status !== "pending" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatusMutation.mutate({ id: request.id, status: "pending" })
                                  }
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Remettre en attente
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
