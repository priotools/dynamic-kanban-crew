
import { Task } from "@/types";
import { getDepartmentById, getUserById } from "@/data/mockData";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Calendar, ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/useDialog";
import TaskDetailDialog from "./TaskDetailDialog";
import { useKanban } from "@/context/KanbanContext";

type TaskListProps = {
  tasks: Task[];
};

type SortField = "priority" | "dueDate" | "status" | "title";
type SortOrder = "asc" | "desc";

export default function TaskList({ tasks }: TaskListProps) {
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { openDialog, DialogComponent } = useDialog();
  const { updateTask, deleteTask } = useKanban();
  
  const handleOpenTask = (task: Task) => {
    openDialog(
      <TaskDetailDialog 
        task={task} 
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    );
  };
  
  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "priority":
        const priorityOrder = { "urgent": 3, "high": 2, "medium": 1, "low": 0 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "dueDate":
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case "status":
        const statusOrder = { "backlog": 0, "todo": 1, "in_progress": 2, "in_review": 3, "done": 4 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });
  
  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">High</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Urgent</Badge>;
    }
  };
  
  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "backlog":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Backlog</Badge>;
      case "todo":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">To Do</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">In Progress</Badge>;
      case "in_review":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">In Review</Badge>;
      case "done":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Done</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <ListFilter className="h-3.5 w-3.5 mr-1" />
              Sort by {sortField.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuRadioGroup 
              value={`${sortField}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-") as [SortField, SortOrder];
                setSortField(field);
                setSortOrder(order);
              }}
            >
              <DropdownMenuRadioItem value="priority-desc">Priority (High to Low)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="priority-asc">Priority (Low to High)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dueDate-asc">Due Date (Earliest)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dueDate-desc">Due Date (Latest)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="status-asc">Status (To Do first)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="status-desc">Status (Done first)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title-asc">Title (A-Z)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title-desc">Title (Z-A)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {sortedTasks.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map(task => {
                const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;
                
                return (
                  <TableRow 
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOpenTask(task)}
                  >
                    <TableCell className="font-medium">
                      {task.title}
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                      )}
                    </TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {assignee.name.charAt(0)}
                          </span>
                          <span className="text-sm">{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No due date</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground">There are no tasks matching your criteria.</p>
        </div>
      )}
      
      <DialogComponent />
    </div>
  );
}
