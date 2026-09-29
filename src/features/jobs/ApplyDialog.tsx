import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { apiClient } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import type { Job } from "@/types/job";

interface ApplyDialogProps {
  job: Job | null;
  onClose: () => void;
}

export function ApplyDialog({ job, onClose }: ApplyDialogProps) {
  const [notes, setNotes] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.post("/applications", {
        jobId: job?.id,
        applicantId: user?.applicantId,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onClose();
      setNotes("");
    },
  });

  if (!job) return null;

  const missingProfile = !user?.applicantId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-slate-900">Apply to {job.title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {missingProfile ? (
          <p className="text-[13.5px] text-slate-600">
            Your account isn't linked to an applicant profile yet, so you can't apply directly.
            Ask an admin to link your account to your applicant record.
          </p>
        ) : (
          <>
            <p className="mb-4 text-[13.5px] text-slate-500">at {job.company.name}</p>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                Note to the hiring team (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {mutation.isError && (
              <p className="mt-3 text-[13px] text-rose-600">
                Couldn't submit your application. You may have already applied to this job.
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg px-4 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {mutation.isPending ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}