
import { format } from "date-fns";
import { User } from "@/types";

interface TaskTimestampsProps {
  createdAt: string;
  updatedAt?: string;
  creator: User | null;
}

export function TaskTimestamps({ createdAt, updatedAt, creator }: TaskTimestampsProps) {
  return (
    <div className="border-t pt-4 text-xs text-gray-500">
      <p>Created {format(new Date(createdAt), "MMMM d, yyyy")} {creator ? `by ${creator.name}` : ''}</p>
      {updatedAt && (
        <p>Updated {format(new Date(updatedAt), "MMMM d, yyyy")}</p>
      )}
    </div>
  );
}
