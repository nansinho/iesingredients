import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Image, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  code: string;
  nom_commercial: string | null;
  gamme: string | null;
  origine: string | null;
  statut: string | null;
  image_url: string | null;
}

interface ProductDataTableProps {
  products: Product[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (code: string) => void;
  isDeleting?: boolean;
  editBasePath: string;
  showPerformance?: boolean;
}

export function ProductDataTable({
  products,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onDelete,
  isDeleting = false,
  editBasePath,
  showPerformance = false,
}: ProductDataTableProps) {
  const [deleteCode, setDeleteCode] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun produit trouvé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Nom commercial</TableHead>
              <TableHead>Gamme</TableHead>
              <TableHead>Origine</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">{product.code}</TableCell>
                <TableCell className="font-medium max-w-48 truncate">
                  {product.nom_commercial || "-"}
                </TableCell>
                <TableCell>{product.gamme || "-"}</TableCell>
                <TableCell>{product.origine || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.statut === "ACTIF" ? "default" : "secondary"}
                  >
                    {product.statut || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {showPerformance && (
                      <Button variant="ghost" size="icon" asChild>
                        <NavLink to={`${editBasePath}/${product.code}/performance`}>
                          <BarChart3 className="h-4 w-4" />
                        </NavLink>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <NavLink to={`${editBasePath}/${product.code}`}>
                        <Edit className="h-4 w-4" />
                      </NavLink>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteCode(product.code)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le produit "{product.nom_commercial}" sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(product.code)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded-lg border border-border bg-card"
          >
            <div className="flex items-start gap-3">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt=""
                  className="w-14 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-14 h-14 bg-muted rounded flex items-center justify-center shrink-0">
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.nom_commercial || "Sans nom"}</p>
                <p className="text-sm text-muted-foreground font-mono">{product.code}</p>
                <div className="flex items-center gap-2 mt-1">
                  {product.gamme && (
                    <Badge variant="outline" className="text-xs">
                      {product.gamme}
                    </Badge>
                  )}
                  <Badge variant={product.statut === "ACTIF" ? "default" : "secondary"} className="text-xs">
                    {product.statut || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-border">
              {showPerformance && (
                <Button variant="outline" size="sm" asChild>
                  <NavLink to={`${editBasePath}/${product.code}/performance`}>
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Perf.
                  </NavLink>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <NavLink to={`${editBasePath}/${product.code}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Éditer
                </NavLink>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
