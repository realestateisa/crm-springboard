import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadHeader } from "@/components/leads/LeadHeader";
import { LeadDetails } from "@/components/leads/LeadDetails";
import { Tables } from "@/integrations/supabase/types";
import { CallManager } from "@/components/calls/CallManager";

type Lead = Tables<"leads">;

const Lead = () => {
  const { id } = useParams();

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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="container max-w-7xl mx-auto">
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
        <div className="container max-w-7xl mx-auto">
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
      <CallManager phoneNumber={lead.phone} />
      <LeadHeader lead={lead} />
      <div className="container max-w-7xl mx-auto">
        <LeadDetails lead={lead} />
      </div>
    </div>
  );
};

export default Lead;