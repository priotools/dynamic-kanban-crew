import { User, Department, Task } from "@/types";
import { CalendarIcon, Tag, User as UserIcon, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface TaskMetadataProps {
  assignee: User | null;
  department: Department | null;
  dueDate?: string;
  tags?: string[];
}

export function TaskMetadata({ assignee, department, dueDate, tags }: TaskMetadataProps) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
      {assignee && (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={assignee?.avatarUrl} />
            <AvatarFallback>{assignee?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{assignee?.name}</span>
        </div>
      )}
      
      {department && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Department</p>
            <p className="text-sm font-medium">{department.name}</p>
          </div>
        </div>
      )}
      
      {dueDate && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
            <CalendarIcon className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Due date</p>
            <p className="text-sm font-medium">{format(new Date(dueDate), "MMMM d, yyyy")}</p>
          </div>
        </div>
      )}
      
      {tags && tags.length > 0 && (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <Tag className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Tags</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
