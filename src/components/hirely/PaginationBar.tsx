import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel = "results",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemLabel?: string;
}) {
  if (totalPages <= 1 && totalItems === undefined) return null;
  const navBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-slate-500">
        {totalItems !== undefined && (
          <>
            <span className="font-medium tabular-nums text-slate-700">{totalItems}</span> {itemLabel}
          </>
        )}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous page" className={navBtn} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-3 text-sm tabular-nums text-slate-600">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          aria-label="Next page"
          className={navBtn}
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}