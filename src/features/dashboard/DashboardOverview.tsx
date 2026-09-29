import { useQuery } from "@tanstack/react-query";
import { Briefcase, Building2, Users, FileText } from "lucide-react";
import { getStats } from "@/api/stats";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

const statCards = [
  { key: "totalJobs" as const, label: "Open roles", icon: Briefcase, tone: "text-indigo-600 bg-indigo-50" },
  { key: "totalCompanies" as const, label: "Companies", icon: Building2, tone: "text-slate-600 bg-slate-100" },
  { key: "totalApplicants" as const, label: "Applicants", icon: Users, tone: "text-emerald-600 bg-emerald-50" },
  { key: "totalApplications" as const, label: "Applications", icon: FileText, tone: "text-amber-600 bg-amber-50" },
];

export function DashboardOverview() {
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">A snapshot of everything happening right now.</p>

      {isLoading && <LoadingState label="Loading stats…" />}
      {isError && <ErrorState message="Couldn't load stats. Is the backend running?" onRetry={() => refetch()} />}

      {stats && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.key} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.tone}`}>
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    {stats[card.key]}
                  </p>
                  <p className="mt-0.5 text-[13px] text-slate-500">{card.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <StatusBreakdown title="Applications by stage" data={stats.applicationsByStatus} />
            <StatusBreakdown title="Jobs by status" data={stats.jobsByStatus} />
          </div>
        </>
      )}
    </div>
  );
}

function StatusBreakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-[13.5px] font-medium text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {entries.length === 0 && (
          <p className="text-[13px] text-slate-400">No data yet.</p>
        )}
        {entries.map(([label, count]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between text-[12.5px]">
              <span className="font-medium text-slate-700">
                {label.charAt(0) + label.slice(1).toLowerCase()}
              </span>
              <span className="text-slate-500">{count}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}