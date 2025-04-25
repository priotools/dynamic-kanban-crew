
import { Task } from "@/types";

export const getPriorityColor = (priority: Task["priority"]): string => {
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

export const getTagClass = (tag: string): string => {
  // Simple tag styling based on tag name
  return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs";
};

