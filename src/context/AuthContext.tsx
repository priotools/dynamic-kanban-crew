
import { User } from "@/types";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getUserById } from "@/services/user.service";
import { toast } from "sonner";

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isSupabaseReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseConfigured = isSupabaseConfigured();
    setIsSupabaseReady(supabaseConfigured);
    
    if (!supabaseConfigured) {
      setIsLoading(false);
      setError("Supabase is not configured properly. Please set the required environment variables.");
      toast.error("Supabase configuration missing. Check console for details.");
      console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
      return;
    }

    // Check for current session
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const user = await getUserById(session.user.id);
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (err) {
        console.error("Error checking auth session:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (supabaseConfigured) {
      checkSession();
      
      // Subscribe to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              const user = await getUserById(session.user.id);
              if (user) {
                setCurrentUser(user);
              }
            } catch (error) {
              console.error("Error getting user data:", error);
            }
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseReady) {
      setError("Cannot login: Supabase is not configured properly");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      if (data.user) {
        const user = await getUserById(data.user.id);
        if (user) {
          setCurrentUser(user);
          return true;
        }
      }
      
      setError("Unable to retrieve user profile");
      return false;
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!isSupabaseReady) return;
    
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isLoading, 
      error, 
      isSupabaseReady 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
