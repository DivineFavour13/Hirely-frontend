import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}