
import { cn } from "@/lib/utils";

interface TaskDescriptionProps {
  description?: string;
}

export function TaskDescription({ description }: TaskDescriptionProps) {
  if (!description) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Description</h4>
      <p className={cn("text-sm text-gray-600 whitespace-pre-wrap", 
        description.length > 300 && "max-h-48 overflow-y-auto pr-2")}>
        {description}
      </p>
    </div>
  );
}
