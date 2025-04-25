
import { Task } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import TaskFormDialog from "./TaskFormDialog";
import { useState, useEffect } from "react";
import TaskHeader from "./task-detail/TaskHeader";
import TaskDescription from "./task-detail/TaskDescription";
import TaskMetadata from "./task-detail/TaskMetadata";
import TaskTimestamps from "./task-detail/TaskTimestamps";
import TaskActions from "./task-detail/TaskActions";
import { getUserById } from "@/services/user.service";
import { getDepartmentById } from "@/services/department.service";

type TaskDetailDialogProps = {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskDetailDialog({ 
  task, 
  onUpdate, 
  onDelete 
}: TaskDetailDialogProps) {
  const { openDialog, DialogComponent } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);
  const [assignee, setAssignee] = useState<any | null>(null);
  const [creator, setCreator] = useState<any | null>(null);
  const [department, setDepartment] = useState<any | null>(null);
  
  useEffect(() => {
    const loadTaskData = async () => {
      try {
        if (task.assigneeId) {
          const assigneeData = await getUserById(task.assigneeId);
          setAssignee(assigneeData);
        }
        
        const creatorData = await getUserById(task.createdBy);
        setCreator(creatorData);
        
        const departmentData = await getDepartmentById(task.departmentId);
        setDepartment(departmentData);
      } catch (error) {
        console.error("Error loading task data:", error);
      }
    };
    
    loadTaskData();
  }, [task]);
  
  const handleEdit = () => {
    openDialog(
      <TaskFormDialog 
        initialValues={task}
        onSubmit={(updatedData) => {
          onUpdate({
            ...task,
            ...updatedData,
          });
        }}
      />
    );
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(task.id);
  };

  return (
    <>
      <TaskHeader task={task} />
      
      <div className="my-6 space-y-5">
        <TaskDescription description={task.description} />
        
        <TaskMetadata 
          assignee={assignee}
          department={department}
          dueDate={task.dueDate}
          tags={task.tags}
        />
        
        <TaskTimestamps 
          createdAt={task.createdAt}
          updatedAt={task.updatedAt}
          creator={creator}
        />
      </div>
      
      <TaskActions 
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
      
      <DialogComponent />
    </>
  );
}
