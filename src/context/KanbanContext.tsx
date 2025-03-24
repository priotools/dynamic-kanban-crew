
import React, { createContext, useContext, useEffect, useState } from 'react';
import { KanbanColumn, Task, TaskStatus } from '@/types';
import { toast } from 'sonner';
import { getTasks, addTask as addTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService, moveTask as moveTaskService } from '@/services/task.service';

interface KanbanContextType {
  tasks: Task[];
  columns: KanbanColumn[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [refreshCounter]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setError(err.message || "Failed to load tasks. Please try again.");
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTasks = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      const newTask = await addTaskService(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success("Task added successfully");
    } catch (err: any) {
      console.error("Error adding task:", err);
      toast.error(err.message || "Failed to add task");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      setIsLoading(true);
      const updatedTask = await updateTaskService(task);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
      toast.success("Task updated successfully");
    } catch (err: any) {
      console.error("Error updating task:", err);
      toast.error(err.message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await deleteTaskService(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err: any) {
      console.error("Error deleting task:", err);
      toast.error(err.message || "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) {
        toast.error("Task not found");
        return;
      }
      
      // Optimistically update UI first
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task)
      );
      
      const updatedTask = await moveTaskService(taskId, newStatus);
      
      // Update with server response
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
    } catch (err: any) {
      console.error("Error moving task:", err);
      toast.error(err.message || "Failed to move task");
      // Revert optimistic update by refreshing data
      refreshTasks();
    }
  };

  // Group tasks by status to create columns
  const columns: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', tasks: tasks.filter(task => task.status === 'backlog') },
    { id: 'todo', title: 'To Do', tasks: tasks.filter(task => task.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(task => task.status === 'in_progress') },
    { id: 'in_review', title: 'In Review', tasks: tasks.filter(task => task.status === 'in_review') },
    { id: 'done', title: 'Done', tasks: tasks.filter(task => task.status === 'done') },
  ];

  return (
    <KanbanContext.Provider value={{ 
      tasks, 
      columns, 
      isLoading, 
      error, 
      addTask, 
      updateTask, 
      deleteTask, 
      moveTask 
    }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
