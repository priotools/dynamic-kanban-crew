
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

export async function getUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.warn('No user profiles found');
      return [];
    }
    
    return data.map(user => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email,
      avatar: user.avatar_url,
      role: user.role as UserRole, // Cast the string to UserRole enum
      departmentId: user.department_id
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name || 'Unknown User',
      email: data.email,
      avatar: data.avatar_url,
      role: data.role as UserRole, // Cast the string to UserRole enum
      departmentId: data.department_id
    };
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
}
