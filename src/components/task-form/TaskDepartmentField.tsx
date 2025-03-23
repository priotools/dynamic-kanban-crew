
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";
import { getDepartments } from "@/services/department.service";

type TaskDepartmentFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskDepartmentField({ form }: TaskDepartmentFieldProps) {
  const [departments, setDepartments] = useState<Array<{id: string, name: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoading(true);
        const deptsData = await getDepartments();
        setDepartments(deptsData.map(d => ({ id: d.id, name: d.name })));
      } catch (error) {
        console.error("Error loading departments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDepartments();
  }, []);
  
  return (
    <FormField
      control={form.control}
      name="departmentId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading..." : "Select department"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map(dept => (
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
