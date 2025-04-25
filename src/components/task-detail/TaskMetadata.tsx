import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Task, User } from "@/types";
import { format } from "date-fns";
import { getPriorityColor } from "./taskStyles";

type TaskMetadataProps = {
  task: Task;
  assignee?: User | null;
  creator?: User | null;
};

export default function TaskMetadata({ task, assignee, creator }: TaskMetadataProps) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">Assignee</div>
        {assignee ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatarUrl} />
              <AvatarFallback>{assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{assignee.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Not assigned</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">Creator</div>
        {creator ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={creator.avatarUrl} />
              <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{creator.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Unknown</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">Status</div>
        <Badge variant="secondary">{task.status.replace("_", " ")}</Badge>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">Priority</div>
        <Badge className={`bg-${task.priority} text-white`}>{task.priority}</Badge>
      </div>

      {task.dueDate && (
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-sm">Due Date</div>
          <span>{format(new Date(task.dueDate), "PPP")}</span>
        </div>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-sm">Tags</div>
          <div className="flex items-center gap-2">
            {task.tags.map((tag) => (
              <Badge key={tag} className="bg-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
