
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getUserById } from '@/services/user.service';

type AuthContextType = {
  currentUser: User | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady] = useState(isSupabaseConfigured());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch the user profile from our profiles table
          try {
            const user = await getUserById(session.user.id);
            setCurrentUser(user);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // If we can't fetch the profile, at least set basic user info
            setCurrentUser({
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata.avatar_url,
              role: 'employee',
            });
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          try {
            const user = await getUserById(session.user.id);
            setCurrentUser(user);
          } catch (error) {
            console.error("Error fetching user profile on auth change:", error);
            setCurrentUser({
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata.avatar_url,
              role: 'employee',
            });
          }
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        return false;
      }

      if (data.user) {
        // User is already set by the auth listener
        toast.success("Logged in successfully");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    currentUser,
    isLoading,
    isSupabaseReady,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
