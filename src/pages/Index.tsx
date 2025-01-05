import { Search, Mail, Phone, MessageSquare, CheckSquare, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1 flex flex-col min-w-0 pl-[16rem]">
        <header className="border-b border-border h-14 flex items-center px-4 gap-4 bg-background">
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
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Dashboard content will go here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}