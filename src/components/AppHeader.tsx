import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppHeader() {
  return (
    <header className="border-b border-border/50 h-14 flex items-center px-6 gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:ml-[16rem] w-[calc(100%-16rem)] transition-colors duration-200">
      <div className="flex-1 flex items-center gap-4 max-w-5xl mx-auto w-full">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-8 w-full bg-muted/50 border-muted focus:bg-background transition-colors duration-200"
          />
        </div>
        <Avatar className="h-8 w-8 ring-2 ring-border/50 transition-shadow hover:ring-border">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}