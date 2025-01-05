import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, MessageSquare, CheckSquare, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Inbox() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-border h-14 flex items-center px-4 gap-4 bg-background">
            <SidebarTrigger />
            <div className="flex-1 flex items-center gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/70" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8 w-full"
                />
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="border-b border-border bg-background/95">
              <div className="flex items-center px-4 h-14">
                <h1 className="text-lg font-semibold text-foreground">Inbox</h1>
                <Separator orientation="vertical" className="mx-4 h-4" />
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary">
                    <Mail className="h-4 w-4 mr-2" />
                    Emails
                    <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">5</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary">
                    <Phone className="h-4 w-4 mr-2" />
                    Calls
                    <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">2</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                    <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">1</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tasks
                    <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">2</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary">
                    <Bell className="h-4 w-4 mr-2" />
                    Reminders
                  </Button>
                </div>
              </div>
            </div>

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
        </main>
      </div>
    </SidebarProvider>
  );
}
