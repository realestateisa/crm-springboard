import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MessageSquare, CheckSquare, Bell } from "lucide-react";

export default function Inbox() {
  return (
    <div className="flex-1 flex flex-col min-h-0 md:ml-[16rem]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Select all</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm font-medium text-muted-foreground">Anthony Cambece</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Mark as Read
            </Button>
          </div>
          
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="group flex items-center gap-4 p-4 hover:bg-muted/50 rounded-lg cursor-pointer border border-border/50 hover:border-border transition-all duration-200 animate-fade-in"
              >
                <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-200">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">Value Build Homes</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">New</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">Follow up regarding the property listing and next steps</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Today</span>
                  <span className="text-xs text-muted-foreground">10:30 AM</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}