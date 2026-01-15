import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePendingRequestsCount() {
  const queryClient = useQueryClient();
  const [hasNewRequest, setHasNewRequest] = useState(false);

  // Fetch initial count
  const { data: count = 0, isLoading } = useQuery({
    queryKey: ["pending-requests-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("sample_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel("sample-requests-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sample_requests",
        },
        (payload) => {
          // New request received
          if (payload.new && payload.new.status === "pending") {
            // Invalidate the count query to refetch
            queryClient.invalidateQueries({ queryKey: ["pending-requests-count"] });
            queryClient.invalidateQueries({ queryKey: ["admin-sample-requests"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: ["sample-requests-chart"] });
            
            // Trigger visual notification
            setHasNewRequest(true);
            
            // Show toast notification
            toast.info("Nouvelle demande d'échantillon reçue !", {
              description: `De ${payload.new.contact_name || "Un client"}`,
              action: {
                label: "Voir",
                onClick: () => {
                  window.location.href = `/admin/demandes/${payload.new.id}`;
                },
              },
            });

            // Reset the animation flag after 3 seconds
            setTimeout(() => setHasNewRequest(false), 3000);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sample_requests",
        },
        () => {
          // Request status updated - refetch count
          queryClient.invalidateQueries({ queryKey: ["pending-requests-count"] });
          queryClient.invalidateQueries({ queryKey: ["admin-sample-requests"] });
          queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "sample_requests",
        },
        () => {
          // Request deleted - refetch count
          queryClient.invalidateQueries({ queryKey: ["pending-requests-count"] });
          queryClient.invalidateQueries({ queryKey: ["admin-sample-requests"] });
          queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { count, isLoading, hasNewRequest };
}
