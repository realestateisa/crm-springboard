import { 
  Inbox, 
  CheckSquare, 
  Users, 
  BarChart2, 
  MessageSquare,
  Settings,
  ChevronDown
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
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { 
    icon: Inbox, 
    label: "Inbox", 
    href: "/tasks/inbox",
    subItems: [
      { label: "Done", href: "/done", icon: CheckSquare }
    ]
  },
  { icon: Users, label: "Opportunities", href: "/opportunities" },
  { icon: MessageSquare, label: "Conversations", href: "/conversations" },
  { icon: BarChart2, label: "Reports", href: "/reports" },
];

export function AppSidebar() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Anthony Cambece</p>
              <p className="text-xs text-muted-foreground truncate">Agent ISA</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                  >
                    <a href={item.href} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.subItems && expandedItem === item.label && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.href} className="flex items-center gap-2">
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.label}</span>
                            </a>
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
                <a href="/settings" className="flex items-center gap-3 px-3 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}