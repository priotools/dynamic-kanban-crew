import { User, Department, Task, TaskStatus, TaskPriority, UserRole } from "@/types";

export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "/avatars/avatar-1.jpg",
    role: "admin",
    departmentId: "dept1"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "/avatars/avatar-2.jpg", 
    role: "manager",
    departmentId: "dept1"
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    avatarUrl: "/avatars/avatar-3.jpg",
    role: "employee",
    departmentId: "dept2"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatarUrl: "/avatars/avatar-4.jpg",
    role: "employee",
    departmentId: "dept2"
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    avatarUrl: "/avatars/avatar-5.jpg",
    role: "employee",
    departmentId: "dept3"
  },
  {
    id: "6",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatarUrl: "/avatars/avatar-6.jpg",
    role: "employee",
    departmentId: "dept3"
  },
  {
    id: "7",
    name: "David Taylor",
    email: "david@example.com",
    avatarUrl: "/avatars/avatar-7.jpg",
    role: "manager",
    departmentId: "dept3"
  }
];

export const departments: Department[] = [
  {
    id: "dept1",
    name: "Marketing",
    headId: "2"
  },
  {
    id: "dept2",
    name: "Sales",
    headId: "4"
  },
  {
    id: "dept3",
    name: "Engineering",
    headId: "7"
  }
];

export const tasks: Task[] = [
  {
    id: "task1",
    title: "Design landing page",
    description: "Create a visually appealing landing page for the new product.",
    status: "todo",
    priority: "high",
    assigneeId: "2",
    createdBy: "1",
    departmentId: "dept1",
    dueDate: "2024-03-15",
    tags: ["design", "marketing"],
    createdAt: "2024-03-01"
  },
  {
    id: "task2",
    title: "Implement user authentication",
    description: "Set up user authentication using Supabase Auth.",
    status: "in_progress",
    priority: "urgent",
    assigneeId: "7",
    createdBy: "1",
    departmentId: "dept3",
    dueDate: "2024-03-10",
    tags: ["authentication", "supabase"],
    createdAt: "2024-03-02"
  },
  {
    id: "task3",
    title: "Write blog post",
    description: "Write a blog post about the benefits of using our product.",
    status: "in_review",
    priority: "medium",
    assigneeId: "4",
    createdBy: "1",
    departmentId: "dept2",
    dueDate: "2024-03-20",
    tags: ["content", "marketing"],
    createdAt: "2024-03-03"
  },
  {
    id: "task4",
    title: "Fix bug in payment processing",
    description: "There's a bug in the payment processing that needs to be fixed ASAP.",
    status: "done",
    priority: "urgent",
    assigneeId: "7",
    createdBy: "1",
    departmentId: "dept3",
    dueDate: "2024-03-05",
    tags: ["bug", "payment"],
    createdAt: "2024-03-04"
  },
  {
    id: "task5",
    title: "Create marketing campaign",
    description: "Create a marketing campaign to promote the new product.",
    status: "backlog",
    priority: "high",
    assigneeId: "2",
    createdBy: "1",
    departmentId: "dept1",
    dueDate: "2024-03-25",
    tags: ["marketing", "campaign"],
    createdAt: "2024-03-05"
  },
  {
    id: "task6",
    title: "Implement search functionality",
    description: "Implement search functionality to allow users to search for products.",
    status: "todo",
    priority: "medium",
    assigneeId: "7",
    createdBy: "1",
    departmentId: "dept3",
    dueDate: "2024-03-30",
    tags: ["search", "functionality"],
    createdAt: "2024-03-06"
  },
  {
    id: "task7",
    title: "Update website design",
    description: "Update the website design to be more modern and visually appealing.",
    status: "in_progress",
    priority: "low",
    assigneeId: "2",
    createdBy: "1",
    departmentId: "dept1",
    dueDate: "2024-04-05",
    tags: ["design", "website"],
    createdAt: "2024-03-07"
  },
  {
    id: "task8",
    title: "Test user authentication",
    description: "Test user authentication to ensure it is working correctly.",
    status: "in_review",
    priority: "high",
    assigneeId: "7",
    createdBy: "1",
    departmentId: "dept3",
    dueDate: "2024-03-12",
    tags: ["authentication", "testing"],
    createdAt: "2024-03-08"
  },
  {
    id: "task9",
    title: "Write documentation",
    description: "Write documentation for the new product.",
    status: "done",
    priority: "medium",
    assigneeId: "4",
    createdBy: "1",
    departmentId: "dept2",
    dueDate: "2024-03-18",
    tags: ["documentation", "content"],
    createdAt: "2024-03-09"
  },
  {
    id: "task10",
    title: "Deploy new version of website",
    description: "Deploy the new version of the website to production.",
    status: "backlog",
    priority: "high",
    assigneeId: "7",
    createdBy: "1",
    departmentId: "dept3",
    dueDate: "2024-04-10",
    tags: ["deployment", "website"],
    createdAt: "2024-03-10"
  }
];
