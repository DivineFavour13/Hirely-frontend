import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MessageSquare, RefreshCw, Calendar } from "lucide-react";
import { getActivity, addNote } from "@/api/activity";
import { scheduleInterview } from "@/api/applications";
import { getInitials, getAvatarColor, formatRelativeTime } from "./kanban-helpers";
import { useAuth } from "@/context/AuthContext";
import type { Application } from "@/types/application";

interface ApplicationDetailPanelProps {
  application: Application | null;
  onClose: () => void;
}

export function ApplicationDetailPanel({ application, onClose }: ApplicationDetailPanelProps) {
  const [note, setNote] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const { user } = useAuth();
  const canAddNote = user?.role === "ADMIN" || user?.role === "COMPANY_REP";
  const queryClient = useQueryClient();

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", application?.id],
    queryFn: () => getActivity(application!.id),
    enabled: !!application,
  });

  const mutation = useMutation({
    mutationFn: () => addNote(application!.id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity", application?.id] });
      setNote("");
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: () =>
      scheduleInterview(application!.id, {
        interviewDate,
        interviewLocation: interviewLocation || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity", application?.id] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      setInterviewDate("");
      setInterviewLocation("");
    },
  });

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Application details</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-semibold ${getAvatarColor(
                application.applicant.name
              )}`}
            >
              {getInitials(application.applicant.name)}
            </div>
            <div>
              <p className="text-[14px] font-medium text-slate-900">{application.applicant.name}</p>
              <p className="text-[12.5px] text-slate-500">{application.applicant.email}</p>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-slate-600">
            Applied for <span className="font-medium text-slate-900">{application.job.title}</span>
          </p>
        </div>

        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            Interview
          </h3>

          {application.interviewDate ? (
            <p className="text-[13px] text-slate-700">
              {new Date(application.interviewDate).toLocaleString()}
              {application.interviewLocation && ` · ${application.interviewLocation}`}
            </p>
          ) : (
            <p className="text-[13px] text-slate-400">Not scheduled yet.</p>
          )}

          {canAddNote && (
            <div className="mt-3 space-y-2">
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
              <input
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
                placeholder="Location or meeting link"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                onClick={() => scheduleMutation.mutate()}
                disabled={!interviewDate || scheduleMutation.isPending}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {scheduleMutation.isPending ? "Scheduling…" : "Schedule interview"}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="mb-3 text-[12px] font-medium uppercase tracking-wide text-slate-400">
            Activity
          </h3>

          {isLoading && <p className="text-[13px] text-slate-400">Loading…</p>}

          {activity && activity.length === 0 && (
            <p className="text-[13px] text-slate-400">No activity yet.</p>
          )}

          <div className="space-y-4">
            {activity?.map((item) => (
              <div key={item.id} className="flex gap-2.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  {item.type === "NOTE" ? (
                    <MessageSquare className="h-3 w-3 text-slate-500" />
                  ) : (
                    <RefreshCw className="h-3 w-3 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-slate-800">{item.content}</p>
                  <p className="mt-0.5 text-[11.5px] text-slate-400">
                    {item.createdByEmail} · {formatRelativeTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {canAddNote && (
          <div className="border-t border-slate-100 px-5 py-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note…"
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[13.5px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
            <button
              onClick={() => mutation.mutate()}
              disabled={!note.trim() || mutation.isPending}
              className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {mutation.isPending ? "Adding…" : "Add note"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}