import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Lead } from "@/integrations/supabase/types/leads";

interface LeadDetailsProps {
  lead: Lead;
}

export function LeadDetails({ lead }: LeadDetailsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{lead.phone || "N/A"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{lead.email || "N/A"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{lead.location}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Additional Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span>{lead.source || "N/A"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Type</span>
                  <span>{lead.lead_type || "N/A"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span>{lead.timezone || "UTC"}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {lead.description && (
              <div>
                <h3 className="font-semibold mb-4">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {lead.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}