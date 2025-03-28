
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
    
    // Clear any previous state
    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST to avoid missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (session?.user) {
            try {
              const user = await getUserById(session.user.id);
              setCurrentUser(user);
            } catch (error) {
              console.error('Error fetching user details:', error);
              setCurrentUser(null);
            } finally {
              setIsLoading(false);
            }
          } else {
            setCurrentUser(null);
            setIsLoading(false);
          }
        });

        // THEN check for existing session
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
            setCurrentUser(null);
          }
        }
        
        setIsLoading(false);
        setAuthInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();
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
      
      // First sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Then clear the local state
      setCurrentUser(null);
      
      toast.success("Logged out successfully");
      
      // Force clear localStorage as a fallback
      localStorage.removeItem('supabase.auth.token');
      
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
