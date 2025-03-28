import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getUserById } from '@/services/user.service';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady] = useState<boolean>(isSupabaseConfigured());
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('Auth provider initialized');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const user = await getUserById(session.user.id);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching user after sign in:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        if (!currentUser && session?.user) {
          try {
            const user = await getUserById(session.user.id);
            setCurrentUser(user);
          } catch (error) {
            console.error('Error fetching user after token refresh:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    });

    // THEN check for existing session
    const fetchCurrentUser = async () => {
      try {
        console.log('Checking for existing session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (data.session?.user) {
          console.log('Found existing session for user:', data.session.user.id);
          try {
            const user = await getUserById(data.session.user.id);
            setCurrentUser(user);
          } catch (userError) {
            console.error('Error fetching user details:', userError);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    fetchCurrentUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        try {
          const user = await getUserById(data.user.id);
          setCurrentUser(user);
          toast.success("Logged in successfully");
        } catch (userError) {
          console.error('Error fetching user after login:', userError);
          toast.error("Logged in but couldn't fetch user profile");
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // First clear the local state
      setCurrentUser(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged out successfully");
      
      // Force clear localStorage as a fallback
      localStorage.removeItem('supabase.auth.token');
      
      // Add a slight delay to ensure all state updates have been processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Failed to log out: " + (error.message || "Unknown error"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading: isLoading && !authInitialized,
        isSupabaseReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
