
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useView } from "@/context/ViewContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from "./KanbanBoard";
import DepartmentView from "./DepartmentView";
import UserView from "./UserView";
import ProfileView from "./ProfileView";
import { Layers, Users, User2, PlusCircle, LayoutGrid, LogOut, ShieldCheck, UserCog, ListTodo } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TaskFormDialog from "./TaskFormDialog";
import { useKanban } from "@/context/KanbanContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import PersonalTaskList from "./PersonalTaskList";

export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const { viewMode, setViewMode } = useView();
  const { addTask } = useKanban();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showPersonalTasks, setShowPersonalTasks] = useState(false);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const handleAddTask = (taskData: any) => {
    if (!currentUser) return;
    addTask({
      ...taskData,
      createdBy: currentUser.id,
    });
    setIsTaskDialogOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const renderMainContent = () => {
    if (showPersonalTasks) {
      return <div className="p-6 animate-fade-in"><PersonalTaskList /></div>;
    }

    switch (viewMode) {
      case "profile":
        return <ProfileView />;
      case "kanban":
        return <KanbanBoard />;
      case "departments":
        return <DepartmentView />;
      case "users":
        return <UserView />;
      default:
        return <KanbanBoard />;
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <aside 
        className={cn(
          "bg-white border-r w-64 flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 z-30 lg:relative",
          sidebarOpen ? "left-0" : "-left-64 lg:left-0 lg:w-20"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between h-16">
          {sidebarOpen ? (
            <h1 className="font-semibold text-lg">Kanban Board</h1>
          ) : (
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Layers className="h-5 w-5" />
            </div>
          )}
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          )}
        </div>
        
        <div className="flex-1 py-6 flex flex-col justify-between">
          <div>
            <div className={cn("px-3 mb-6", !sidebarOpen && "flex justify-center")}>
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className={cn("w-full gap-2", !sidebarOpen && "w-12 h-12 rounded-full p-0")}>
                    <PlusCircle className={cn("h-4 w-4", !sidebarOpen && "h-5 w-5")} />
                    {sidebarOpen && <span>New Task</span>}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <TaskFormDialog onSubmit={handleAddTask} />
                </DialogContent>
              </Dialog>
            </div>
            
            <nav className="space-y-1 px-3">
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                className={cn("w-full justify-start mb-1", !sidebarOpen && "justify-center px-0")}
                onClick={() => {
                  setViewMode("kanban");
                  setShowPersonalTasks(false);
                }}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                {sidebarOpen && <span>Kanban Board</span>}
              </Button>
              
              <Button
                variant={showPersonalTasks ? "default" : "ghost"}
                className={cn("w-full justify-start mb-1", !sidebarOpen && "justify-center px-0")}
                onClick={() => {
                  setShowPersonalTasks(true);
                }}
              >
                <ListTodo className="h-4 w-4 mr-2" />
                {sidebarOpen && <span>My Tasks</span>}
              </Button>
              
              <Button
                variant={viewMode === "departments" ? "default" : "ghost"}
                className={cn("w-full justify-start mb-1", !sidebarOpen && "justify-center px-0")}
                onClick={() => {
                  setViewMode("departments");
                  setShowPersonalTasks(false);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                {sidebarOpen && <span>Departments</span>}
              </Button>
              
              <Button
                variant={viewMode === "users" ? "default" : "ghost"}
                className={cn("w-full justify-start mb-1", !sidebarOpen && "justify-center px-0")}
                onClick={() => {
                  setViewMode("users");
                  setShowPersonalTasks(false);
                }}
              >
                <User2 className="h-4 w-4 mr-2" />
                {sidebarOpen && <span>Team Members</span>}
              </Button>
              
              <Button
                variant={viewMode === "profile" ? "default" : "ghost"}
                className={cn("w-full justify-start", !sidebarOpen && "justify-center px-0")}
                onClick={() => {
                  setViewMode("profile");
                  setShowPersonalTasks(false);
                }}
              >
                <UserCog className="h-4 w-4 mr-2" />
                {sidebarOpen && <span>My Profile</span>}
              </Button>

              {currentUser && currentUser.role === "admin" && (
                <Link to="/admin" className="w-full">
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start mt-2", !sidebarOpen && "justify-center px-0")}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    {sidebarOpen && <span>Admin</span>}
                  </Button>
                </Link>
              )}
            </nav>
          </div>
          
          <div className={cn("px-3", !sidebarOpen && "flex justify-center")}>
            <Link to="/logout" className="w-full">
              <Button
                variant="ghost"
                className={cn("w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50", 
                  !sidebarOpen && "justify-center px-0"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {sidebarOpen && <span>Logout</span>}
              </Button>
            </Link>
          </div>
        </div>
        
        {currentUser && (
          <div className={cn(
            "p-4 border-t flex items-center", 
            !sidebarOpen && "justify-center"
          )}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>
                {currentUser.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            )}
          </div>
        )}
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b bg-white flex items-center px-4 lg:px-6 sticky top-0 z-20">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          )}
          
          <div className="flex-1 flex items-center">
            <h1 className="text-lg font-medium">
              {showPersonalTasks ? "My Tasks" : (
                <>
                  {viewMode === "profile" && "My Profile"}
                  {viewMode === "kanban" && "Kanban Board"}
                  {viewMode === "departments" && "Departments"}
                  {viewMode === "users" && "Team Members"}
                </>
              )}
            </h1>
          </div>
          
          <div className="md:hidden">
            <Tabs
              value={viewMode}
              onValueChange={(value: any) => {
                setViewMode(value as ViewMode);
                setShowPersonalTasks(false);
              }}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="kanban">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="tasks" onClick={() => setShowPersonalTasks(true)}>
                  <ListTodo className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="departments">
                  <Users className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="users">
                  <User2 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <UserCog className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}
