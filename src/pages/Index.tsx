
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [attemptedRedirect, setAttemptedRedirect] = useState(false);
  
  useEffect(() => {
    // Track whether we've already attempted redirection
    let redirectTimeout: number;
    
    console.log('Index page - Auth state:', { isLoading, currentUser: !!currentUser });
    
    // Only navigate when auth state is determined (not loading)
    if (!isLoading) {
      if (currentUser) {
        console.log('Redirecting to dashboard');
        navigate("/dashboard", { replace: true });
      } else if (!attemptedRedirect) {
        console.log('Redirecting to login');
        setAttemptedRedirect(true);
        navigate("/login", { replace: true });
      }
    } else if (!attemptedRedirect) {
      // Set a timeout to show manual buttons if loading takes too long
      redirectTimeout = window.setTimeout(() => {
        setAttemptedRedirect(true);
      }, 2000);
    }
    
    return () => {
      if (redirectTimeout) window.clearTimeout(redirectTimeout);
    };
  }, [currentUser, isLoading, navigate, attemptedRedirect]);
  
  // While still determining auth state, show loading
  if (isLoading && !attemptedRedirect) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-center">Initializing application...</p>
        <div className="max-w-md w-full mt-8">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  // If loading takes too long or we couldn't redirect automatically, provide manual options
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Welcome to Kanban Board</h1>
      <div className="space-y-4">
        <Button 
          className="w-full" 
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
        {isLoading && <p className="text-sm text-muted-foreground text-center">Still loading, please wait...</p>}
      </div>
    </div>
  );
};

export default Index;
