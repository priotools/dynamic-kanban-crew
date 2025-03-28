
import { useState, useEffect } from "react";
import { getUsers } from "@/services/user.service";
import { getDepartments } from "@/services/department.service";
import { updateUserDepartment } from "@/services/admin.service";
import { User, Department } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UserDepartmentMapping = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [usersData, departmentsData] = await Promise.all([
          getUsers(),
          getDepartments()
        ]);
        
        setUsers(usersData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDepartmentChange = async (userId: string, departmentId: string | null) => {
    try {
      setIsUpdating(prev => ({ ...prev, [userId]: true }));
      await updateUserDepartment(userId, departmentId);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, departmentId } : user
      ));
      
      toast.success("User department updated successfully");
    } catch (error) {
      console.error("Error updating user department:", error);
      toast.error("Failed to update user department");
    } finally {
      setIsUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getDepartmentName = (departmentId: string | undefined) => {
    if (!departmentId) return "None";
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">User-Department Assignments</h2>
        <p className="text-sm text-muted-foreground">
          Assign users to departments or change their assignments
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Current Department</TableHead>
              <TableHead>Assign Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    {getDepartmentName(user.departmentId)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isUpdating[user.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Select
                          value={user.departmentId || "none"}
                          onValueChange={(value) => 
                            handleDepartmentChange(user.id, value === "none" ? null : value)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserDepartmentMapping;
