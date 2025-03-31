
export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
  headId?: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  createdBy: string;
  departmentId: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
