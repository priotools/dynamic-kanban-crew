
import { Task, TaskStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { TaskForm } from "./task-form/TaskForm";

type TaskFormDialogProps = {
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "createdBy" | "updatedAt">) => void;
  initialValues?: Partial<Task>;
  initialStatus?: TaskStatus;
};

export default function TaskFormDialog({ 
  onSubmit, 
  initialValues, 
  initialStatus = "todo"
}: TaskFormDialogProps) {
  const { currentUser } = useAuth();
  
  return (
    <TaskForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      initialStatus={initialStatus}
      userDepartmentId={currentUser?.departmentId}
    />
  );
}
