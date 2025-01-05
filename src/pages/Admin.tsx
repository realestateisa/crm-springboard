import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Profile } from "@/integrations/supabase/types/profiles";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/");
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
      }
    };

    const fetchUsers = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("date_created", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users.",
        });
        return;
      }

      setUsers(profiles || []);
      setLoading(false);
    };

    checkAdminAccess();
    fetchUsers();
  }, [navigate, toast]);

  const handleEditUser = async (updatedUser: Partial<Profile>) => {
    if (!selectedUser) return;

    const { error } = await supabase
      .from("profiles")
      .update(updatedUser)
      .eq("id", selectedUser.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user.",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, ...updatedUser } : user
    ));

    toast({
      title: "Success",
      description: "User updated successfully.",
    });

    setEditDialogOpen(false);
  };

  const handleToggleStatus = async (user: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !user.is_active })
      .eq("id", user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user status.",
      });
      return;
    }

    setUsers(users.map(u => 
      u.id === user.id ? { ...u, is_active: !u.is_active } : u
    ));

    toast({
      title: "Success",
      description: `User ${user.is_active ? "deactivated" : "activated"} successfully.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FBFE] to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A7E1]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1A1F2C]">User Management</h1>
        <Button className="bg-[#00A7E1] hover:bg-[#0095C8]">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
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
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={user.is_active ? "text-red-600" : "text-green-600"}
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue={selectedUser?.first_name || ""}
                  onChange={(e) => {
                    if (selectedUser) {
                      handleEditUser({ ...selectedUser, first_name: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue={selectedUser?.last_name || ""}
                  onChange={(e) => {
                    if (selectedUser) {
                      handleEditUser({ ...selectedUser, last_name: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={selectedUser?.email || ""}
                onChange={(e) => {
                  if (selectedUser) {
                    handleEditUser({ ...selectedUser, email: e.target.value });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                defaultValue={selectedUser?.role || "isa"}
                onValueChange={(value) => {
                  if (selectedUser) {
                    handleEditUser({ ...selectedUser, role: value as "admin" | "isa" });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="isa">ISA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;