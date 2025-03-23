
import { Task } from "@/types";
import { getDepartmentById, getUserById } from "@/data/mockData";
import { useDialog } from "@/hooks/useDialog";
import TaskFormDialog from "./TaskFormDialog";
import { useState } from "react";
import { TaskHeader } from "./task-detail/TaskHeader";
import { TaskDescription } from "./task-detail/TaskDescription";
import { TaskMetadata } from "./task-detail/TaskMetadata";
import { TaskTimestamps } from "./task-detail/TaskTimestamps";
import { TaskActions } from "./task-detail/TaskActions";

type TaskDetailDialogProps = {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
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
      <TaskHeader task={task} />
      
      <div className="my-6 space-y-5">
        <TaskDescription description={task.description} />
        
        <TaskMetadata 
          assignee={assignee}
          department={department}
          dueDate={task.dueDate}
          tags={task.tags}
        />
        
        <TaskTimestamps 
          createdAt={task.createdAt}
          updatedAt={task.updatedAt}
          creator={creator}
        />
      </div>
      
      <TaskActions 
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
      
      <DialogComponent />
    </>
  );
}
