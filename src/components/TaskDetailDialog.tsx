
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { getDepartmentById, getUserById } from "@/data/mockData";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarIcon, Tag, Trash, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDialog } from "@/hooks/useDialog";
import TaskFormDialog from "./TaskFormDialog";
import { useState } from "react";

type TaskDetailDialogProps = {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
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

const getStatusColor = (status: Task["status"]): string => {
  switch (status) {
    case "backlog":
      return "bg-purple-100 text-purple-800";
    case "todo":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "in_review":
      return "bg-red-100 text-red-800";
    case "done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TaskDetailDialog({ 
  task, 
  onUpdate, 
  onDelete 
}: TaskDetailDialogProps) {
  const { openDialog, DialogComponent } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;
  const creator = getUserById(task.createdBy);
  const department = getDepartmentById(task.departmentId);
  
  const handleEdit = () => {
    openDialog(
      <TaskFormDialog 
        initialValues={task}
        onSubmit={(updatedData) => {
          onUpdate({
            ...task,
            ...updatedData,
          });
        }}
      />
    );
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(task.id);
  };

  return (
    <>
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
      
      <div className="my-6 space-y-5">
        {task.description && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {assignee && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned to</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {assignee.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{assignee.name}</span>
                </div>
              </div>
            </div>
          )}
          
          {department && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium">{department.name}</p>
              </div>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Due date</p>
                <p className="text-sm font-medium">{format(new Date(task.dueDate), "MMMM d, yyyy")}</p>
              </div>
            </div>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <Tag className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {task.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4 text-xs text-gray-500">
          <p>Created {format(new Date(task.createdAt), "MMMM d, yyyy")} {creator ? `by ${creator.name}` : ''}</p>
          {task.updatedAt && (
            <p>Updated {format(new Date(task.updatedAt), "MMMM d, yyyy")}</p>
          )}
        </div>
      </div>
      
      <DialogFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button onClick={handleEdit}>
          Edit
        </Button>
      </DialogFooter>
      
      <DialogComponent />
    </>
  );
}
