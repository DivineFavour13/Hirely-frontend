import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { createApplicant } from "@/api/applicants";

interface CreateApplicantDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateApplicantDialog({ open, onClose }: CreateApplicantDialogProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
    skills: "",
    experienceSummary: "",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onClose();
      setForm({ name: "", email: "", phone: "", resumeUrl: "", skills: "", experienceSummary: "" });
    },
  });

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
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
          <h2 className="text-[17px] font-semibold text-slate-900">Add applicant</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <label className={labelClass}>Full name</label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Resume URL</label>
              <input
                value={form.resumeUrl}
                onChange={(e) => update("resumeUrl", e.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Skills</label>
            <input
              value={form.skills}
              onChange={(e) => update("skills", e.target.value)}
              placeholder="Java, Spring Boot, React"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Experience summary</label>
            <textarea
              value={form.experienceSummary}
              onChange={(e) => update("experienceSummary", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          {mutation.isError && (
            <p className="text-[13px] text-rose-600">Couldn't create applicant. Try again.</p>
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
              {mutation.isPending ? "Adding…" : "Add applicant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}