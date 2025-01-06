import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadStatusBadge } from "./LeadStatusBadge";
import type { Lead } from "@/integrations/supabase/types/leads";

interface LeadsTableProps {
  leads: Lead[];
}

export const LeadsTable = ({ leads }: LeadsTableProps) => {
  const navigate = useNavigate();

  const handleLeadClick = (leadId: string) => {
    navigate(`/lead/${leadId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="font-medium">Client</TableHead>
          <TableHead className="font-medium">Location</TableHead>
          <TableHead className="font-medium">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow
            key={lead.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleLeadClick(lead.id)}
          >
            <TableCell className="py-3 font-medium">
              {lead.first_name} {lead.last_name}
            </TableCell>
            <TableCell className="py-3 text-muted-foreground">
              {lead.location}
            </TableCell>
            <TableCell className="py-3">
              <LeadStatusBadge status={lead.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}