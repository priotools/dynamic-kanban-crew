
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserManagement from "@/components/admin/UserManagement";
import DepartmentsManagement from "@/components/admin/DepartmentsManagement";
import UserDepartmentMapping from "@/components/admin/UserDepartmentMapping";

const AdminManagement = () => {
  const { currentUser, isLoading, isSupabaseReady } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  useEffect(() => {
    let redirectTimeout: number;
    
    console.log('AdminManagement - Auth state:', { isLoading, currentUser, role: currentUser?.role });
    
    if (!isLoading) {
      if (!currentUser && !redirectAttempted) {
        console.log("User not authenticated, redirecting to login");
        setRedirectAttempted(true);
        navigate("/login", { replace: true });
      } else if (currentUser && currentUser.role !== "admin" && !redirectAttempted) {
        console.log("User not admin, redirecting to dashboard");
        setRedirectAttempted(true);
        navigate("/dashboard", { replace: true });
      }
    } else if (!redirectAttempted) {
      // Set a timeout to show manual buttons if loading takes too long
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
        <p className="text-lg text-center">Loading admin panel...</p>
      </div>
    );
  }
  
  if (redirectAttempted && (!currentUser || currentUser.role !== "admin")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg text-center mb-4">
          {!currentUser ? "Authentication required" : "Admin access required"} to access this page
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
          >
            Go to Login
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  if (!currentUser || currentUser.role !== "admin") {
    return null; // The useEffect will handle redirect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Management</h1>
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-6 py-8">
        {!isSupabaseReady && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              Supabase is not properly configured. Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
              Some features will be unavailable or limited.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="mapping">User-Department</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="animate-fade-in">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="departments" className="animate-fade-in">
            <DepartmentsManagement />
          </TabsContent>
          
          <TabsContent value="mapping" className="animate-fade-in">
            <UserDepartmentMapping />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminManagement;
