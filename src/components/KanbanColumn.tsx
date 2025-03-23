
import { KanbanColumn as KanbanColumnType, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";
import { DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKanban } from "@/context/KanbanContext";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/hooks/useDialog";
import TaskFormDialog from "./TaskFormDialog";

type KanbanColumnProps = {
  column: KanbanColumnType;
  onDragStart: (e: DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  isOver: boolean;
};

const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case "backlog":
      return "bg-kanban-purple/30 text-kanban-purpleForeground";
    case "todo":
      return "bg-kanban-blue/30 text-kanban-blueForeground";
    case "in_progress":
      return "bg-kanban-yellow/30 text-kanban-yellowForeground";
    case "in_review":
      return "bg-kanban-red/30 text-kanban-redForeground";
    case "done":
      return "bg-kanban-green/30 text-kanban-greenForeground";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function KanbanColumn({
  column,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isOver,
}: KanbanColumnProps) {
  const { addTask } = useKanban();
  const { currentUser } = useAuth();
  const { openDialog, DialogComponent } = useDialog();

  const handleAddTask = () => {
    if (!currentUser) return;
    
    openDialog(
      <TaskFormDialog 
        onSubmit={(taskData) => {
          addTask({
            ...taskData,
            status: column.id,
            createdBy: currentUser.id,
          });
        }} 
        initialStatus={column.id}
      />
    );
  };

  return (
    <div 
      className={cn(
        "kanban-column flex flex-col rounded-lg bg-white shadow-sm",
        isOver && "ring-2 ring-primary/20"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="p-3 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium", getStatusColor(column.id))}>
            {column.tasks.length}
          </span>
          <h3 className="font-medium">{column.title}</h3>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7" 
          onClick={handleAddTask}
          title="Add new task"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        className={cn(
          "flex-1 p-3 flex flex-col gap-3 min-h-[200px]",
          isOver && "bg-blue-50/50",
          column.tasks.length === 0 && !isOver && "flex items-center justify-center"
        )}
      >
        {column.tasks.length === 0 && !isOver ? (
          <div className="text-center p-4 rounded-md border border-dashed text-gray-400 text-sm">
            No tasks yet
          </div>
        ) : (
          column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={(e) => onDragStart(e, task.id)}
            />
          ))
        )}
        
        {isOver && (
          <div className="kanban-drop-preview min-h-[80px] animate-pulse"></div>
        )}
      </div>
      
      <DialogComponent />
    </div>
  );
}
