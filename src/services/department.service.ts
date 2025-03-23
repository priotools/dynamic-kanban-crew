
import { supabase } from '@/lib/supabase';
import { Department } from '@/types';

export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*');
  
  if (error) throw error;
  
  return data.map(dept => ({
    id: dept.id,
    name: dept.name,
    headId: dept.head_id || null
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
    headId: data.head_id || null
  };
}

export async function getUsersInDepartment(departmentId: string) {
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
    role: user.role,
    departmentId: user.department_id
  }));
}
