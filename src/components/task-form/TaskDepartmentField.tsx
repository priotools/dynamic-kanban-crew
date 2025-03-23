
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDepartments } from "@/data/mockData";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";

type TaskDepartmentFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskDepartmentField({ form }: TaskDepartmentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="departmentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {mockDepartments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
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
