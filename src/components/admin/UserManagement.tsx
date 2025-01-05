import { useState } from "react";
import { Profile } from "@/integrations/supabase/types/profiles";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import UserTable from "./UserTable";
import UserDialog from "./UserDialog";
import DeleteUserDialog from "./DeleteUserDialog";

interface UserManagementProps {
  users: Profile[];
  setUsers: (users: Profile[]) => void;
}

const UserManagement = ({ users, setUsers }: UserManagementProps) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"edit" | "add">("edit");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const { toast } = useToast();

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDeleteUser = (user: Profile) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userToDelete.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user.",
      });
      return;
    }

    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setDeleteDialogOpen(false);
    setUserToDelete(null);

    toast({
      title: "Success",
      description: "User deleted successfully.",
    });
  };

  const handleSaveUser = async (userData: Partial<Profile>) => {
    if (dialogMode === "edit" && selectedUser) {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...userData,
          email: userData.email,
        })
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
        user.id === selectedUser.id ? { ...user, ...userData } : user
      ));

      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } else {
      try {
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: userData,
        });

        if (error) {
          throw new Error(error.message || 'Failed to create user');
        }

        // Refresh the users list
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .order("date_created", { ascending: false });

        setUsers(profiles || []);

        toast({
          title: "Success",
          description: "User created successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to create user.",
        });
      }
    }
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

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1A1F2C]">User Management</h1>
        <Button 
          className="bg-[#00A7E1] hover:bg-[#0095C8]"
          onClick={handleAddUser}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveUser}
        user={selectedUser || undefined}
        mode={dialogMode}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ''}
      />
    </>
  );
};

export default UserManagement;