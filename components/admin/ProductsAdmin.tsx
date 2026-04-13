"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Download, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SlidePanel } from "@/components/admin/SlidePanel";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";

interface ProductsAdminProps {
  tableName: string;
  title: string;
  editBasePath: string;
  initialProducts: any[];
  initialTotal: number;
}

const PAGE_SIZE = 20;

// ── Colonnes spécifiques par catalogue (fidèles au XLS) ──

function getColumns(tableName: string) {
  const imgCol = {
    key: "image_url",
    label: "",
    render: (item: any) =>
      item.image_url ? (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <Image src={item.image_url} alt="" width={48} height={48} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-brand-primary/5" />
      ),
  };

  const codeCol = {
    key: "code",
    label: "Code",
    render: (item: any) => (
      <span className="font-mono text-[11px] font-bold text-brand-primary truncate max-w-[120px] block">{item.code}</span>
    ),
  };

  const nomCol = {
    key: "nom_commercial",
    label: "Nom commercial",
    render: (item: any) => (
      <span className="font-medium text-sm truncate max-w-[200px] block">{item.nom_commercial}</span>
    ),
  };

  const statutCol = {
    key: "statut",
    label: "Statut",
    render: (item: any) => (
      <Badge className={item.statut === "ACTIF" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
        {item.statut}
      </Badge>
    ),
  };

  if (tableName === "aromes_fr") {
    // Excel: nom_commercial, typologie_produit, famille_arome, saveur, code_fournisseurs, cas_no, aspect
    return [
      imgCol,
      codeCol,
      nomCol,
      {
        key: "famille_arome",
        label: "Famille",
        render: (item: any) => item.famille_arome ? (
          <Badge variant="outline" className="text-[11px]">{item.famille_arome}</Badge>
        ) : <span className="text-gray-300">—</span>,
      },
      {
        key: "saveur",
        label: "Saveur",
        render: (item: any) => <span className="text-sm text-gray-600">{item.saveur || "—"}</span>,
      },
      { key: "cas_no", label: "CAS", render: (item: any) => <span className="font-mono text-[11px] text-gray-500">{item.cas_no || "—"}</span> },
      { key: "aspect", label: "Aspect", render: (item: any) => <span className="text-sm text-gray-600">{item.aspect || "—"}</span> },
      statutCol,
    ];
  }

  if (tableName === "cosmetique_fr") {
    // Excel: nom_commercial, famille_cosmetique, origine, code, cas_no, inci, benefices, solubilite, aspect
    return [
      imgCol,
      codeCol,
      nomCol,
      {
        key: "famille_cosmetique",
        label: "Famille",
        render: (item: any) => item.famille_cosmetique ? (
          <Badge variant="outline" className="text-[11px]">{item.famille_cosmetique}</Badge>
        ) : <span className="text-gray-300">—</span>,
      },
      {
        key: "origine",
        label: "Origine",
        render: (item: any) => <span className="text-sm text-gray-600">{item.origine || "—"}</span>,
      },
      {
        key: "solubilite",
        label: "Solubilité",
        render: (item: any) => <span className="text-[11px] text-gray-600">{item.solubilite || "—"}</span>,
      },
      {
        key: "aspect",
        label: "Aspect",
        render: (item: any) => <span className="text-sm text-gray-600">{item.aspect || "—"}</span>,
      },
      statutCol,
    ];
  }

  if (tableName === "parfum_fr") {
    // Excel: nom_commercial, famille_olfactive, origine, code_fournisseurs, cas_no, nom_latin, food_grade, aspect
    return [
      imgCol,
      codeCol,
      nomCol,
      {
        key: "famille_olfactive",
        label: "Famille olfactive",
        render: (item: any) => item.famille_olfactive ? (
          <Badge variant="outline" className="text-[11px]">{item.famille_olfactive}</Badge>
        ) : <span className="text-gray-300">—</span>,
      },
      {
        key: "origin",
        label: "Origine",
        render: (item: any) => <span className="text-sm text-gray-600">{item.origin || "—"}</span>,
      },
      {
        key: "nom_latin",
        label: "Nom latin",
        render: (item: any) => <span className="text-sm italic text-gray-500">{item.nom_latin || "—"}</span>,
      },
      {
        key: "aspect",
        label: "Aspect",
        render: (item: any) => <span className="text-sm text-gray-600">{item.aspect || "—"}</span>,
      },
      statutCol,
    ];
  }

  // Fallback
  return [imgCol, codeCol, nomCol, statutCol];
}

export function ProductsAdmin({
  tableName,
  title,
  editBasePath,
  initialProducts,
  initialTotal,
}: ProductsAdminProps) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
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

  const openNew = () => {
    setEditingProduct(null);
    setIsNew(true);
    setPanelOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setIsNew(false);
    setPanelOpen(true);
  };

  const handleSave = () => {
    setPanelOpen(false);
    fetchProducts();
  };

  const handleDelete = async (code: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from(tableName) as any)
      .delete()
      .eq("code", code);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }
    logAudit({ action: "delete", entityType: "product", entityId: code, entityLabel: `${title} — ${code}` });
    toast.success("Produit supprimé");
    fetchProducts();
  };

  const handleExportCSV = () => {
    // Export colonnes spécifiques au catalogue
    let headers: string[] = [];
    if (tableName === "aromes_fr") {
      headers = ["code", "nom_commercial", "famille_arome", "saveur", "cas_no", "aspect", "statut"];
    } else if (tableName === "cosmetique_fr") {
      headers = ["code", "nom_commercial", "famille_cosmetique", "origine", "inci", "solubilite", "aspect", "statut"];
    } else if (tableName === "parfum_fr") {
      headers = ["code", "nom_commercial", "famille_olfactive", "origin", "nom_latin", "cas_no", "aspect", "statut"];
    }

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

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split("\n").filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

      const records = lines.slice(1).map((line) => {
        const values = line.match(/(".*?"|[^",]+)/g) || [];
        const record: any = {};
        headers.forEach((h, i) => {
          const val = (values[i] || "").replace(/^"|"$/g, "").trim();
          if (val) record[h] = val;
        });
        return record;
      });

      const supabase = createClient();
      const { error } = await (supabase.from(tableName) as any).upsert(records, { onConflict: "code" });

      if (error) throw error;

      toast.success(`${records.length} produits importés`);
      fetchProducts();
    } catch (err) {
      toast.error("Erreur import : " + (err instanceof Error ? err.message : "Échec"));
    }

    e.target.value = "";
  };

  const columns = getColumns(tableName);

  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={`${total} produits`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchProducts()} className="rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="rounded-lg gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <label>
              <Button variant="outline" size="sm" className="rounded-lg gap-2 cursor-pointer" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Import CSV</span>
                </span>
              </Button>
              <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
            </label>
            <Button size="sm" onClick={openNew} className="bg-brand-primary text-white hover:bg-brand-secondary rounded-lg gap-2">
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
        onDelete={handleDelete}
        onRowClick={openEdit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher par code ou nom..."
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={isNew ? "Nouveau produit" : `${editingProduct?.nom_commercial || editingProduct?.code || ""}`}
        subtitle={isNew ? "Ajouter un produit au catalogue" : `Code: ${editingProduct?.code || ""}`}
      >
        <ProductEditForm
          tableName={tableName}
          product={editingProduct}
          isNew={isNew}
          onSave={handleSave}
          onCancel={() => setPanelOpen(false)}
        />
      </SlidePanel>
    </>
  );
}
