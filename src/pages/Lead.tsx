import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent>
            <p className="text-muted-foreground">Lead not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {lead.first_name} {lead.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">{lead.email}</p>
          </div>
          <LeadStatusBadge status={lead.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {lead.phone || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {lead.location}
                </p>
                <p>
                  <span className="text-muted-foreground">Timezone:</span>{" "}
                  {lead.timezone || "UTC"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Client:</span>{" "}
                  {lead.client || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Source:</span>{" "}
                  {lead.source || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Lead Type:</span>{" "}
                  {lead.lead_type || "N/A"}
                </p>
              </div>
            </div>
          </div>
          {lead.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{lead.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Lead;