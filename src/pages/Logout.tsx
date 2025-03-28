
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Logout = () => {
  const { logout, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [logoutAttempted, setLogoutAttempted] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        setLogoutAttempted(true);
        await logout();
        toast.success("You have been logged out");
        
        // Force a redirect to login page
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 500);
      } catch (error: any) {
        console.error("Error during logout:", error);
        setError(error.message || "Failed to log out properly");
        toast.error("Failed to log out properly");
      }
    };
    
    performLogout();
  }, [logout, navigate]);
  
  if (isLoading && !logoutAttempted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Logging out...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
          <Button variant="default" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Redirecting to login...</span>
    </div>
  );
};

export default Logout;
