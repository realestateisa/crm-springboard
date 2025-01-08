import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

export const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching lead:", error);
        return;
      }

      setLead(data);
    };

    fetchLead();
  }, [id]);

  if (!lead) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Lead Details</h1>
      <div>
        <p>Lead ID: {lead.id}</p>
        <p>Name: {`${lead.first_name} ${lead.last_name || ''}`}</p>
        <p>Email: {lead.email}</p>
        <p>Phone: {lead.phone}</p>
        <p>Status: {lead.status}</p>
        <p>Created: {new Date(lead.date_created || '').toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default LeadDetails;