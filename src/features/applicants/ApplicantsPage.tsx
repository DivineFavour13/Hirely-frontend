import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Mail, Phone, Plus, SearchX, Users } from "lucide-react";
import { getApplicants } from "@/api/applicants";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateApplicantDialog } from "./CreateApplicantDialog";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar } from "@/components/hirely/Avatar";
import { EmptyState } from "@/components/hirely/EmptyState";
import { SearchInput } from "@/components/hirely/SearchInput";
import { btnPrimary, btnOutline } from "@/components/hirely/buttonStyles";
import { timeAgo } from "@/lib/pageTime";
import type { Applicant } from "@/types/applicant";

export function ApplicantsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: applicants, isLoading, isError, refetch } = useQuery({
    queryKey: ["applicants"],
    queryFn: getApplicants,
  });

  const filtered = applicants?.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.skills?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Applicants"
        subtitle="Everyone who's applied through Hirely."
        count={applicants?.length}
        action={
          <button onClick={() => setDialogOpen(true)} className={btnPrimary}>
            <Plus className="h-4 w-4" />
            Add applicant
          </button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or skill…" className="mb-6" />

      {isLoading && <LoadingState label="Loading applicants…" />}
      {isError && <ErrorState message="Couldn't load applicants." onRetry={() => refetch()} />}

      {filtered && filtered.length === 0 && (
        <EmptyState
          icon={search ? SearchX : Users}
          title={search ? `No applicants match "${search}"` : "No applicants yet"}
          description={search ? "Try a different name or skill." : "Applicants will appear here once they apply."}
          action={
            search ? (
              <button className={btnPrimary} onClick={() => setSearch("")}>
                Clear search
              </button>
            ) : undefined
          }
        />
      )}

      {filtered && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((applicant, i) => (
            <ApplicantCard key={applicant.id} applicant={applicant} index={i} />
          ))}
        </div>
      )}

      <CreateApplicantDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

function ApplicantCard({ applicant, index }: { applicant: Applicant; index: number }) {
  const skills = (applicant.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <article
      style={{ animationDelay: `${index * 40}ms` }}
      className="animate-fade-up flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lift"
    >
      <div className="flex items-start gap-3">
        <Avatar name={applicant.name} className="h-12 w-12 text-base" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">{applicant.name}</h3>
          <a href={`mailto:${applicant.email}`} className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 transition-colors hover:text-indigo-600">
            <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            {applicant.email}
          </a>
          {applicant.phone && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {applicant.phone}
            </p>
          )}
        </div>
        {applicant.resumeUrl && (
          <a href={applicant.resumeUrl} target="_blank" rel="noreferrer" className={`${btnOutline} h-8 shrink-0 px-2.5 text-xs`}>
            <FileText className="h-3.5 w-3.5" /> Resume
          </a>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}

      {applicant.experienceSummary && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{applicant.experienceSummary}</p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
        Joined {timeAgo(applicant.createdAt)}
      </div>
    </article>
  );
}