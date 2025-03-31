
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, Department } from '@/types';

// User management functions
export async function getAllUsers(): Promise<User[]> {
  try {
    console.log("Fetching all users...");
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    console.log("Fetched profiles:", profiles);
    
    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role as UserRole,
      avatarUrl: profile.avatar_url,
      departmentId: profile.department_id,
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
    console.log("Creating user with data:", { 
      email: data.email, 
      name: data.name, 
      role: data.role 
    });
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          avatar_url: data.avatarUrl
        }
      }
    });
    
    if (authError) {
      console.error("Auth error when creating user:", authError);
      throw authError;
    }
    
    if (!authData.user) {
      console.error("No user returned after signup");
      throw new Error("User creation failed");
    }
    
    console.log("Auth user created:", authData.user.id);
    
    // Update profile with role and other data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: data.role,
        name: data.name,
        avatar_url: data.avatarUrl
      })
      .eq('id', authData.user.id);
    
    if (profileError) {
      console.error("Profile update error:", profileError);
      throw profileError;
    }
    
    console.log("User profile updated with role and data");
    
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
    console.log(`Updating user profile for user ${userId} with data:`, data);
    const updates: Record<string, any> = {};
    
    // Map data to database column names
    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email;
    if (data.role !== undefined) updates.role = data.role;
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;
    if (data.departmentId !== undefined) updates.department_id = data.departmentId;
    
    console.log("Profile updates to apply:", updates);
    
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    console.log("Profile updated successfully");
    
    // If email is being updated, also update auth user
    if (data.email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: data.email
      });
      
      if (authError) {
        console.error("Error updating auth user email:", authError);
        throw authError;
      }
      
      console.log("Auth user email updated successfully");
    }
  } catch (error) {
    console.error(`Error updating user profile with ID ${userId}:`, error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    console.log(`Updating role for user ${userId} to ${role}`);
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating role:", error);
      throw error;
    }
    
    console.log("User role updated successfully");
  } catch (error) {
    console.error(`Error updating role for user with ID ${userId}:`, error);
    throw error;
  }
}

export async function updateUserDepartment(userId: string, departmentId: string | null): Promise<void> {
  try {
    console.log(`Updating department for user ${userId} to ${departmentId || 'null'}`);
    const { error } = await supabase
      .from('profiles')
      .update({ department_id: departmentId })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating department:", error);
      throw error;
    }
    
    console.log("User department updated successfully");
  } catch (error) {
    console.error(`Error updating department for user with ID ${userId}:`, error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    console.log(`Deleting user with ID ${userId}`);
    
    // Delete the user - this should cascade to the profile due to foreign key constraints
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error("Error deleting user:", error);
      
      // If admin delete fails, try using auth.signOut and then delete profile directly
      if (error.message.includes("not_admin") || error.message.includes("supabase_admin")) {
        console.log("Attempting alternative deletion approach...");
        
        // Delete the profile directly
        const { error: profileDeleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (profileDeleteError) {
          console.error("Error deleting profile:", profileDeleteError);
          throw profileDeleteError;
        }
        
        console.log("User profile deleted successfully");
        return;
      }
      
      throw error;
    }
    
    console.log("User deleted successfully");
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}
