import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { createJob } from "@/api/jobs";
import { getCompanies } from "@/api/companies";
import type { EmploymentType } from "@/types/job";

interface CreateJobDialogProps {
  open: boolean;
  onClose: () => void;
}

const employmentTypes: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

export function CreateJobDialog({ open, onClose }: CreateJobDialogProps) {
  const [companyId, setCompanyId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    minSalary: "",
    maxSalary: "",
    employmentType: "FULL_TIME" as EmploymentType,
  });

  const queryClient = useQueryClient();
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: getCompanies });

  const mutation = useMutation({
    mutationFn: () =>
      createJob(Number(companyId), {
        title: form.title,
        description: form.description || undefined,
        requirements: form.requirements || undefined,
        minSalary: form.minSalary ? Number(form.minSalary) : undefined,
        maxSalary: form.maxSalary ? Number(form.maxSalary) : undefined,
        employmentType: form.employmentType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onClose();
      setForm({ title: "", description: "", requirements: "", minSalary: "", maxSalary: "", employmentType: "FULL_TIME" });
      setCompanyId("");
    },
  });

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-slate-900">Post a job</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <label className={labelClass}>Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="" disabled>Select a company</option>
              {companies?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Job title</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Employment type</label>
            <select
              value={form.employmentType}
              onChange={(e) => update("employmentType", e.target.value)}
              className={inputClass}
            >
              {employmentTypes.map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Min salary</label>
              <input
                type="number"
                value={form.minSalary}
                onChange={(e) => update("minSalary", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max salary</label>
              <input
                type="number"
                value={form.maxSalary}
                onChange={(e) => update("maxSalary", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Requirements</label>
            <textarea
              value={form.requirements}
              onChange={(e) => update("requirements", e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>

          {mutation.isError && (
            <p className="text-[13px] text-rose-600">
              Couldn't create job. If you're a company rep, make sure you selected your own company.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {mutation.isPending ? "Posting…" : "Post job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}