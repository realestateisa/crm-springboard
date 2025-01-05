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
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const menuItems = [
  { 
    icon: Inbox, 
    label: "Inbox", 
    href: "/tasks/inbox",
    subItems: [
      { label: "Done", href: "/done", icon: CheckSquare }
    ]
  },
  { icon: User, label: "Leads", href: "/leads" },
  { icon: Users, label: "Opportunities", href: "/opportunities" },
  { icon: MessageSquare, label: "Conversations", href: "/conversations" },
  { icon: BarChart2, label: "Reports", href: "/reports" },
];

export function AppSidebar() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const location = useLocation();

  // Update expanded item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingMenuItem = menuItems.find(item => 
      currentPath.startsWith(item.href)
    );
    
    if (matchingMenuItem) {
      setExpandedItem(matchingMenuItem.label);
    } else {
      setExpandedItem(null);
    }
  }, [location.pathname]);

  return (
    <Sidebar className="fixed top-0 left-0 h-full w-64 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60 border-r border-sidebar-border/50">
      <SidebarContent className="flex flex-col h-full">
        <div className="h-14 p-4 border-b border-sidebar-border/50 flex items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-border/50 transition-shadow hover:ring-sidebar-border">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-foreground">Anthony Cambece</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">Agent ISA</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors duration-200"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.href} 
                      className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors duration-200"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && expandedItem === item.label && location.pathname.startsWith('/tasks/inbox') && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton asChild>
                            <Link 
                              to={subItem.href} 
                              className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors duration-200"
                            >
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

        <div className="mt-auto border-t border-sidebar-border/50 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors duration-200"
                >
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