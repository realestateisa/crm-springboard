import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useToast } from "@/components/ui/use-toast";

export default function Leads() {
  const { toast } = useToast();
  
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('date_created', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching leads",
          description: error.message
        });
        throw error;
      }
      
      return data as Lead[];
    }
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 md:ml-[16rem]">
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : leads?.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    {lead.first_name} {lead.last_name}
                  </TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.location}</TableCell>
                  <TableCell>
                    {new Date(lead.date_created!).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}