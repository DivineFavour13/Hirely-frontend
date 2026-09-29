import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getApplications, updateApplicationStatus } from "@/api/applications";
import type { Application, ApplicationStatus } from "@/types/application";
import { STATUS_ORDER } from "./kanban-helpers";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationDetailPanel } from "./ApplicationDetailPanel";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export function KanbanBoard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const canDrag = user?.role === "ADMIN" || user?.role === "COMPANY_REP";
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);

  const { data: applications, isLoading, isError, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      updateApplicationStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      const previous = queryClient.getQueryData<Application[]>(["applications"]);
      queryClient.setQueryData<Application[]>(["applications"], (old) =>
        old?.map((app) => (app.id === id ? { ...app, status } : app))
      );
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["applications"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  function handleDragStart(event: DragStartEvent) {
    const app = event.active.data.current?.application as Application | undefined;
    if (app) setActiveApp(app);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveApp(null);
    if (!over) return;

    const activeStatus = active.data.current?.status as ApplicationStatus;
    const overStatus = over.data.current?.status as ApplicationStatus;
    const appId = (active.data.current?.application as Application)?.id;

    if (!overStatus || activeStatus === overStatus || !appId) return;

    mutation.mutate({ id: appId, status: overStatus });
  }

  function handleDragCancel() {
    setActiveApp(null);
  }

  if (isLoading) return <LoadingState label="Loading candidates…" />;
  if (isError) return <ErrorState message="Couldn't load the board." onRetry={() => refetch()} />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-[calc(100vh-13rem)] gap-3 overflow-x-auto pb-2">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={applications?.filter((a) => a.status === status) ?? []}
            canDrag={canDrag}
            onOpen={setDetailApp}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeApp ? <ApplicationCard application={activeApp} canDrag={canDrag} isOverlay /> : null}
      </DragOverlay>

      <ApplicationDetailPanel application={detailApp} onClose={() => setDetailApp(null)} />
    </DndContext>
  );
}