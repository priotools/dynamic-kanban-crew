
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        if (logoutAttempted) return;
        
        setLogoutAttempted(true);
        await logout();
        
        // Force a redirect to login page with a delay to ensure state is updated
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 500);
      } catch (error: any) {
        console.error("Error during logout:", error);
        setError(error.message || "Failed to log out properly");
      }
    };
    
    performLogout();
  }, [logout, navigate, logoutAttempted]);
  
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
      <span className="ml-2">Logging out...</span>
    </div>
  );
};

export default Logout;
