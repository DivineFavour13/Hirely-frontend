import { AlertTriangle } from "lucide-react";

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-100 bg-rose-50 py-16 text-center">
      <AlertTriangle className="h-5 w-5 text-rose-500" />
      <p className="text-sm text-rose-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-white px-3.5 py-1.5 text-[13px] font-medium text-rose-700 shadow-sm hover:bg-rose-50"
        >
          Try again
        </button>
      )}
    </div>
  );
}