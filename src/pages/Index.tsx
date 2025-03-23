
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

export default Index;
