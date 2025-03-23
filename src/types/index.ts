
export type UserRole = 'admin' | 'department_head' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  departmentId?: string;
}

export interface Department {
  id: string;
  name: string;
  headId?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';

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
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
