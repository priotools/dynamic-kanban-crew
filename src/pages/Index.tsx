
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { currentUser, isLoading, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [attemptedRedirect, setAttemptedRedirect] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState(false);
  
  useEffect(() => {
    // Track whether we've already attempted redirection
    let timeoutId: number;
    
    console.log('Index page - Auth state:', { isLoading, currentUser: !!currentUser });
    
    const attemptRedirect = async () => {
      // If auth is still loading, wait
      if (isLoading) return;
      
      // If user is logged in, go to dashboard
      if (currentUser) {
        console.log('Redirecting to dashboard');
        navigate("/dashboard", { replace: true });
        return;
      }
      
      // If we get here, we're not logged in
      if (!attemptedRedirect) {
        console.log('Not logged in, trying to refresh auth state...');
        
        try {
          // Try to refresh the session in case it's valid but not loaded
          await refreshAuth();
          
          // If we got a user after refresh, navigate to dashboard
          if (currentUser) {
            navigate("/dashboard", { replace: true });
            return;
          }
          
          // No user after refresh, redirect to login
          console.log('No valid session found, redirecting to login');
          setAttemptedRedirect(true);
          navigate("/login", { replace: true });
        } catch (error) {
          console.error('Error during auth refresh:', error);
          setAttemptedRedirect(true);
          navigate("/login", { replace: true });
        }
      }
    };
    
    attemptRedirect();
    
    // Set a timeout to show manual buttons if loading takes too long
    if (!attemptedRedirect && !redirectTimeout) {
      timeoutId = window.setTimeout(() => {
        setRedirectTimeout(true);
      }, 5000);
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [currentUser, isLoading, navigate, attemptedRedirect, redirectTimeout, refreshAuth]);
  
  // Handle manual refresh of authentication
  const handleRefreshAuth = async () => {
    try {
      toast.info("Refreshing authentication state...");
      await refreshAuth();
      
      if (currentUser) {
        toast.success("Authentication refreshed successfully");
        navigate("/dashboard", { replace: true });
      } else {
        toast.info("No active session found");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      toast.error("Failed to refresh authentication. Please try logging in.");
      navigate("/login", { replace: true });
    }
  };
  
  // While still determining auth state and timeout hasn't happened, show loading
  if (isLoading && !redirectTimeout) {
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
      
      {redirectTimeout && isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 max-w-md">
          <p className="text-amber-800 mb-2">
            Taking longer than expected to check your authentication status.
          </p>
          <p className="text-amber-700 text-sm">
            This could be due to network issues or an expired session.
          </p>
        </div>
      )}
      
      <div className="space-y-4 max-w-xs w-full">
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
        
        {(redirectTimeout || isLoading) && (
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleRefreshAuth}
          >
            Refresh Authentication
          </Button>
        )}
      </div>
      
      {isLoading && <p className="text-sm text-muted-foreground text-center mt-4">Still checking authentication status...</p>}
    </div>
  );
};

export default Index;
