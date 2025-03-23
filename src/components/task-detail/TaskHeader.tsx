
import { DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { getStatusColor, getPriorityColor } from "./taskStyles";

interface TaskHeaderProps {
  task: Task;
}

export function TaskHeader({ task }: TaskHeaderProps) {
  return (
    <DialogHeader className="space-y-3">
      <div className="flex items-center justify-between">
        <DialogTitle className="mr-8">{task.title}</DialogTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className={getStatusColor(task.status)}>
            {task.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </div>
    </DialogHeader>
  );
}
