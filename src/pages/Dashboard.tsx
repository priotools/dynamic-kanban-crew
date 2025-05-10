
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
  const [profileError, setProfileError] = useState(false);
  
  useEffect(() => {
    let redirectTimeout: number;
    let optionsTimeout: number;
    
    const checkAuth = async () => {
      // If authentication check is complete 
      if (!isLoading) {
        // Even if currentUser is null but we have a valid session token, allow access to dashboard
        // This handles the case where authentication succeeded but profile fetching failed
        const hasSession = localStorage.getItem('supabase.auth.token') !== null;
        
        if (currentUser) {
          console.log("User authenticated, staying on dashboard");
          return;
        } else if (hasSession) {
          // We have a token but no user profile - show UI for this case
          console.log("Valid auth token but no profile data");
          setProfileError(true);
          return;
        }
        
        if (!redirectAttempted) {
          console.log("User not authenticated, trying to refresh session...");
          setRedirectAttempted(true);
          
          try {
            // Try to refresh the auth state first
            await refreshAuth();
            
            // Check again for session
            const hasSessionAfterRefresh = localStorage.getItem('supabase.auth.token') !== null;
            
            // If still no user after refresh and no valid session, redirect to login
            if (!currentUser && !hasSessionAfterRefresh) {
              console.log("No valid session found, redirecting to login");
              navigate("/login", { replace: true });
            } else if (!currentUser && hasSessionAfterRefresh) {
              // We have a session but no profile
              setProfileError(true);
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
      
      // Check for session even if currentUser is still null
      const hasSession = localStorage.getItem('supabase.auth.token') !== null;
      
      if (currentUser) {
        toast.success("Authentication refreshed successfully");
        setProfileError(false);
      } else if (hasSession) {
        toast.info("Valid session found but profile data could not be loaded");
        setProfileError(true);
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
  
  if (profileError) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Profile Data Unavailable</AlertTitle>
            <AlertDescription>
              You're authenticated successfully, but we couldn't fetch your profile data from the database. 
              This could be due to a temporary issue or a database permissions problem.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button 
              onClick={handleManualRefresh} 
              variant="default"
              className="md:w-auto"
            >
              Retry Loading Profile
            </Button>
            <Button 
              onClick={() => navigate("/login")} 
              variant="outline"
              className="md:w-auto"
            >
              Back to Login
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm mb-4">
            You can still use some features of the dashboard, but personalized content may be limited.
          </p>
          
          <KanbanProvider>
            <ViewProvider>
              <DashboardLayout />
            </ViewProvider>
          </KanbanProvider>
        </div>
      </div>
    );
  }
  
  if (redirectAttempted && !currentUser && !localStorage.getItem('supabase.auth.token')) {
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
  
  // If we get here, either we have a user or a valid session token, proceed to dashboard
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
        
        {profileError && (
          <div className="container mx-auto px-4 py-4">
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limited Access</AlertTitle>
              <AlertDescription>
                You're logged in, but we couldn't load your profile data. Some personalized features may be unavailable.
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
