import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types/database";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

export const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);

  return (
    <div>
      <h1>Lead Details</h1>
      {lead ? (
        <div>
          <p>Lead ID: {lead.id}</p>
          <p>Name: {lead.name}</p>
          <p>Email: {lead.email}</p>
          <p>Phone: {lead.phone}</p>
          <p>Status: {lead.status}</p>
          <p>Created At: {new Date(lead.created_at).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LeadDetails;