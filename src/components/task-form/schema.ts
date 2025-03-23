
import { TaskPriority, TaskStatus } from "@/types";
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assigneeId: z.string().optional(),
  departmentId: z.string(),
  dueDate: z.date().optional(),
  tags: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const getDefaultValues = (
  initialValues?: Partial<{
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string;
    departmentId: string;
    dueDate?: string;
    tags?: string[];
  }>,
  initialStatus: TaskStatus = "todo",
  currentUserDepartmentId?: string
) => {
  return {
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    status: initialValues?.status || initialStatus,
    priority: initialValues?.priority || "medium",
    assigneeId: initialValues?.assigneeId || undefined,
    departmentId: initialValues?.departmentId || currentUserDepartmentId || "",
    dueDate: initialValues?.dueDate ? new Date(initialValues.dueDate) : undefined,
    tags: initialValues?.tags?.join(", ") || "",
  };
};
