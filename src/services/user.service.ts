
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  
  return data.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar_url,
    role: user.role as any,
    departmentId: user.department_id
  }));
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
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
    email: data.email,
    avatar: data.avatar_url,
    role: data.role as any,
    departmentId: data.department_id
  };
}
