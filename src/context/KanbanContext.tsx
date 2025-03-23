
import { createContext, useContext, useState, useEffect } from "react";
import { Task, TaskStatus, KanbanColumn } from "@/types";
import { getTasksByStatus, mockTasks } from "@/data/mockData";
import { toast } from "sonner";

type KanbanContextType = {
  columns: KanbanColumn[];
  tasks: Task[];
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  deleteTask: (taskId: string) => void;
  isLoading: boolean;
};

const kanbanStatuses: { id: TaskStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" }
];

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize tasks and columns
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      
      const tasksByStatus = getTasksByStatus();
      const initialColumns = kanbanStatuses.map(status => ({
        id: status.id,
        title: status.title,
        tasks: tasksByStatus[status.id] || []
      }));
      
      setColumns(initialColumns);
      setIsLoading(false);
    }, 600);
  }, []);

  // Update columns whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const tasksByStatus = tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, {} as Record<TaskStatus, Task[]>);
      
      const updatedColumns = kanbanStatuses.map(status => ({
        id: status.id,
        title: status.title,
        tasks: tasksByStatus[status.id] || []
      }));
      
      setColumns(updatedColumns);
    }
  }, [tasks]);

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } 
          : task
      )
    );
    
    toast.success("Task moved successfully");
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id 
          ? { ...updatedTask, updatedAt: new Date().toISOString() } 
          : task
      )
    );
    
    toast.success("Task updated successfully");
  };

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success("Task added successfully");
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  return (
    <KanbanContext.Provider 
      value={{ 
        columns, 
        tasks, 
        moveTask, 
        updateTask, 
        addTask, 
        deleteTask, 
        isLoading 
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
