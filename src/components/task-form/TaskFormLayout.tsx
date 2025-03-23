
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { taskFormSchema } from "./schema";

type TaskFormLayoutProps = {
  form: UseFormReturn<z.infer<typeof taskFormSchema>>;
  onSubmit: (values: z.infer<typeof taskFormSchema>) => void;
  isEditing: boolean;
  children: ReactNode;
};

export function TaskFormLayout({ 
  form, 
  onSubmit, 
  isEditing, 
  children 
}: TaskFormLayoutProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit task" : "Create a new task"}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-4">
          {children}
          
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
