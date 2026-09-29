import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Briefcase, Clock } from "lucide-react";
import type { Application } from "@/types/application";
import { getInitials, getAvatarColor, formatRelativeTime } from "./kanban-helpers";

interface ApplicationCardProps {
  application: Application;
  canDrag: boolean;
  isOverlay?: boolean;
  onOpen?: (application: Application) => void;
}

export function ApplicationCard({
  application,
  canDrag,
  isOverlay,
  onOpen,
}: ApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: `card-${application.id}`,
    data: {
      type: "card",
      application,
      status: application.status,
    },
    disabled: !canDrag || isOverlay,
  });

  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? "none" : transition,
      };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      onClick={() => onOpen?.(application)}
      className={[
        "group relative bg-white rounded-lg border shadow-sm transition-all duration-200",
        isOverlay
          ? "shadow-xl ring-1 ring-black/5 scale-105 cursor-grabbing border-gray-200"
          : "border-gray-200 hover:shadow-md hover:border-gray-300 cursor-pointer",
        isDragging ? "opacity-30" : "opacity-100",
      ].join(" ")}
    >
      <div className="p-3 flex items-start gap-3">
        <div
          className={[
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold select-none",
            getAvatarColor(application.applicant.name),
          ].join(" ")}
        >
          {getInitials(application.applicant.name)}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {application.applicant.name}
          </h4>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {application.applicant.email}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium max-w-full">
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{application.job.title}</span>
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-semibold ${
                application.matchScore >= 70
                  ? "bg-emerald-100 text-emerald-700"
                  : application.matchScore >= 40
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {application.matchScore}%
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>Applied {formatRelativeTime(application.appliedDate)}</span>
          </div>
        </div>

        {canDrag && !isOverlay && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
            aria-label="Drag to move"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}