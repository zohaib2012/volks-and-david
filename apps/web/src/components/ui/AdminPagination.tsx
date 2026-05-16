import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: number[] = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}