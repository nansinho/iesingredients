import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Upload, Search, X, Download } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ImportCSV } from "@/components/admin/ImportCSV";
import { ProductDataTable } from "@/components/admin/ProductDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  useAdminProducts,
  useAdminFilterOptions,
  useDeleteProduct,
  useBulkImport,
} from "@/hooks/useAdminProducts";
import { useExportCSV } from "@/hooks/useExportCSV";

export default function CosmetiqueListPage() {
  const [search, setSearch] = useState("");
  const [gamme, setGamme] = useState<string>("");
  const [origine, setOrigine] = useState<string>("");
  const [statut, setStatut] = useState<string>("");
  const [page, setPage] = useState(1);
  const [importOpen, setImportOpen] = useState(false);

  const { data, isLoading } = useAdminProducts("cosmetique", {
    search,
    gamme: gamme || undefined,
    origine: origine || undefined,
    statut: statut || undefined,
    page,
    pageSize: 20,
  });

  const { data: filterOptions } = useAdminFilterOptions("cosmetique");
  const deleteMutation = useDeleteProduct("cosmetique");
  const importMutation = useBulkImport("cosmetique");
  const { exportToCSV, isExporting } = useExportCSV();

  const handleImport = async (importedData: Record<string, unknown>[]) => {
    await importMutation.mutateAsync(importedData);
    setImportOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    setGamme("");
    setOrigine("");
    setStatut("");
    setPage(1);
  };

  const hasFilters = search || gamme || origine || statut;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <AdminPageHeader
        title="Cosmétiques"
        subtitle={`${data?.total || 0} produits`}
        actions={
          <>
            <Button
              variant="outline"
              className="h-10"
              onClick={() => exportToCSV("cosmetique")}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            <Sheet open={importOpen} onOpenChange={setImportOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Importer des cosmétiques</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ImportCSV
                    onImport={handleImport}
                    expectedColumns={["code", "nom_commercial"]}
                    isLoading={importMutation.isPending}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Button asChild className="h-10">
              <NavLink to="/admin/cosmetiques/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </NavLink>
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par nom, code, INCI..."
            className="pl-9 h-10"
          />
        </div>

        <Select
          value={gamme || "__all__"}
          onValueChange={(value) => {
            setGamme(value === "__all__" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Gamme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes</SelectItem>
            {filterOptions?.gammes.map((g) => (
              <SelectItem key={g} value={g}>{g}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={origine || "__all__"}
          onValueChange={(value) => {
            setOrigine(value === "__all__" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Origine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes</SelectItem>
            {filterOptions?.origines.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statut || "__all__"}
          onValueChange={(value) => {
            setStatut(value === "__all__" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-32 h-10">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tous</SelectItem>
            {filterOptions?.statuts.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Table */}
      <ProductDataTable
        products={data?.products || []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        onDelete={(code) => deleteMutation.mutate(code)}
        isDeleting={deleteMutation.isPending}
        editBasePath="/admin/cosmetiques"
      />
    </div>
  );
}
