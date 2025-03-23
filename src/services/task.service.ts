
import { supabase } from '@/lib/supabase';
import { Task, TaskStatus } from '@/types';

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');
  
  if (error) throw error;
  
  return data.map(mapTaskFromSupabase);
}

export async function getTasksByStatus(): Promise<Record<TaskStatus, Task[]>> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');
  
  if (error) throw error;
  
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
  
  data.forEach(task => {
    const mappedTask = mapTaskFromSupabase(task);
    tasksByStatus[mappedTask.status].push(mappedTask);
  });
  
  return tasksByStatus;
}

export async function addTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee_id: task.assigneeId,
      created_by: task.createdBy,
      department_id: task.departmentId,
      due_date: task.dueDate,
      tags: task.tags,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return mapTaskFromSupabase(data);
}

export async function updateTask(task: Task): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee_id: task.assigneeId,
      department_id: task.departmentId,
      due_date: task.dueDate,
      updated_at: new Date().toISOString(),
      tags: task.tags,
    })
    .eq('id', task.id)
    .select()
    .single();
  
  if (error) throw error;
  
  return mapTaskFromSupabase(data);
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) throw error;
}

export async function moveTask(taskId: string, newStatus: TaskStatus): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) throw error;
  
  return mapTaskFromSupabase(data);
}

function mapTaskFromSupabase(task: any): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    priority: task.priority,
    assigneeId: task.assignee_id,
    createdBy: task.created_by,
    departmentId: task.department_id,
    dueDate: task.due_date,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    tags: task.tags,
  };
}
