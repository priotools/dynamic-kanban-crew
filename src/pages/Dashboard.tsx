
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { KanbanProvider } from "@/context/KanbanContext";
import { ViewProvider } from "@/context/ViewContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { currentUser, isLoading, isSupabaseReady } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    // If authentication check is complete and user is not logged in, redirect to login
    if (!isLoading && !currentUser) {
      setRedirecting(true);
      navigate("/login", { replace: true });
    }
  }, [isLoading, currentUser, navigate]);
  
  if (isLoading) {
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
  
  if (!currentUser && !redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg text-center">Authentication required. Redirecting to login...</p>
        <button 
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Go to Login
        </button>
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
