import { Search, Mail, Phone, MessageSquare, CheckSquare, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export default function Index() {
  const { state } = useSidebar();
  
  return (
    <div className="flex flex-col h-full pt-28">
      <header className="border-b border-border h-14 flex items-center px-4 gap-4 bg-background fixed top-0 right-0 left-64 z-10">
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

      <div className="border-b border-border bg-background/95 fixed top-14 right-0 left-64 z-[5]">
        <div className="flex items-center px-4 h-14">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <Separator orientation="vertical" className="mx-4 h-4" />
          <div className="flex items-center gap-4 overflow-x-auto">
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary whitespace-nowrap">
              <Mail className="h-4 w-4 mr-2" />
              Emails
              <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">5</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary whitespace-nowrap">
              <Phone className="h-4 w-4 mr-2" />
              Calls
              <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">2</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary whitespace-nowrap">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
              <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">1</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary whitespace-nowrap">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
              <span className="ml-2 text-xs bg-primary/10 text-primary font-medium rounded-full px-2">2</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted hover:text-primary whitespace-nowrap">
              <Bell className="h-4 w-4 mr-2" />
              Reminders
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 bg-background">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Dashboard content will go here */}
        </div>
      </main>
    </div>
  );
}