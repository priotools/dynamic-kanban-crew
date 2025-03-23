
import { useKanban } from "@/context/KanbanContext";
import { DragEvent, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { TaskStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanBoard() {
  const { columns, moveTask, isLoading } = useKanban();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    
    // For better UX, set a ghost drag image
    const dragImage = document.createElement("div");
    dragImage.classList.add("kanban-drag-ghost");
    dragImage.innerHTML = `<div class="w-64 h-20 rounded-md bg-white/80 backdrop-blur shadow-md">Moving task</div>`;
    document.body.appendChild(dragImage);
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumnId(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, columnId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    moveTask(taskId, columnId);
    setDraggedTaskId(null);
    setDragOverColumnId(null);
  };

  if (isLoading) {
    return (
      <div className="flex gap-5 overflow-x-auto pb-6 px-4 animate-fade-in">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="kanban-column flex flex-col gap-3">
            <Skeleton className="h-8 w-full" />
            <div className="space-y-3">
              {Array.from({ length: index + 1 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 px-4 animate-fade-in">
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          onDragStart={handleDragStart}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
          isOver={dragOverColumnId === column.id}
        />
      ))}
    </div>
  );
}
