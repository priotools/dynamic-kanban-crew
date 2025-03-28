
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [attemptedNavigation, setAttemptedNavigation] = useState(false);
  
  useEffect(() => {
    console.log('Index page - Auth state:', { isLoading, currentUser: !!currentUser });
    
    // Only attempt navigation when auth state is known (not loading)
    if (!isLoading) {
      setAttemptedNavigation(true);
      if (currentUser) {
        console.log('Redirecting to dashboard');
        navigate("/dashboard", { replace: true });
      } else {
        console.log('Redirecting to login');
        navigate("/login", { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);
  
  // If still loading after 3 seconds, show a retry button
  useEffect(() => {
    let timeout: number;
    if (isLoading) {
      timeout = window.setTimeout(() => {
        setAttemptedNavigation(true);
      }, 2000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);
  
  if (isLoading && !attemptedNavigation) {
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
  
  // If loading takes too long, provide manual navigation options
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Welcome to Kanban Board</h1>
      <div className="space-y-4">
        <Button 
          className="w-full" 
          onClick={() => navigate("/dashboard")}
          disabled={isLoading}
        >
          Go to Dashboard
        </Button>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={() => navigate("/login")}
          disabled={isLoading}
        >
          Login
        </Button>
        {isLoading && <p className="text-sm text-muted-foreground text-center">Still loading, please wait...</p>}
      </div>
    </div>
  );
};

export default Index;
