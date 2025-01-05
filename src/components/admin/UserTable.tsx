import { Profile } from "@/integrations/supabase/types/profiles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UserTableProps {
  users: Profile[];
  onEdit: (user: Profile) => void;
  onToggleStatus: (user: Profile) => void;
  onDelete: (user: Profile) => void;
}

const UserTable = ({ 
  users = [], 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: UserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.first_name} {user.last_name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  user.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(user)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={user.is_active ? "text-red-600" : "text-green-600"}
                onClick={() => onToggleStatus(user)}
              >
                {user.is_active ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => onDelete(user)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;