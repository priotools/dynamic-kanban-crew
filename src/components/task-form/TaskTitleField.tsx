
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";

type TaskTitleFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskTitleField({ form }: TaskTitleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Task title..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
