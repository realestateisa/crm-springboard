import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/profiles";
import UserManagement from "@/components/admin/UserManagement";

const Admin = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FBFE] to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A7E1]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <UserManagement users={users} setUsers={setUsers} />
    </div>
  );
};

export default Admin;