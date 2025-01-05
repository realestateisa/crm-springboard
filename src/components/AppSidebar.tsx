import { 
  Inbox, 
  CheckSquare, 
  Users, 
  BarChart2, 
  MessageSquare,
  Settings,
  Shield,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const menuItems = [
  { 
    icon: Inbox, 
    label: "Inbox", 
    href: "/tasks/inbox",
    subItems: [
      { label: "Done", href: "/done", icon: CheckSquare },
      { label: "Leads", href: "/leads", icon: User }
    ]
  },
  { icon: Users, label: "Opportunities", href: "/opportunities" },
  { icon: MessageSquare, label: "Conversations", href: "/conversations" },
  { icon: BarChart2, label: "Reports", href: "/reports" },
];

export function AppSidebar() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("Current user ID:", user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              title: "Error",
              description: "Could not fetch user role",
              variant: "destructive",
            });
            return;
          }

          console.log("Profile data:", profile);
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (error) {
        console.error("Error in checkAdminStatus:", error);
        toast({
          title: "Error",
          description: "Could not verify admin status",
          variant: "destructive",
        });
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <Sidebar className="fixed top-0 left-0 h-full w-64">
      <SidebarContent className="flex flex-col h-full">
        <div className="h-14 p-4 border-b border-sidebar-border flex items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Anthony Cambece</p>
              <p className="text-xs text-muted-foreground truncate">Agent ISA</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                  >
                    <Link to={item.href} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && expandedItem === item.label && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.href} className="flex items-center gap-2">
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t border-sidebar-border p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}