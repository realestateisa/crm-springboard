import { Lead } from "@/integrations/supabase/types/leads";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import LeadStatusBadge from "./LeadStatusBadge";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
}

const LeadsTable = ({ leads, isLoading }: LeadsTableProps) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50 bg-muted/30">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-muted/50 animate-fade-in">
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-muted/50 bg-muted/30">
          <TableHead className="font-semibold">Name</TableHead>
          <TableHead className="font-semibold">Client</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="font-semibold">Location</TableHead>
          <TableHead className="font-semibold">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow 
            key={lead.id} 
            className="hover:bg-muted/50 cursor-pointer transition-colors duration-200 animate-fade-in"
          >
            <TableCell className="font-medium">
              {lead.first_name} {lead.last_name}
            </TableCell>
            <TableCell>{lead.client}</TableCell>
            <TableCell>
              <LeadStatusBadge status={lead.status!} />
            </TableCell>
            <TableCell>{lead.location}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(lead.date_created!).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeadsTable;