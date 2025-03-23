
import { createContext, useContext, useState, useEffect } from "react";
import { Task, TaskStatus, KanbanColumn } from "@/types";
import { getTasks, getTasksByStatus, addTask as addTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService, moveTask as moveTaskService } from "@/services/task.service";
import { toast } from "sonner";
import { isSupabaseConfigured } from "@/lib/supabase";

type KanbanContextType = {
  columns: KanbanColumn[];
  tasks: Task[];
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  deleteTask: (taskId: string) => void;
  isLoading: boolean;
  isSupabaseReady: boolean;
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
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseConfigured = isSupabaseConfigured();
    setIsSupabaseReady(supabaseConfigured);
    
    if (!supabaseConfigured) {
      // Initialize empty columns
      const emptyColumns = kanbanStatuses.map(status => ({
        id: status.id,
        title: status.title,
        tasks: []
      }));
      setColumns(emptyColumns);
      setIsLoading(false);
      toast.error("Supabase configuration missing. Tasks can't be loaded.");
      return;
    }

    // Fetch tasks from Supabase
    const fetchTasks = async () => {
      setIsLoading(true);
      
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
        
        const tasksByStatus = await getTasksByStatus();
        const initialColumns = kanbanStatuses.map(status => ({
          id: status.id,
          title: status.title,
          tasks: tasksByStatus[status.id] || []
        }));
        
        setColumns(initialColumns);
      } catch (err) {
        console.error("Error loading tasks:", err);
        toast.error("Failed to load tasks");
        
        // Initialize with empty columns on error
        const emptyColumns = kanbanStatuses.map(status => ({
          id: status.id,
          title: status.title,
          tasks: []
        }));
        setColumns(emptyColumns);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (supabaseConfigured) {
      fetchTasks();
    }
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

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    if (!isSupabaseReady) {
      toast.error("Cannot update task: Supabase is not configured");
      return;
    }
    
    try {
      const updatedTask = await moveTaskService(taskId, newStatus);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
      
      toast.success("Task moved successfully");
    } catch (err) {
      console.error("Error moving task:", err);
      toast.error("Failed to move task");
    }
  };

  const updateTask = async (updatedTask: Task) => {
    if (!isSupabaseReady) {
      toast.error("Cannot update task: Supabase is not configured");
      return;
    }
    
    try {
      const result = await updateTaskService(updatedTask);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? result : task
        )
      );
      
      toast.success("Task updated successfully");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    }
  };

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    if (!isSupabaseReady) {
      toast.error("Cannot add task: Supabase is not configured");
      return;
    }
    
    try {
      const newTask = await addTaskService(task);
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success("Task added successfully");
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!isSupabaseReady) {
      toast.error("Cannot delete task: Supabase is not configured");
      return;
    }
    
    try {
      await deleteTaskService(taskId);
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    }
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
        isLoading,
        isSupabaseReady
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
