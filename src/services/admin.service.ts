
import { supabase } from '@/lib/supabase';
import { User, UserRole, Department } from '@/types';

// User management functions
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*, departments(name)');
    
    if (error) throw error;
    
    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role as UserRole,
      avatarUrl: profile.avatar_url,
      departmentId: profile.department_id,
      departmentName: profile.departments?.name
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Department management functions
export async function getDepartments(): Promise<Department[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

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

// User management functions
export async function createUser(data: { 
  name: string; 
  email: string; 
  password: string; 
  role: UserRole;
  avatarUrl?: string;
}): Promise<User> {
  try {
    // First, create the user in auth system
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          avatar_url: data.avatarUrl,
          role: data.role
        }
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");
    
    // Update profile with additional data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: data.role,
        name: data.name,
        avatar_url: data.avatarUrl
      })
      .eq('id', authData.user.id);
    
    if (profileError) throw profileError;
    
    // Return created user
    return {
      id: authData.user.id,
      email: data.email,
      name: data.name,
      role: data.role,
      avatarUrl: data.avatarUrl
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  email?: string;
  role?: UserRole;
  avatarUrl?: string;
  departmentId?: string | null;
}): Promise<void> {
  try {
    const updates: Record<string, any> = {};
    
    // Map data to database column names
    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email;
    if (data.role !== undefined) updates.role = data.role;
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;
    if (data.departmentId !== undefined) updates.department_id = data.departmentId;
    
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    
    // If email is being updated, also update auth user
    if (data.email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { email: data.email }
      );
      
      if (authError) throw authError;
    }
  } catch (error) {
    console.error(`Error updating user profile with ID ${userId}:`, error);
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

export async function deleteUser(userId: string): Promise<void> {
  try {
    // Delete user from auth system
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      // Fallback if admin API is not available - delete profile directly
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) throw profileError;
    }
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}
