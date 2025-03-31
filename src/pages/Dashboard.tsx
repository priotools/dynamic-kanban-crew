
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { KanbanProvider } from "@/context/KanbanContext";
import { ViewProvider } from "@/context/ViewContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const { currentUser, isLoading, isSupabaseReady, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [showRedirectOptions, setShowRedirectOptions] = useState(false);
  
  useEffect(() => {
    let redirectTimeout: number;
    let optionsTimeout: number;
    
    const checkAuth = async () => {
      // If authentication check is complete 
      if (!isLoading) {
        if (currentUser) {
          console.log("User authenticated, staying on dashboard");
          return;
        }
        
        if (!redirectAttempted) {
          console.log("User not authenticated, trying to refresh session...");
          setRedirectAttempted(true);
          
          try {
            // Try to refresh the auth state first
            await refreshAuth();
            
            // If we still don't have a user after refresh, redirect to login
            if (!currentUser) {
              console.log("No valid session found, redirecting to login");
              navigate("/login", { replace: true });
            }
          } catch (error) {
            console.error("Error refreshing auth on dashboard:", error);
            navigate("/login", { replace: true });
          }
        }
      } else if (!redirectAttempted) {
        // Set a timeout to show manual login button if loading takes too long
        optionsTimeout = window.setTimeout(() => {
          setShowRedirectOptions(true);
        }, 5000);
      }
    };
    
    checkAuth();
    
    return () => {
      if (redirectTimeout) window.clearTimeout(redirectTimeout);
      if (optionsTimeout) window.clearTimeout(optionsTimeout);
    };
  }, [isLoading, currentUser, navigate, redirectAttempted, refreshAuth]);
  
  const handleManualRefresh = async () => {
    try {
      toast.info("Manually refreshing authentication...");
      await refreshAuth();
      
      if (currentUser) {
        toast.success("Authentication refreshed successfully");
      } else {
        toast.info("No active session found, please log in");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      toast.error("Error refreshing authentication");
      navigate("/login", { replace: true });
    }
  };
  
  if (isLoading && !showRedirectOptions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-center">Loading your dashboard...</p>
        <div className="max-w-md w-full mt-8">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex space-x-4 mb-8">
            <Skeleton className="h-32 w-1/3" />
            <Skeleton className="h-32 w-1/3" />
            <Skeleton className="h-32 w-1/3" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  if (showRedirectOptions && isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-medium mb-2">Still checking authentication</h2>
        <p className="text-center mb-6 max-w-md text-muted-foreground">
          It's taking longer than expected to verify your login status. 
          You can wait or try these options:
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <Button 
            onClick={handleManualRefresh}
            className="w-full"
          >
            Refresh Authentication
          </Button>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  if (redirectAttempted && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg text-center mb-4">Authentication required to access the dashboard</p>
        <Button 
          onClick={() => navigate("/login")}
          size="lg"
        >
          Go to Login
        </Button>
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // The useEffect will handle redirect
  }
  
  return (
    <KanbanProvider>
      <ViewProvider>
        {!isSupabaseReady && (
          <div className="container mx-auto p-4">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                Supabase is not properly configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
                Some features will be unavailable or limited.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <DashboardLayout />
      </ViewProvider>
    </KanbanProvider>
  );
};

export default Dashboard;
