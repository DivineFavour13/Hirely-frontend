import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { updateJob } from "@/api/jobs";
import type { Job, EmploymentType, JobStatus } from "@/types/job";

interface EditJobDialogProps {
  job: Job | null;
  onClose: () => void;
}

const employmentTypes: EmploymentType[] = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const jobStatuses: JobStatus[] = ["DRAFT", "OPEN", "CLOSED"];

export function EditJobDialog({ job, onClose }: EditJobDialogProps) {
  const [editedJobId, setEditedJobId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    minSalary: "",
    maxSalary: "",
    employmentType: "FULL_TIME" as EmploymentType,
    status: "OPEN" as JobStatus,
  });
  const queryClient = useQueryClient();

  if (job && job.id !== editedJobId) {
    setEditedJobId(job.id);
    setForm({
      title: job.title,
      minSalary: job.minSalary?.toString() ?? "",
      maxSalary: job.maxSalary?.toString() ?? "",
      employmentType: job.employmentType ?? "FULL_TIME",
      status: job.status,
    });
  }

  const mutation = useMutation({
    mutationFn: () =>
      updateJob(job!.id, {
        title: form.title,
        minSalary: form.minSalary ? Number(form.minSalary) : undefined,
        maxSalary: form.maxSalary ? Number(form.maxSalary) : undefined,
        employmentType: form.employmentType,
        status: form.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onClose();
    },
  });

  if (!job) return null;

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10";
  const labelClass = "mb-1.5 block text-[13px] font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-slate-900">Edit job</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Job title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as JobStatus }))}
              className={inputClass}
            >
              {jobStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Employment type</label>
            <select
              value={form.employmentType}
              onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value as EmploymentType }))}
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
                onChange={(e) => setForm((f) => ({ ...f, minSalary: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max salary</label>
              <input
                type="number"
                value={form.maxSalary}
                onChange={(e) => setForm((f) => ({ ...f, maxSalary: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          {mutation.isError && (
            <p className="text-[13px] text-rose-600">Couldn't save changes. Try again.</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {mutation.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}