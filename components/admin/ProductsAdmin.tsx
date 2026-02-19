"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { Plus, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProductsAdminProps {
  tableName: string;
  title: string;
  editBasePath: string;
  initialProducts: any[];
  initialTotal: number;
}

const PAGE_SIZE = 20;

function sanitizeSearch(input: string): string {
  return input.replace(/[%_\\]/g, (c) => `\\${c}`);
}

export function ProductsAdmin({
  tableName,
  title,
  editBasePath,
  initialProducts,
  initialTotal,
}: ProductsAdminProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      let query = (supabase.from(tableName) as any)
        .select("*", { count: "exact" })
        .order("nom_commercial", { ascending: true })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (search) {
        const safe = sanitizeSearch(search);
        query = query.or(
          `nom_commercial.ilike.%${safe}%,code.ilike.%${safe}%`
        );
      }

      const { data, count, error } = await query;
      if (error) {
        toast.error(`Erreur de chargement: ${error.message}`);
        return;
      }
      if (data) setProducts(data);
      if (count !== null) setTotal(count);
    } catch {
      toast.error("Impossible de charger les produits. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  }, [tableName, search, page]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async (code: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from(tableName) as any)
      .delete()
      .eq("code", code);

    if (error) {
      toast.error(`Impossible de supprimer: ${error.message}`);
      return;
    }
    toast.success("Produit supprimé");
    fetchProducts();
  };

  const handleExportCSV = () => {
    const headers = ["code", "nom_commercial", "gamme", "origine", "statut"];
    const csv = [
      headers.join(","),
      ...products.map((p: any) => headers.map((h) => `"${(p[h] || "").toString().replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: "code",
      label: "Code",
      render: (item: any) => (
        <span className="font-mono text-xs font-bold text-forest-900">{item.code}</span>
      ),
    },
    {
      key: "nom_commercial",
      label: "Nom",
      render: (item: any) => (
        <span className="font-medium">{item.nom_commercial}</span>
      ),
    },
    { key: "gamme", label: "Gamme" },
    { key: "origine", label: "Origine" },
    {
      key: "statut",
      label: "Statut",
      render: (item: any) => (
        <Badge variant={item.statut === "ACTIF" ? "default" : "secondary"}>
          {item.statut}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={isLoading ? "Chargement..." : `${total} produits`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`${editBasePath}/new` as any)}
              className="bg-forest-900 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </div>
        }
      />

      {isLoading && products.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Chargement des produits...</span>
        </div>
      ) : (
        <AdminDataTable
          data={products}
          columns={columns}
          idKey="code"
          editPath={editBasePath}
          onDelete={handleDelete}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Rechercher par code ou nom..."
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
