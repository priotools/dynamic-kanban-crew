
import { supabase } from '@/integrations/supabase/client';
import { Department, User, UserRole } from '@/types';

export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*');
  
  if (error) throw error;
  
  return data.map(dept => ({
    id: dept.id,
    name: dept.name,
    headId: dept.head_id,
    createdAt: dept.created_at
  }));
}

export async function getDepartmentById(id: string): Promise<Department | null> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    headId: data.head_id,
    createdAt: data.created_at
  };
}

export async function getUsersByDepartment(departmentId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('department_id', departmentId);
  
  if (error) throw error;
  
  return data.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar_url,
    role: user.role as UserRole, // Cast the string to UserRole enum
    departmentId: user.department_id
  }));
}
