
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await getTasks();
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await addTaskService(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success("Task added successfully");
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const updatedTask = await updateTaskService(task);
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
      toast.success("Task updated successfully");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteTaskService(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updatedTask = await moveTaskService(taskId, newStatus);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
    } catch (err) {
      console.error("Error moving task:", err);
      toast.error("Failed to move task");
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
