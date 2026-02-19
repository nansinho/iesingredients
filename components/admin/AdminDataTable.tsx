"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Trash2, Pencil, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  actions?: React.ReactNode;
}

export function AdminDataTable<T extends Record<string, any>>({
  data,
  columns,
  idKey,
  editPath,
  onDelete,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  page = 1,
  totalPages = 1,
  onPageChange,
  actions,
}: AdminDataTableProps<T>) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {onSearchChange && (
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-10 rounded-xl border-gray-200 focus:border-forest-400"
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
              <tr className="border-b bg-forest-50/50">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-medium text-forest-700">
                    {col.label}
                  </th>
                ))}
                {(editPath || onDelete) && (
                  <th className="text-right px-4 py-3 font-medium text-forest-700 w-28">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
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
                data.map((item) => (
                  <tr
                    key={item[idKey]}
                    className="border-b last:border-0 hover:bg-forest-50/30 transition-colors cursor-pointer"
                    onClick={() => editPath && router.push(`${editPath}/${item[idKey]}` as any)}
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
                                router.push(`${editPath}/${item[idKey]}` as any);
                              }}
                              className="h-8 px-2.5 text-forest-600 hover:text-forest-900 hover:bg-forest-50 border-gray-200"
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
                                setDeleteId(item[idKey]);
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-forest-50/30">
            <p className="text-sm text-forest-600">
              Page {page} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId && onDelete) onDelete(deleteId);
                setDeleteId(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
