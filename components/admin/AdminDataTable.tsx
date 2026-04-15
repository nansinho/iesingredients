"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useEffect, useMemo, memo } from "react";
import { useRouter } from "@/i18n/routing";
import { Trash2, Pencil, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageSize, PAGE_SIZE_OPTIONS, type PageSize } from "@/lib/hooks/usePageSize";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  idKey: string;
  editPath?: string;
  onDelete?: (id: string) => void;
  onRowClick?: (item: T) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Server-side pagination: provide all three. */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  /** Server-side: also forward the chosen pageSize. */
  pageSize?: PageSize;
  onPageSizeChange?: (size: PageSize) => void;
  /** Client-side pagination: provide a storageKey to enable internal paging + persisted size. */
  storageKey?: string;
  actions?: React.ReactNode;
}

/* Memoized table row to avoid re-rendering unchanged rows */
const DataTableRow = memo(function DataTableRow<T extends Record<string, any>>({
  item,
  columns,
  idKey,
  editPath,
  onDelete,
  onRowClick,
  onNavigate,
  onRequestDelete,
}: {
  item: T;
  columns: Column<T>[];
  idKey: string;
  editPath?: string;
  onDelete?: (id: string) => void;
  onRowClick?: (item: T) => void;
  onNavigate: (path: string) => void;
  onRequestDelete: (id: string) => void;
}) {
  const id = item[idKey];
  return (
    <tr
      className="border-b last:border-0 hover:bg-brand-primary/5 transition-colors cursor-pointer"
      onClick={() => onRowClick ? onRowClick(item) : editPath && onNavigate(`${editPath}/${id}`)}
    >
      {columns.map((col) => (
        <td key={col.key} className="px-4 py-3 text-gray-900">
          {col.render ? col.render(item) : item[col.key]}
        </td>
      ))}
      {(editPath || onDelete) && (
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1.5">
            {editPath && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(`${editPath}/${id}`);
                }}
                className="h-8 px-2.5 text-brand-secondary hover:text-brand-primary hover:bg-brand-primary/5 border-gray-200"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDelete(id);
                }}
                className="h-8 px-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}) as <T extends Record<string, any>>(props: {
  item: T;
  columns: Column<T>[];
  idKey: string;
  editPath?: string;
  onDelete?: (id: string) => void;
  onRowClick?: (item: T) => void;
  onNavigate: (path: string) => void;
  onRequestDelete: (id: string) => void;
}) => React.ReactElement;

export function AdminDataTable<T extends Record<string, any>>({
  data,
  columns,
  idKey,
  editPath,
  onDelete,
  onRowClick,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  storageKey,
  actions,
}: AdminDataTableProps<T>) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const isClientPaging = !onPageChange && !!storageKey;
  const [clientSize, setClientSize] = usePageSize(storageKey || "default", 20);
  const [clientPage, setClientPage] = useState(1);

  const effectivePageSize: PageSize = (pageSize ?? clientSize) as PageSize;
  const effectivePage = page ?? clientPage;

  // Reset to page 1 if data shrinks (e.g. search filter narrows results)
  useEffect(() => {
    if (isClientPaging) setClientPage(1);
  }, [data.length, effectivePageSize, isClientPaging]);

  const { displayedData, computedTotalPages } = useMemo(() => {
    if (isClientPaging) {
      const tp = Math.max(1, Math.ceil(data.length / effectivePageSize));
      const safePage = Math.min(effectivePage, tp);
      const start = (safePage - 1) * effectivePageSize;
      return {
        displayedData: data.slice(start, start + effectivePageSize),
        computedTotalPages: tp,
      };
    }
    return { displayedData: data, computedTotalPages: totalPages ?? 1 };
  }, [data, effectivePageSize, effectivePage, isClientPaging, totalPages]);

  const handlePageChange = (p: number) => {
    if (onPageChange) onPageChange(p);
    else setClientPage(p);
  };

  const handlePageSizeChange = (s: PageSize) => {
    if (onPageSizeChange) onPageSizeChange(s);
    else setClientSize(s);
    if (!onPageChange) setClientPage(1);
  };

  const showPager =
    (isClientPaging && data.length > PAGE_SIZE_OPTIONS[0]) ||
    (computedTotalPages > 1 && !!onPageChange) ||
    (!!onPageSizeChange);

  const handleNavigate = useCallback((path: string) => {
    router.push(path as any);
  }, [router]);

  const handleRequestDelete = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {onSearchChange && (
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-secondary" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-10 rounded-xl border-gray-200 focus:border-brand-accent"
            />
          </div>
        )}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/80">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    {col.label}
                  </th>
                ))}
                {(editPath || onDelete) && (
                  <th className="text-right px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 w-28">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (editPath || onDelete ? 1 : 0)}
                    className="text-center py-16 text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="text-sm">Aucun résultat</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedData.map((item) => (
                  <DataTableRow
                    key={item[idKey]}
                    item={item}
                    columns={columns}
                    idKey={idKey}
                    editPath={editPath}
                    onDelete={onDelete}
                    onRowClick={onRowClick}
                    onNavigate={handleNavigate}
                    onRequestDelete={handleRequestDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPager && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 border-t bg-brand-primary/5">
            <div className="flex items-center gap-3 text-sm text-brand-secondary">
              <span>Page {effectivePage} / {computedTotalPages}</span>
              {(onPageSizeChange || isClientPaging) && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">·</span>
                  <span>Par page</span>
                  <Select
                    value={String(effectivePageSize)}
                    onValueChange={(v) => handlePageSizeChange(Number(v) as PageSize)}
                  >
                    <SelectTrigger className="h-8 w-20 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(effectivePage - 1)}
                disabled={effectivePage <= 1}
                className="rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(effectivePage + 1)}
                disabled={effectivePage >= computedTotalPages}
                className="rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) { setDeleteId(null); setDeleteConfirm(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-white/60">Cette action est irréversible. Tapez <strong className="text-red-400 font-mono">SUPPRIMER</strong> pour confirmer.</p>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="font-mono !bg-white/10 !border-white/20 !text-white placeholder:!text-white/30 focus-visible:!bg-white/15 focus-visible:!ring-white/20"
                  autoFocus
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId && onDelete) onDelete(deleteId);
                setDeleteId(null);
                setDeleteConfirm("");
              }}
              disabled={deleteConfirm !== "SUPPRIMER"}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
