
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/types";
import { getTasks } from "@/services/task.service";
import TaskList from "@/components/TaskList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PersonalTaskList() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const allTasks = await getTasks();
        
        // Filter tasks assigned to the current user
        const userTasks = allTasks.filter(task => 
          task.assigneeId === currentUser.id
        );
        
        setTasks(userTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Failed to load your tasks");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>
          Tasks assigned to you across all departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : tasks.length > 0 ? (
          <TaskList tasks={tasks} />
        ) : (
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">No tasks assigned</h3>
            <p className="text-muted-foreground">
              You don't have any tasks assigned to you at the moment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
