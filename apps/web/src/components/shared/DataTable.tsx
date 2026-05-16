import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  keyExtractor: (item: T) => string | number;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  onSort,
  onRowClick,
  emptyTitle,
  emptyDescription,
  emptyAction,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      const newDir = sortDir === "asc" ? "desc" : "asc";
      setSortDir(newDir);
      onSort?.(key, newDir);
    } else {
      setSortKey(key);
      setSortDir("asc");
      onSort?.(key, "asc");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyTitle || "No data found"}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                  col.sortable &&
                    "cursor-pointer select-none hover:text-foreground",
                  col.className,
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-muted-foreground/50">
                      {sortKey === col.key ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                "border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn("px-4 py-3 text-sm", col.className)}
                >
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }).map(
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onPageChange?.(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
