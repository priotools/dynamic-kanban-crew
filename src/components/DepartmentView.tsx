
import { useKanban } from "@/context/KanbanContext";
import { useView } from "@/context/ViewContext";
import { getDepartmentById, getUsersInDepartment, mockDepartments } from "@/data/mockData";
import { Task, User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import TaskList from "./TaskList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function DepartmentView() {
  const { tasks, isLoading } = useKanban();
  const { selectedDepartmentId, setSelectedDepartmentId } = useView();
  const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
  const [departmentTasks, setDepartmentTasks] = useState<Task[]>([]);
  
  // Set initial department if none is selected
  useEffect(() => {
    if (!selectedDepartmentId && mockDepartments.length > 0) {
      setSelectedDepartmentId(mockDepartments[0].id);
    }
  }, [selectedDepartmentId, setSelectedDepartmentId]);
  
  // Update users and tasks when department changes
  useEffect(() => {
    if (selectedDepartmentId) {
      setDepartmentUsers(getUsersInDepartment(selectedDepartmentId));
      setDepartmentTasks(tasks.filter(task => task.departmentId === selectedDepartmentId));
    }
  }, [selectedDepartmentId, tasks]);
  
  if (isLoading) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="flex mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full mr-2" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  const currentDepartment = selectedDepartmentId
    ? getDepartmentById(selectedDepartmentId)
    : null;
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex">
        <ScrollArea className="w-full">
          <div className="flex pb-2">
            {mockDepartments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartmentId(dept.id)}
                className={cn(
                  "px-4 py-2 rounded-full mr-2 text-sm font-medium whitespace-nowrap transition-colors",
                  selectedDepartmentId === dept.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {currentDepartment && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold">{currentDepartment.name} Department</h2>
              <p className="text-muted-foreground">
                {departmentTasks.length} tasks · {departmentUsers.length} team members
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="members">Team Members</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="animate-fade-in">
              <TaskList tasks={departmentTasks} />
            </TabsContent>
            
            <TabsContent value="members" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-4 rounded-lg border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">{user.role === "department_head" ? "Department Head" : "Team Member"}</p>
                    </div>
                  </div>
                ))}
                
                {departmentUsers.length === 0 && (
                  <div className="col-span-full text-center p-12 text-muted-foreground">
                    No team members in this department
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
