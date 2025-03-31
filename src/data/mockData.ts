import { User, Department, Task } from "@/types";

// Mock users data
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "admin",
    avatarUrl: "/avatars/avatar-1.jpg",
    departmentId: "dept1"
  },
  {
    id: "user2",
    name: "Sam Wilson",
    email: "sam@example.com",
    role: "manager",
    avatarUrl: "/avatars/avatar-2.jpg",
    departmentId: "dept1"
  },
  {
    id: "user3",
    name: "Jamie Smith",
    email: "jamie@example.com",
    role: "employee",
    avatarUrl: "/avatars/avatar-3.jpg",
    departmentId: "dept2"
  },
  {
    id: "user4",
    name: "Taylor Brown",
    email: "taylor@example.com",
    role: "employee",
    avatarUrl: "/avatars/avatar-4.jpg",
    departmentId: "dept2"
  },
  {
    id: "user5",
    name: "Casey Miller",
    email: "casey@example.com",
    role: "employee",
    avatarUrl: "/avatars/avatar-5.jpg",
    departmentId: "dept3"
  },
  {
    id: "user6",
    name: "Jessie Davis",
    email: "jessie@example.com",
    role: "manager",
    avatarUrl: "/avatars/avatar-6.jpg",
    departmentId: "dept3"
  },
  {
    id: "user7",
    name: "Riley White",
    email: "riley@example.com",
    role: "employee",
    avatarUrl: "/avatars/avatar-7.jpg",
    departmentId: "dept3"
  }
];

// Mock departments data
export const mockDepartments: Department[] = [
  {
    id: "dept1",
    name: "Engineering",
    headId: "user2"
  },
  {
    id: "dept2",
    name: "Marketing",
    headId: "user6"
  },
  {
    id: "dept3",
    name: "Sales",
    headId: "user5"
  }
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Develop UI for user profile",
    description: "Create a user-friendly interface for users to manage their profiles.",
    status: "in_progress",
    priority: "high",
    assigneeId: "user3",
    createdBy: "user2",
    departmentId: "dept1",
    dueDate: "2024-08-15",
    tags: ["UI", "development", "user profile"],
    createdAt: "2024-07-01"
  },
  {
    id: "task2",
    title: "Design marketing campaign",
    description: "Plan and design a marketing campaign for the new product launch.",
    status: "todo",
    priority: "medium",
    assigneeId: "user6",
    createdBy: "user2",
    departmentId: "dept2",
    dueDate: "2024-08-20",
    tags: ["marketing", "design", "campaign"],
    createdAt: "2024-07-05"
  },
  {
    id: "task3",
    title: "Generate sales leads",
    description: "Identify and generate potential sales leads for the sales team.",
    status: "backlog",
    priority: "low",
    assigneeId: "user5",
    createdBy: "user2",
    departmentId: "dept3",
    dueDate: "2024-08-25",
    tags: ["sales", "lead generation"],
    createdAt: "2024-07-10"
  },
  {
    id: "task4",
    title: "Implement user authentication",
    description: "Implement secure user authentication and authorization mechanisms.",
    status: "done",
    priority: "urgent",
    assigneeId: "user3",
    createdBy: "user2",
    departmentId: "dept1",
    dueDate: "2024-07-30",
    tags: ["security", "authentication", "authorization"],
    createdAt: "2024-07-15"
  },
  {
    id: "task5",
    title: "Create social media content",
    description: "Develop engaging content for various social media platforms.",
    status: "in_review",
    priority: "medium",
    assigneeId: "user6",
    createdBy: "user2",
    departmentId: "dept2",
    dueDate: "2024-09-01",
    tags: ["social media", "content creation"],
    createdAt: "2024-07-20"
  },
  {
    id: "task6",
    title: "Follow up with potential clients",
    description: "Contact and follow up with potential clients to close sales deals.",
    status: "in_progress",
    priority: "high",
    assigneeId: "user7",
    createdBy: "user5",
    departmentId: "dept3",
    dueDate: "2024-09-05",
    tags: ["sales", "client relations"],
    createdAt: "2024-07-25"
  },
  {
    id: "task7",
    title: "Test user profile UI",
    description: "Test the user profile UI for usability and functionality.",
    status: "in_review",
    priority: "medium",
    assigneeId: "user4",
    createdBy: "user2",
    departmentId: "dept1",
    dueDate: "2024-08-10",
    tags: ["UI", "testing", "user profile"],
    createdAt: "2024-07-01"
  },
  {
    id: "task8",
    title: "Analyze marketing campaign results",
    description: "Analyze the results of the marketing campaign and provide insights.",
    status: "done",
    priority: "medium",
    assigneeId: "user6",
    createdBy: "user2",
    departmentId: "dept2",
    dueDate: "2024-08-15",
    tags: ["marketing", "analysis", "campaign"],
    createdAt: "2024-07-05"
  },
  {
    id: "task9",
    title: "Negotiate contracts with clients",
    description: "Negotiate and finalize contracts with new clients.",
    status: "in_progress",
    priority: "high",
    assigneeId: "user5",
    createdBy: "user2",
    departmentId: "dept3",
    dueDate: "2024-08-20",
    tags: ["sales", "contracts", "negotiation"],
    createdAt: "2024-07-10"
  },
  {
    id: "task10",
    title: "Implement data validation",
    description: "Implement data validation to ensure data integrity.",
    status: "todo",
    priority: "medium",
    assigneeId: "user3",
    createdBy: "user2",
    departmentId: "dept1",
    dueDate: "2024-08-25",
    tags: ["data", "validation", "integrity"],
    createdAt: "2024-07-15"
  }
];
