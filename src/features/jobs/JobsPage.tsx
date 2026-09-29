import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Clock,
  FileSignature,
  GraduationCap,
  Plus,
  SearchX,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { searchJobs } from "@/api/jobs";
import type { EmploymentType, Job } from "@/types/job";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateJobDialog } from "./CreateJobDialog";
import { ApplyDialog } from "./ApplyDialog";
import { EditJobDialog } from "./EditJobDialog";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar } from "@/components/hirely/Avatar";
import { EmptyState } from "@/components/hirely/EmptyState";
import { SearchInput } from "@/components/hirely/SearchInput";
import { PaginationBar } from "@/components/hirely/PaginationBar";
import { JobStatusBadge } from "@/components/hirely/StatusBadge";
import { btnPrimary, btnOutline, iconBtn } from "@/components/hirely/buttonStyles";
import { formatSalary, timeAgo } from "@/lib/pageTime";

const employmentTypes: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

const TYPE_META: Record<EmploymentType, { icon: LucideIcon; label: string; tile: string }> = {
  FULL_TIME: { icon: Briefcase, label: "Full-time", tile: "bg-indigo-50 text-indigo-600 ring-indigo-600/20" },
  PART_TIME: { icon: Clock, label: "Part-time", tile: "bg-sky-50 text-sky-600 ring-sky-600/20" },
  CONTRACT: { icon: FileSignature, label: "Contract", tile: "bg-amber-50 text-amber-600 ring-amber-600/20" },
  INTERNSHIP: { icon: GraduationCap, label: "Internship", tile: "bg-violet-50 text-violet-600 ring-violet-600/20" },
};

export function JobsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [keyword, setKeyword] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(0);

  const { user } = useAuth();
  const canCreate = user?.role === "ADMIN" || user?.role === "COMPANY_REP";
  const canApply = user?.role === "APPLICANT";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jobs", "search", { keyword, employmentType, location, page }],
    queryFn: () =>
      searchJobs({
        keyword: keyword || undefined,
        employmentType: employmentType || undefined,
        location: location || undefined,
        page,
        size: 10,
      }),
  });

  const jobs = data?.content ?? [];
  const hasFilters = keyword.trim().length > 0 || employmentType !== "" || location.trim().length > 0;

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(0);
    };
  }

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Jobs"
        subtitle={canApply ? "Open roles across every company hiring through Hirely." : "Every role you're hiring for."}
        count={data?.totalElements}
        action={
          canCreate && (
            <button onClick={() => setDialogOpen(true)} className={btnPrimary}>
              <Plus className="h-4 w-4" />
              Post job
            </button>
          )
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <SearchInput
          value={keyword}
          onChange={resetPage(setKeyword)}
          placeholder="Search title or description…"
          className="w-56"
        />

        <select
          value={employmentType}
          onChange={(e) => resetPage(setEmploymentType)(e.target.value as EmploymentType | "")}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        >
          <option value="">All types</option>
          {employmentTypes.map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ")}
            </option>
          ))}
        </select>

        <input
          value={location}
          onChange={(e) => resetPage(setLocation)(e.target.value)}
          placeholder="Location"
          className="h-10 w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-card placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {isLoading && <LoadingState label="Loading jobs…" />}
      {isError && <ErrorState message="Couldn't load jobs." onRetry={() => refetch()} />}

      {data && jobs.length === 0 && (
        <EmptyState
          icon={hasFilters ? SearchX : Sparkles}
          title={hasFilters ? "No jobs match your filters" : canApply ? "No roles open right now" : "No jobs yet"}
          description={
            hasFilters
              ? "Try a different keyword, type, or location."
              : canApply
              ? "Check back soon, new roles are posted regularly."
              : "Post your first job to start collecting applicants."
          }
          action={
            hasFilters ? (
              <button
                className={btnOutline}
                onClick={() => {
                  setKeyword("");
                  setEmploymentType("");
                  setLocation("");
                  setPage(0);
                }}
              >
                Reset filters
              </button>
            ) : canCreate ? (
              <button className={btnPrimary} onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Post a job
              </button>
            ) : undefined
          }
        />
      )}

      {data && jobs.length > 0 && (
        <>
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <JobRow
                key={job.id}
                job={job}
                index={i}
                canCreate={canCreate}
                canApply={canApply}
                onEdit={() => setEditJob(job)}
                onApply={() => setApplyJob(job)}
              />
            ))}
          </div>

          <div className="mt-4">
            <PaginationBar
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
              totalItems={data.totalElements}
              itemLabel="jobs"
            />
          </div>
        </>
      )}

      <CreateJobDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <ApplyDialog job={applyJob} onClose={() => setApplyJob(null)} />
      <EditJobDialog job={editJob} onClose={() => setEditJob(null)} />
    </div>
  );
}

function JobRow({
  job,
  index,
  canCreate,
  canApply,
  onEdit,
  onApply,
}: {
  job: Job;
  index: number;
  canCreate: boolean;
  canApply: boolean;
  onEdit: () => void;
  onApply: () => void;
}) {
  const meta = TYPE_META[job.employmentType ?? "FULL_TIME"];
  const Icon = meta.icon;
  const salary = formatSalary(job.minSalary, job.maxSalary);

  return (
    <article
      style={{ animationDelay: `${index * 35}ms` }}
      className="animate-fade-up rounded-xl border border-slate-200 bg-white p-4 shadow-card transition duration-200 hover:border-indigo-200 hover:shadow-lift sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={job.company.name} shape="square" className="h-11 w-11 text-sm" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">{job.title}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {job.company.name} · Posted {timeAgo(job.postedDate)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 lg:justify-end">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.tile}`}>
            <Icon className="h-3.5 w-3.5" />
            {meta.label}
          </span>
          {salary && <span className="text-sm font-medium tabular-nums text-slate-700">{salary}</span>}
        </div>

        <div className="flex items-center gap-2 lg:justify-end">
          <JobStatusBadge status={job.status} />
          {canApply && (
            <button onClick={onApply} className={btnPrimary}>
              Apply
            </button>
          )}
          {canCreate && (
            <button onClick={onEdit} className={iconBtn} aria-label={`Edit ${job.title}`}>
              <Briefcase className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}