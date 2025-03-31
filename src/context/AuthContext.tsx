
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase, refreshSession } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getUserById } from '@/services/user.service';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isSupabaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseReady] = useState<boolean>(isSupabaseConfigured());
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authStateChanging, setAuthStateChanging] = useState(false);

  // Track last activity to detect stale sessions
  useEffect(() => {
    console.log('Auth provider initialized');
    
    // Clear any previous state
    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST to avoid missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          setAuthStateChanging(true);
          
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(async () => {
            try {
              if (session?.user) {
                try {
                  const user = await getUserById(session.user.id);
                  setCurrentUser(user);
                } catch (error) {
                  console.error('Error fetching user details:', error);
                  setCurrentUser(null);
                }
              } else {
                setCurrentUser(null);
              }
            } catch (error) {
              console.error('Error in auth state change handler:', error);
              setCurrentUser(null);
            } finally {
              setIsLoading(false);
              setAuthStateChanging(false);
            }
          }, 0);
        });

        // THEN check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Try to recover with refresh
          try {
            const refreshedSession = await refreshSession();
            if (refreshedSession?.user) {
              const user = await getUserById(refreshedSession.user.id);
              setCurrentUser(user);
            }
          } catch (refreshError) {
            console.error('Failed to refresh session:', refreshError);
          }
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
    
    // Set up activity tracking
    const trackActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };
    
    // Listen for user activity
    window.addEventListener('click', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('scroll', trackActivity);
    window.addEventListener('mousemove', trackActivity);
    
    // Set initial activity timestamp
    trackActivity();
    
    // Set up a periodic check for session freshness
    const sessionCheckInterval = setInterval(async () => {
      if (!authStateChanging && currentUser) {
        const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
        const now = Date.now();
        const inactiveTime = now - lastActivity;
        
        // If inactive for more than 10 minutes, check session
        if (inactiveTime > 10 * 60 * 1000) {
          console.log('Session might be stale due to inactivity, checking...');
          refreshAuth();
        }
      }
    }, 60 * 1000); // Check every minute
    
    return () => {
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      window.removeEventListener('mousemove', trackActivity);
      clearInterval(sessionCheckInterval);
    };
  }, []);

  const refreshAuth = async () => {
    if (authStateChanging) return;
    
    setIsLoading(true);
    try {
      const refreshedSession = await refreshSession();
      if (refreshedSession?.user) {
        const user = await getUserById(refreshedSession.user.id);
        setCurrentUser(user);
      } else {
        // If no session after refresh, user is logged out
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error refreshing authentication:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

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
          // Set activity timestamp on successful login
          localStorage.setItem('lastActivity', Date.now().toString());
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
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }
      
      // Then clear the local state
      setCurrentUser(null);
      
      // Force clear localStorage auth data
      localStorage.removeItem('supabase.auth.token');
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error("Failed to log out: " + (error.message || "Unknown error"));
      
      // Force clear localStorage auth data even on error
      localStorage.removeItem('supabase.auth.token');
      setCurrentUser(null);
      
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
        refreshAuth,
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
