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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  approved: { label: "Approuvée", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  rejected: { label: "Refusée", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  completed: { label: "Traitée", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
};

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Demandes d'échantillons
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez les demandes de devis et d'échantillons
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <p className="text-xs text-yellow-600">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            <p className="text-xs text-green-600">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{stats.completed}</div>
            <p className="text-xs text-blue-600">Traitées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredRequests?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Société</TableHead>
                    <TableHead className="text-center">Produits</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((request) => {
                    const status = statusConfig[request.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    const clientName = request.contact_name || request.profile?.full_name || "—";
                    const clientEmail = request.contact_email || request.profile?.email || "—";

                    return (
                      <TableRow key={request.id}>
                        <TableCell className="whitespace-nowrap">
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
                          <span className="text-sm">{request.company || "—"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{request.items?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
