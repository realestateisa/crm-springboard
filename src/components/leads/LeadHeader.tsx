import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge';
import { CallManager } from '@/components/calls/CallManager';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface LeadHeaderProps {
  lead: Tables<"leads">;
}

export function LeadHeader({ lead }: LeadHeaderProps) {
  return (
    <>
      <CallManager phoneNumber={lead.phone} />
      <div className="border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}