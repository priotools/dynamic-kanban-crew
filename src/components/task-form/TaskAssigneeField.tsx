
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockUsers } from "@/data/mockData";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";

type TaskAssigneeFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskAssigneeField({ form }: TaskAssigneeFieldProps) {
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
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {mockUsers
                .filter(user => user.role !== "admin")
                .map(user => (
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
