import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
  count?: number;
}

export function PageHeader({ title, subtitle, action, count }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {count !== undefined && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-600">
              {count}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}