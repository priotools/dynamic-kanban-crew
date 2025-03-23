
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";

type TaskDescriptionFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskDescriptionField({ form }: TaskDescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea placeholder="Describe the task..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
