
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";

type TaskTagsFieldProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
};

export function TaskTagsField({ form }: TaskTagsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <Input placeholder="Comma-separated tags..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
