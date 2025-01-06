import { useInfiniteQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const LEADS_PER_PAGE = 50;

export default function Leads() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [totalLeads, setTotalLeads] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['leads', debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('date_created', { ascending: false })
        .range(
          pageParam * LEADS_PER_PAGE,
          (pageParam + 1) * LEADS_PER_PAGE - 1
        );

      if (debouncedSearch) {
        query = query.or(
          `first_name.ilike.%${debouncedSearch}%,` +
          `last_name.ilike.%${debouncedSearch}%,` +
          `client.ilike.%${debouncedSearch}%,` +
          `location.ilike.%${debouncedSearch}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching leads",
          description: error.message
        });
        throw error;
      }

      // Update total count only on first page
      if (pageParam === 0 && count !== null) {
        setTotalLeads(count);
      }

      return data as Lead[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === LEADS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages of leads data
  const leads = data?.pages.flat() || [];

  if (isError) {
    return (
      <div className="flex-1 flex flex-col min-w-0 md:ml-[16rem]">
        <div className="container py-6">
          <div className="text-center text-red-500">
            Error loading leads. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 md:ml-[16rem]">
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Leads {totalLeads > 0 && <span className="text-gray-500 text-2xl">({totalLeads} total)</span>}
          </h1>
          <div className="w-72">
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Client</TableHead>
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
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    {lead.first_name} {lead.last_name}
                  </TableCell>
                  <TableCell>{lead.client}</TableCell>
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

        {/* Infinite scroll sentinel */}
        <div 
          ref={loadMoreRef} 
          className="flex justify-center p-4"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more leads...
            </div>
          )}
        </div>

        {!isLoading && leads.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No leads found. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}