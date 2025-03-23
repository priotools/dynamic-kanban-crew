
import { Department, Task, User } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar, Tag } from "lucide-react";
import { DragEvent, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getDepartmentById, getUserById } from "@/data/mockData";
import { useKanban } from "@/context/KanbanContext";
import { useDialog } from "@/hooks/useDialog";
import TaskDetailDialog from "./TaskDetailDialog";

type TaskCardProps = {
  task: Task;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
};

const getPriorityColor = (priority: Task["priority"]): string => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "urgent":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  const [assignee, setAssignee] = useState<User | null>(
    task.assigneeId ? getUserById(task.assigneeId) || null : null
  );
  const [department, setDepartment] = useState<Department | null>(
    getDepartmentById(task.departmentId) || null
  );
  const { openDialog, DialogComponent } = useDialog();
  const { updateTask, deleteTask } = useKanban();

  const handleOpenTaskDetail = () => {
    openDialog(
      <TaskDetailDialog 
        task={task} 
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    );
  };

  return (
    <>
      <div
        className="task-card bg-white rounded-lg shadow-sm border p-3 cursor-pointer select-none"
        draggable
        onDragStart={onDragStart}
        onClick={handleOpenTaskDetail}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
          <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
            {task.priority}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
        )}
        
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
            <Tag className="h-3 w-3 text-gray-500" />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hidden">
            {task.tags?.map(tag => (
              <span 
                key={tag} 
                className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          {assignee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {assignee.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600 truncate max-w-[100px]">
                {assignee.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
        </div>
      </div>
      
      <DialogComponent />
    </>
  );
}
