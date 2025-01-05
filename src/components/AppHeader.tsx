import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppHeader() {
  return (
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
  );
}