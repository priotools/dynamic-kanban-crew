
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
  const [logoutTimeout, setLogoutTimeout] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        if (logoutAttempted) return;
        
        setLogoutAttempted(true);
        await logout();
        
        // Force a redirect to login page with a delay to ensure state is updated
        setTimeout(() => {
          // Clear any localStorage auth data as a fallback
          localStorage.removeItem('supabase.auth.token');
          navigate("/login", { replace: true });
        }, 1000);
      } catch (error: any) {
        console.error("Error during logout:", error);
        setError(error.message || "Failed to log out properly");
      }
    };
    
    performLogout();
    
    // Set a timeout to show manual options if logout takes too long
    const timeoutId = setTimeout(() => {
      setLogoutTimeout(true);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [logout, navigate, logoutAttempted]);
  
  const handleManualRedirect = () => {
    // Clear auth data from localStorage as a fallback
    localStorage.removeItem('supabase.auth.token');
    // Force a redirect to login page
    navigate("/login", { replace: true });
  };
  
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Logging out...</span>
      </div>
      
      {logoutTimeout && (
        <div className="mt-8 text-center">
          <p className="text-amber-600 mb-4">Logout is taking longer than expected.</p>
          <Button onClick={handleManualRedirect}>
            Go to Login Page
          </Button>
        </div>
      )}
    </div>
  );
};

export default Logout;
