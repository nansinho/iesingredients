"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download } from "lucide-react";
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
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    let query = (supabase.from(tableName) as any)
      .select("*", { count: "exact" })
      .order("nom_commercial", { ascending: true })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (search) {
      query = query.or(
        `nom_commercial.ilike.%${search}%,code.ilike.%${search}%`
      );
    }

    const { data, count } = await query;
    if (data) setProducts(data);
    if (count !== null) setTotal(count);
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
      toast.error("Erreur lors de la suppression");
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
        subtitle={`${total} produits`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="rounded-lg gap-2 border-gray-200 hover:bg-forest-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`${editBasePath}/new`)}
              className="bg-forest-900 text-white hover:bg-forest-800 rounded-lg gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </Button>
          </div>
        }
      />

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
    </>
  );
}
