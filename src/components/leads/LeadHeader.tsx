import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface LeadHeaderProps {
  lead: Tables<"leads">;
}

export function LeadHeader({ lead }: LeadHeaderProps) {
  const handleCallClick = () => {
    window.dispatchEvent(new CustomEvent('initiate-call'));
  };

  return (
    <div className="border-b border-border/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {lead.first_name} {lead.last_name}
          </h1>
          <p className="text-sm text-muted-foreground">{lead.client}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm" onClick={handleCallClick}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <LeadStatusBadge status={lead.status} />
        </div>
      </div>
    </div>
  );
}