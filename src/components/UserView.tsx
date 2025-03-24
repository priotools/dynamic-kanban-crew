import { useKanban } from "@/context/KanbanContext";
import { useView } from "@/context/ViewContext";
import { Task, User } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import TaskList from "./TaskList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getUsers, getUserById } from "@/services/user.service";

export default function UserView() {
  const { tasks, isLoading: tasksLoading } = useKanban();
  const { selectedUserId, setSelectedUserId } = useView();
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getUsers();
        const nonAdminUsers = usersData.filter(user => user.role !== "admin");
        setUsers(nonAdminUsers);
        
        if (!selectedUserId && nonAdminUsers.length > 0) {
          setSelectedUserId(nonAdminUsers[0].id);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [selectedUserId, setSelectedUserId]);
  
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (selectedUserId) {
        try {
          const user = await getUserById(selectedUserId);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error loading current user:", error);
        }
      }
    };
    
    loadCurrentUser();
  }, [selectedUserId]);
  
  useEffect(() => {
    if (selectedUserId) {
      setUserTasks(tasks.filter(task => task.assigneeId === selectedUserId));
    }
  }, [selectedUserId, tasks]);
  
  if (isLoading || tasksLoading) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="flex mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full mr-2" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex">
        <ScrollArea className="w-full">
          <div className="flex pb-2">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={cn(
                  "rounded-full mr-3 transition-transform hover:scale-105",
                  selectedUserId === user.id
                    ? "ring-2 ring-primary"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {currentUser && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-8">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-xl">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                  {currentUser.role === "manager" ? "Department Head" : "Team Member"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
          
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tasks">Assigned Tasks</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="animate-fade-in">
              <TaskList tasks={userTasks} />
            </TabsContent>
            
            <TabsContent value="stats" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-blue-800 font-medium mb-1">Assigned Tasks</h3>
                  <p className="text-2xl font-semibold">{userTasks.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-green-800 font-medium mb-1">Completed</h3>
                  <p className="text-2xl font-semibold">
                    {userTasks.filter(task => task.status === "done").length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h3 className="text-yellow-800 font-medium mb-1">In Progress</h3>
                  <p className="text-2xl font-semibold">
                    {userTasks.filter(task => task.status === "in_progress").length}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
