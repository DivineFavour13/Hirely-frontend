import type { JobStatus } from "@/types/job";

interface ChipStyle {
  chip: string;
  dot: string;
}

const JOB: Record<JobStatus, ChipStyle> = {
  DRAFT: { chip: "bg-slate-100 text-slate-700 ring-slate-500/20", dot: "bg-slate-400" },
  OPEN: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  CLOSED: { chip: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-500" },
};

const label = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export function JobStatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  const { chip, dot } = JOB[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${chip} ${className ?? ""}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label(status)}
    </span>
  );
}