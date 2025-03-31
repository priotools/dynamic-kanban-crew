import { useState } from "react";
import {
  LayoutDashboard,
  LayoutGrid,
  CheckSquare,
  Building2,
  Users,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useView } from "@/context/ViewContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, setIsOpen } = useSidebar();
  const navigate = useNavigate();
  const { currentUser, isLoading, signOut } = useAuth();
  const { viewMode, setViewMode } = useView();

  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Navigation menu items
  const navItems = [
    {
      icon: <LayoutGrid className="h-5 w-5" />,
      label: "Kanban Board",
      onClick: () => {
        setViewMode('kanban');
        navigate("/dashboard");
      },
      active: viewMode === 'kanban',
    },
    {
      icon: <CheckSquare className="h-5 w-5" />,
      label: "My Tasks",
      onClick: () => {
        navigate("/dashboard/tasks");
      },
      active: location.pathname === "/dashboard/tasks",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "Departments",
      onClick: () => {
        setViewMode('departments');
        navigate("/dashboard");
      },
      active: viewMode === 'departments',
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Team Members",
      onClick: () => {
        setViewMode('users');
        navigate("/dashboard");
      },
      active: viewMode === 'users',
    },
    {
      icon: <UserCircle className="h-5 w-5" />,
      label: "My Profile",
      onClick: () => {
        setViewMode('profile');
        navigate("/dashboard");
      },
      active: viewMode === 'profile',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Sidebar */}
      <div
        className={`flex flex-col ${
          isOpen ? "w-64" : "w-16"
        } bg-white shadow-md transition-width duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center">
            <LayoutDashboard className="h-6 w-6 mr-2" />
            <span
              className={`text-xl font-semibold transition-opacity duration-300 ease-in-out ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Taskify
            </span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="p-0 hover:bg-gray-100"
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1 px-3">
          <nav className="flex flex-col py-6 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`justify-start ${
                  item.active ? "bg-gray-100" : ""
                }`}
                onClick={item.onClick}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span
                    className={`ml-3 transition-opacity duration-300 ease-in-out ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Button>
            ))}
            {currentUser?.role === "admin" && (
              <>
                <Separator />
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/admin")}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5" />
                    <span
                      className={`ml-3 transition-opacity duration-300 ease-in-out ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Admin Panel
                    </span>
                  </div>
                </Button>
              </>
            )}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-start w-full">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span
                  className={`text-sm font-medium transition-opacity duration-300 ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {currentUser?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {children}
        <Outlet />
      </div>
    </div>
  );
}
