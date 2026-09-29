import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Globe, Mail, MapPin, Plus, SearchX } from "lucide-react";
import { getCompanies } from "@/api/companies";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateCompanyDialog } from "./CreateCompanyDialog";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar } from "@/components/hirely/Avatar";
import { EmptyState } from "@/components/hirely/EmptyState";
import { SearchInput } from "@/components/hirely/SearchInput";
import { btnPrimary } from "@/components/hirely/buttonStyles";
import { timeAgo } from "@/lib/pageTime";
import type { Company } from "@/types/company";

export function CompaniesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const canCreate = user?.role === "ADMIN";

  const { data: companies, isLoading, isError, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const filtered = companies?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Companies"
        subtitle="Organizations posting roles on Hirely."
        count={companies?.length}
        action={
          canCreate && (
            <button onClick={() => setDialogOpen(true)} className={btnPrimary}>
              <Plus className="h-4 w-4" />
              Add company
            </button>
          )
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search companies…" className="mb-6" />

      {isLoading && <LoadingState label="Loading companies…" />}
      {isError && <ErrorState message="Couldn't load companies." onRetry={() => refetch()} />}

      {filtered && filtered.length === 0 && (
        <EmptyState
          icon={search ? SearchX : Building2}
          title={search ? `No companies match "${search}"` : "No companies yet"}
          description={search ? "Try a different name." : "Add your first hiring organization to get started."}
          action={
            search ? (
              <button className={btnPrimary} onClick={() => setSearch("")}>
                Clear search
              </button>
            ) : canCreate ? (
              <button className={btnPrimary} onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Add company
              </button>
            ) : undefined
          }
        />
      )}

      {filtered && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company, i) => (
            <CompanyCard key={company.id} company={company} index={i} />
          ))}
        </div>
      )}

      <CreateCompanyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function CompanyCard({ company, index }: { company: Company; index: number }) {
  return (
    <article
      style={{ animationDelay: `${index * 40}ms` }}
      className="animate-fade-up flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lift"
    >
      <div className="flex items-center gap-3">
        <Avatar name={company.name} shape="square" className="h-11 w-11 text-sm" />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">{company.name}</h3>
          <p className="truncate text-xs text-slate-500">{company.industry || "General industry"}</p>
        </div>
      </div>

      {company.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{company.description}</p>
      )}

      <div className="mt-4 flex-1 space-y-1.5 text-sm text-slate-500">
        {company.location && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            {company.location}
          </p>
        )}
        {company.website && (
          <p className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-slate-400" />
            <a className="truncate hover:text-indigo-600 hover:underline" href={normalizeUrl(company.website)} target="_blank" rel="noreferrer">
              {company.website}
            </a>
          </p>
        )}
        {company.email && (
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
            <a className="truncate hover:text-indigo-600 hover:underline" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
        Added {timeAgo(company.createdAt)}
      </div>
    </article>
  );
}