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

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card animate-pulse"
        >
          <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 hidden md:block" />
        </div>
      ))}
    </div>
  );
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
    return <TableSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground rounded-xl border border-dashed border-border bg-muted/20">
        <Image className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">Aucun produit trouvé</p>
        <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-14 font-semibold">Image</TableHead>
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Nom commercial</TableHead>
              <TableHead className="font-semibold">Gamme</TableHead>
              <TableHead className="font-semibold">Origine</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow
                key={product.id}
                className={cn(
                  "transition-colors",
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <TableCell className="py-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt=""
                      className="w-11 h-11 object-cover rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-muted rounded-lg flex items-center justify-center border border-border">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {product.code}
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {product.nom_commercial || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.gamme || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.origine || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={product.statut === "ACTIF" ? "default" : "secondary"}
                    className="font-medium"
                  >
                    {product.statut || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {showPerformance && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <NavLink to={`${editBasePath}/${product.code}/performance`}>
                          <BarChart3 className="h-4 w-4" />
                        </NavLink>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <NavLink to={`${editBasePath}/${product.code}`}>
                        <Edit className="h-4 w-4" />
                      </NavLink>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
            className="p-4 rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt=""
                  className="w-14 h-14 object-cover rounded-lg border border-border shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border">
                  <Image className="w-5 h-5 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-foreground">
                  {product.nom_commercial || "Sans nom"}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {product.code}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {product.gamme && (
                    <Badge variant="outline" className="text-xs">
                      {product.gamme}
                    </Badge>
                  )}
                  <Badge
                    variant={product.statut === "ACTIF" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {product.statut || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
              {showPerformance && (
                <Button variant="outline" size="sm" asChild className="h-9">
                  <NavLink to={`${editBasePath}/${product.code}/performance`}>
                    <BarChart3 className="h-4 w-4 mr-1.5" />
                    Perf.
                  </NavLink>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild className="h-9">
                <NavLink to={`${editBasePath}/${product.code}`}>
                  <Edit className="h-4 w-4 mr-1.5" />
                  Éditer
                </NavLink>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-destructive border-destructive/30 hover:bg-destructive/10"
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="h-9 w-9"
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
                  className="h-9 w-9 text-sm"
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
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
