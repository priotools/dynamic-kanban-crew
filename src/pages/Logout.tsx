
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Logout = () => {
  const { logout, isLoading } = useAuth();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        toast.success("You have been logged out");
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("Failed to log out properly");
      }
    };
    
    performLogout();
  }, [logout]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Logging out...</span>
      </div>
    );
  }
  
  return <Navigate to="/login" replace />;
};

export default Logout;
