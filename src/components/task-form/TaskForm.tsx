
import { Task, TaskStatus } from "@/types";
import { TaskAssigneeField } from "./TaskAssigneeField";
import { TaskDepartmentField } from "./TaskDepartmentField";
import { TaskDescriptionField } from "./TaskDescriptionField";
import { TaskDueDateField } from "./TaskDueDateField";
import { TaskFormLayout } from "./TaskFormLayout";
import { TaskPriorityField } from "./TaskPriorityField";
import { TaskStatusField } from "./TaskStatusField";
import { TaskTagsField } from "./TaskTagsField";
import { TaskTitleField } from "./TaskTitleField";
import { TaskFormValues, getDefaultValues, taskFormSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type TaskFormProps = {
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "createdBy" | "updatedAt">) => void;
  initialValues?: Partial<Task>;
  initialStatus?: TaskStatus;
  userDepartmentId?: string;
};

export function TaskForm({ 
  onSubmit, 
  initialValues, 
  initialStatus = "todo",
  userDepartmentId
}: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getDefaultValues(initialValues, initialStatus, userDepartmentId),
  });
  
  const handleSubmit = (values: TaskFormValues) => {
    const processedTags = values.tags 
      ? values.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
      : undefined;
    
    onSubmit({
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      assigneeId: values.assigneeId === "unassigned" ? undefined : values.assigneeId,
      departmentId: values.departmentId,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      tags: processedTags,
    });
  };

  return (
    <TaskFormLayout 
      form={form} 
      onSubmit={handleSubmit} 
      isEditing={!!initialValues}
    >
      <TaskTitleField form={form} />
      <TaskDescriptionField form={form} />
      
      <div className="grid grid-cols-2 gap-4">
        <TaskStatusField form={form} />
        <TaskPriorityField form={form} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <TaskDepartmentField form={form} />
        <TaskAssigneeField form={form} />
      </div>
      
      <TaskDueDateField form={form} />
      <TaskTagsField form={form} />
    </TaskFormLayout>
  );
}
