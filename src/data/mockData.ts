
import { Department, Task, TaskStatus, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/avatars/avatar-1.jpg",
    role: "admin",
  },
  {
    id: "user-2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    avatar: "/avatars/avatar-2.jpg",
    role: "department_head",
    departmentId: "dept-1",
  },
  {
    id: "user-3",
    name: "James Wilson",
    email: "james@example.com",
    avatar: "/avatars/avatar-3.jpg",
    role: "department_head",
    departmentId: "dept-2",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "/avatars/avatar-4.jpg",
    role: "employee",
    departmentId: "dept-1",
  },
  {
    id: "user-5",
    name: "Michael Brown",
    email: "michael@example.com",
    avatar: "/avatars/avatar-5.jpg",
    role: "employee",
    departmentId: "dept-1",
  },
  {
    id: "user-6",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    avatar: "/avatars/avatar-6.jpg",
    role: "employee",
    departmentId: "dept-2",
  },
  {
    id: "user-7",
    name: "David Clark",
    email: "david@example.com",
    avatar: "/avatars/avatar-7.jpg",
    role: "employee",
    departmentId: "dept-2",
  },
];

export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Engineering",
    headId: "user-2",
  },
  {
    id: "dept-2",
    name: "Marketing",
    headId: "user-3",
  },
  {
    id: "dept-3",
    name: "Design",
    headId: null,
  },
  {
    id: "dept-4",
    name: "Finance",
    headId: null,
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement authentication",
    description: "Set up JWT authentication in the backend",
    status: "todo",
    priority: "high",
    assigneeId: "user-4",
    createdBy: "user-2",
    departmentId: "dept-1",
    dueDate: "2023-07-15",
    createdAt: "2023-07-01",
    tags: ["backend", "security"],
  },
  {
    id: "task-2",
    title: "Design landing page",
    description: "Create a modern landing page design",
    status: "in_progress",
    priority: "medium",
    assigneeId: "user-5",
    createdBy: "user-2",
    departmentId: "dept-1",
    dueDate: "2023-07-10",
    createdAt: "2023-07-02",
    tags: ["design", "frontend"],
  },
  {
    id: "task-3",
    title: "SEO optimization",
    description: "Optimize website for search engines",
    status: "backlog",
    priority: "low",
    assigneeId: "user-6",
    createdBy: "user-3",
    departmentId: "dept-2",
    dueDate: "2023-07-20",
    createdAt: "2023-07-01",
    tags: ["marketing", "seo"],
  },
  {
    id: "task-4",
    title: "Fix payment processing bug",
    description: "Investigate and fix issues with payment processing",
    status: "in_review",
    priority: "urgent",
    assigneeId: "user-4",
    createdBy: "user-2",
    departmentId: "dept-1",
    dueDate: "2023-07-05",
    createdAt: "2023-06-28",
    tags: ["backend", "bug", "critical"],
  },
  {
    id: "task-5",
    title: "Create social media campaign",
    description: "Design a social media campaign for product launch",
    status: "todo",
    priority: "medium",
    assigneeId: "user-6",
    createdBy: "user-3",
    departmentId: "dept-2",
    dueDate: "2023-07-18",
    createdAt: "2023-07-03",
    tags: ["marketing", "social media"],
  },
  {
    id: "task-6",
    title: "Update user documentation",
    description: "Update documentation to reflect new features",
    status: "done",
    priority: "low",
    assigneeId: "user-7",
    createdBy: "user-3",
    departmentId: "dept-2",
    dueDate: "2023-07-08",
    createdAt: "2023-06-30",
    updatedAt: "2023-07-07",
    tags: ["documentation"],
  },
  {
    id: "task-7",
    title: "Code refactoring",
    description: "Refactor authentication module for better performance",
    status: "in_progress",
    priority: "medium",
    assigneeId: "user-5",
    createdBy: "user-2",
    departmentId: "dept-1",
    dueDate: "2023-07-14",
    createdAt: "2023-07-03",
    tags: ["backend", "refactoring"],
  },
  {
    id: "task-8",
    title: "Create API documentation",
    description: "Document all API endpoints for developers",
    status: "todo",
    priority: "medium",
    assigneeId: "user-4",
    createdBy: "user-2",
    departmentId: "dept-1",
    dueDate: "2023-07-17",
    createdAt: "2023-07-04",
    tags: ["documentation", "api"],
  },
  {
    id: "task-9",
    title: "Implement search functionality",
    description: "Add search functionality to the dashboard",
    status: "backlog",
    priority: "low",
    assigneeId: null,
    createdBy: "user-2",
    departmentId: "dept-1",
    createdAt: "2023-07-02",
    tags: ["frontend", "feature"],
  },
  {
    id: "task-10",
    title: "Analyze competitor websites",
    description: "Research competitor websites for insights",
    status: "done",
    priority: "medium",
    assigneeId: "user-7",
    createdBy: "user-3",
    departmentId: "dept-2",
    dueDate: "2023-07-06",
    createdAt: "2023-06-29",
    updatedAt: "2023-07-05",
    tags: ["research", "marketing"],
  },
];

export const getTasksByStatus = (): Record<TaskStatus, Task[]> => {
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
  
  mockTasks.forEach(task => {
    tasksByStatus[task.status].push(task);
  });
  
  return tasksByStatus;
};

export const getTasksByDepartment = (): Record<string, Task[]> => {
  const tasksByDepartment: Record<string, Task[]> = {};
  
  mockDepartments.forEach(dept => {
    tasksByDepartment[dept.id] = [];
  });
  
  mockTasks.forEach(task => {
    if (tasksByDepartment[task.departmentId]) {
      tasksByDepartment[task.departmentId].push(task);
    }
  });
  
  return tasksByDepartment;
};

export const getTasksByAssignee = (): Record<string, Task[]> => {
  const tasksByAssignee: Record<string, Task[]> = {
    unassigned: [],
  };
  
  mockUsers.forEach(user => {
    tasksByAssignee[user.id] = [];
  });
  
  mockTasks.forEach(task => {
    if (!task.assigneeId) {
      tasksByAssignee.unassigned.push(task);
    } else if (tasksByAssignee[task.assigneeId]) {
      tasksByAssignee[task.assigneeId].push(task);
    }
  });
  
  return tasksByAssignee;
};

export const getUsersInDepartment = (departmentId: string): User[] => {
  return mockUsers.filter(user => user.departmentId === departmentId);
};

export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find(dept => dept.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};
