import { useState, useEffect } from "react";
import UserManagement from "@/components/admin/UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/profiles";

export default function Admin() {
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("date_created", { ascending: false });
      
      setUsers(profiles || []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1 flex flex-col min-w-0 md:ml-[16rem]">
        <div className="container mx-auto p-6">
          <UserManagement users={users} setUsers={setUsers} />
        </div>
      </main>
    </div>
  );
}