import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/profiles";
import UserTable from "@/components/admin/UserTable";
import UserDialog from "@/components/admin/UserDialog";

const Admin = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"edit" | "add">("edit");
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

  const handleSaveUser = async (userData: Partial<Profile>) => {
    // Ensure email is provided
    if (!userData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email is required.",
      });
      return;
    }

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
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(userData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create user');
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
        />
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveUser}
        user={selectedUser || undefined}
        mode={dialogMode}
      />
    </div>
  );
};

export default Admin;
