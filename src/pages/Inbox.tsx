import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Mail, Phone, MessageSquare, CheckSquare, Bell } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Inbox() {
  return (
    <SidebarProvider>
      <div className="flex-1 flex flex-col min-h-0">
        <AppHeader />
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground/90">Select all</span>
              <span className="text-sm font-medium text-foreground/90">Anthony Cambece</span>
            </div>
            
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/80 rounded-lg cursor-pointer border border-transparent hover:border-border">
                  <Mail className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Value Build Homes</p>
                    <p className="text-sm text-foreground/70 truncate">Follow up</p>
                  </div>
                  <span className="text-sm font-medium text-foreground/70">Today</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
