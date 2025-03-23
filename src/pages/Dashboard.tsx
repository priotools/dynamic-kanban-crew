
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { KanbanProvider } from "@/context/KanbanContext";
import { ViewProvider } from "@/context/ViewContext";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <KanbanProvider>
      <ViewProvider>
        <DashboardLayout />
      </ViewProvider>
    </KanbanProvider>
  );
};

export default Dashboard;
