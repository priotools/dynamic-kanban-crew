
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

const Dashboard = () => {
  const { currentUser, isLoading, isSupabaseReady } = useAuth();
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  useEffect(() => {
    let redirectTimeout: number;
    
    // If authentication check is complete and user is not logged in, redirect to login
    if (!isLoading) {
      if (!currentUser && !redirectAttempted) {
        console.log("User not authenticated, redirecting to login");
        setRedirectAttempted(true);
        navigate("/login", { replace: true });
      }
    } else if (!redirectAttempted) {
      // Set a timeout to show manual login button if loading takes too long
      redirectTimeout = window.setTimeout(() => {
        setRedirectAttempted(true);
      }, 3000);
    }
    
    return () => {
      if (redirectTimeout) window.clearTimeout(redirectTimeout);
    };
  }, [isLoading, currentUser, navigate, redirectAttempted]);
  
  if (isLoading && !redirectAttempted) {
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
