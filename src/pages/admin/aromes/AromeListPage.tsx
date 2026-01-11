import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Upload, Search, X } from "lucide-react";
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
import {
  useAdminProducts,
  useAdminFilterOptions,
  useDeleteProduct,
  useBulkImport,
} from "@/hooks/useAdminProducts";

export default function AromeListPage() {
  const [search, setSearch] = useState("");
  const [gamme, setGamme] = useState<string>("");
  const [origine, setOrigine] = useState<string>("");
  const [statut, setStatut] = useState<string>("");
  const [page, setPage] = useState(1);
  const [importOpen, setImportOpen] = useState(false);

  const { data, isLoading } = useAdminProducts("arome", {
    search,
    gamme: gamme || undefined,
    origine: origine || undefined,
    statut: statut || undefined,
    page,
    pageSize: 20,
  });

  const { data: filterOptions } = useAdminFilterOptions("arome");
  const deleteMutation = useDeleteProduct("arome");
  const importMutation = useBulkImport("arome");

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arômes</h1>
          <p className="text-muted-foreground">
            {data?.total || 0} produits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={importOpen} onOpenChange={setImportOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Importer des arômes</SheetTitle>
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

          <Button asChild>
            <NavLink to="/admin/aromes/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau
            </NavLink>
          </Button>
        </div>
      </div>

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
            placeholder="Rechercher par nom, code..."
            className="pl-9"
          />
        </div>

        <Select
          value={gamme}
          onValueChange={(value) => {
            setGamme(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Gamme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes</SelectItem>
            {filterOptions?.gammes.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={origine}
          onValueChange={(value) => {
            setOrigine(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Origine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes</SelectItem>
            {filterOptions?.origines.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statut}
          onValueChange={(value) => {
            setStatut(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            {filterOptions?.statuts.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
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
        editBasePath="/admin/aromes"
      />
    </div>
  );
}
