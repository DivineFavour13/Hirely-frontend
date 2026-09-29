const toneMap: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-slate-100 text-slate-600",
  CLOSED: "bg-rose-50 text-rose-700",
  APPLIED: "bg-slate-100 text-slate-600",
  SCREENING: "bg-amber-50 text-amber-700",
  INTERVIEW: "bg-indigo-50 text-indigo-700",
  OFFERED: "bg-violet-50 text-violet-700",
  REJECTED: "bg-rose-50 text-rose-700",
  HIRED: "bg-emerald-50 text-emerald-700",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = toneMap[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[12px] font-medium ${tone}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}