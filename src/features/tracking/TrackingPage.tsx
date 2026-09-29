import { Download } from "lucide-react";
import { useState } from "react";
import { exportApplicationsCSV } from "@/api/applications";
import { downloadBlob } from "@/lib/download";
import { PageHeader } from "@/components/shared/PageHeader";
import { KanbanBoard } from "./KanbanBoard";
import { useAuth } from "@/context/AuthContext";

export function TrackingPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();
  const canExport = user?.role === "ADMIN" || user?.role === "COMPANY_REP";

  async function handleExport() {
    setIsExporting(true);
    try {
      const blob = await exportApplicationsCSV();
      downloadBlob(blob, "applications.csv");
    } catch {
      alert("Couldn't export applications. Try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <PageHeader
        title="Tracking"
        subtitle="Drag a candidate to move them through the pipeline."
        action={
          canExport && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting…" : "Export CSV"}
            </button>
          )
        }
      />
      <KanbanBoard />
    </div>
  );
}