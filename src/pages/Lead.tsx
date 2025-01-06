import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CallBar } from "@/components/calls/CallBar";
import { useState } from "react";
import { toast } from "sonner";

const Lead = () => {
  const { id } = useParams();
  const [callStatus, setCallStatus] = useState<'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleCall = async () => {
    if (!lead?.phone) {
      toast.error("No phone number available for this lead");
      return;
    }

    try {
      setCallStatus('queued');
      // TODO: Implement actual call logic with Twilio
      // This is just a simulation for now
      setTimeout(() => setCallStatus('ringing'), 1000);
      setTimeout(() => setCallStatus('in-progress'), 3000);
    } catch (error) {
      console.error('Call error:', error);
      setCallStatus('failed');
      toast.error("Failed to initiate call");
    }
  };

  const handleHangup = () => {
    // TODO: Implement actual hangup logic
    setCallStatus('completed');
  };

  const handleMute = () => {
    // TODO: Implement actual mute logic
    setIsMuted(!isMuted);
  };

  const handleTransfer = () => {
    // TODO: Implement transfer logic
    toast.info("Transfer functionality coming soon");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="container max-w-7xl mx-auto p-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="container max-w-7xl mx-auto p-6">
          <Card>
            <CardContent>
              <p className="text-muted-foreground">Lead not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      {callStatus && (
        <CallBar
          status={callStatus}
          phoneNumber={lead.phone || ''}
          onHangup={handleHangup}
          onMute={handleMute}
          onTransfer={handleTransfer}
          isMuted={isMuted}
        />
      )}
      
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCall}
                disabled={!lead.phone || callStatus !== null}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </div>
    </div>
  );
};

export default Lead;