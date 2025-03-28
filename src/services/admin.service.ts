
import { supabase } from '@/lib/supabase';
import { User, UserRole, Department } from '@/types';

export async function createDepartment(data: { name: string }): Promise<Department> {
  try {
    const { data: department, error } = await supabase
      .from('departments')
      .insert([{ name: data.name }])
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: department.id,
      name: department.name,
      headId: department.head_id,
      createdAt: department.created_at
    };
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
}

export async function updateDepartment(id: string, data: { name: string }): Promise<void> {
  try {
    const { error } = await supabase
      .from('departments')
      .update({ name: data.name })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating department with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteDepartment(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting department with ID ${id}:`, error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating role for user with ID ${userId}:`, error);
    throw error;
  }
}

export async function updateUserDepartment(userId: string, departmentId: string | null): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ department_id: departmentId })
      .eq('id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating department for user with ID ${userId}:`, error);
    throw error;
  }
}
