import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/integrations/supabase/types/leads";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { LeadsTable } from "@/components/leads/LeadsTable";

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
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        <div className="container py-6">
          <div className="text-center text-red-500 animate-fade-in">
            Error loading leads. Please try refreshing the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      <div className="border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Leads
              </h1>
              {totalLeads > 0 && (
                <span className="text-lg text-muted-foreground">
                  ({totalLeads.toLocaleString()})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden transition-all duration-200">
          <LeadsTable leads={leads} />
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={loadMoreRef} className="flex justify-center p-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more leads...
            </div>
          )}
        </div>

        {!isLoading && leads.length === 0 && (
          <div className="text-center text-muted-foreground py-8 animate-fade-in">
            No leads found. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}