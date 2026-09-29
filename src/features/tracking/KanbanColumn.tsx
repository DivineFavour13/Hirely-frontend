import { useDroppable } from "@dnd-kit/core";
import {
  Inbox,
  Search,
  CalendarDays,
  MailOpen,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import type { Application, ApplicationStatus } from "@/types/application";
import { ApplicationCard } from "./ApplicationCard";

interface ColumnConfig {
  label: string;
  icon: React.ElementType;
  headerText: string;
  topBorder: string;
  headerBg: string;
  columnBg: string;
  borderColor: string;
}

const STATUS_CONFIG: Record<ApplicationStatus, ColumnConfig> = {
  APPLIED: {
    label: "Applied",
    icon: Inbox,
    headerText: "text-slate-700",
    topBorder: "border-t-slate-400",
    headerBg: "bg-slate-50/80",
    columnBg: "bg-slate-50/40",
    borderColor: "border-slate-200",
  },
  SCREENING: {
    label: "Screening",
    icon: Search,
    headerText: "text-sky-700",
    topBorder: "border-t-sky-400",
    headerBg: "bg-sky-50/80",
    columnBg: "bg-sky-50/40",
    borderColor: "border-sky-200",
  },
  INTERVIEW: {
    label: "Interview",
    icon: CalendarDays,
    headerText: "text-amber-700",
    topBorder: "border-t-amber-400",
    headerBg: "bg-amber-50/80",
    columnBg: "bg-amber-50/40",
    borderColor: "border-amber-200",
  },
  OFFERED: {
    label: "Offered",
    icon: MailOpen,
    headerText: "text-violet-700",
    topBorder: "border-t-violet-400",
    headerBg: "bg-violet-50/80",
    columnBg: "bg-violet-50/40",
    borderColor: "border-violet-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    headerText: "text-rose-700",
    topBorder: "border-t-rose-400",
    headerBg: "bg-rose-50/80",
    columnBg: "bg-rose-50/40",
    borderColor: "border-rose-200",
  },
  HIRED: {
    label: "Hired",
    icon: CheckCircle2,
    headerText: "text-emerald-700",
    topBorder: "border-t-emerald-400",
    headerBg: "bg-emerald-50/80",
    columnBg: "bg-emerald-50/40",
    borderColor: "border-emerald-200",
  },
};

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  canDrag: boolean;
  onOpen: (application: Application) => void;
}

export function KanbanColumn({ status, applications, canDrag, onOpen }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { type: "column", status },
  });

  return (
    <div
      ref={setNodeRef}
      className={[
        "flex flex-col w-80 min-w-80 h-full rounded-xl border-2 border-t-[3px] overflow-hidden transition-colors duration-150",
        config.topBorder,
        config.borderColor,
        config.columnBg,
        isOver ? "ring-2 ring-offset-2 ring-gray-300 bg-gray-50" : "",
      ].join(" ")}
    >
      <div
        className={[
          "px-4 py-3 flex items-center justify-between border-b flex-shrink-0",
          config.headerBg,
          config.borderColor,
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <Icon className={["w-4 h-4", config.headerText].join(" ")} />
          <h3 className={["text-sm font-semibold", config.headerText].join(" ")}>
            {config.label}
          </h3>
        </div>
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 min-w-[1.5rem]">
          {applications.length}
        </span>
      </div>

      <div
        className={[
          "flex-1 overflow-y-auto p-3 space-y-2 min-h-0",
          isOver ? "bg-gray-100/40" : "",
        ].join(" ")}
      >
        {applications.length === 0 ? (
          <div className="h-36 flex flex-col items-center justify-center text-center">
            <Icon className="w-7 h-7 text-gray-300 mb-2" />
            <p className="text-sm text-gray-400 font-medium">No candidates</p>
            {canDrag && <p className="text-xs text-gray-300 mt-0.5">Drop cards here</p>}
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} canDrag={canDrag} onOpen={onOpen} />
          ))
        )}
      </div>
    </div>
  );
}