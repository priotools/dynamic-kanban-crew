
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";
import { getUsers } from "@/services/user.service";

type TaskAssigneeFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskAssigneeField({ form }: TaskAssigneeFieldProps) {
  const [users, setUsers] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await getUsers();
        // Filter out admin users
        setUsers(usersData
          .filter(user => user.role !== "admin")
          .map(u => ({ id: u.id, name: u.name }))
        );
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  return (
    <FormField
      control={form.control}
      name="assigneeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assignee</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || "unassigned"}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading..." : "Unassigned"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
