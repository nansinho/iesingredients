import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUnreadContactsCount() {
  const queryClient = useQueryClient();
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Fetch initial count of unread contacts (status = 'new')
  const { data: count = 0, isLoading } = useQuery({
    queryKey: ["unread-contacts-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");

      if (error) throw error;
      return count || 0;
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel("contact-submissions-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contact_submissions",
        },
        (payload) => {
          // New contact message received
          if (payload.new) {
            // Invalidate the count query to refetch
            queryClient.invalidateQueries({ queryKey: ["unread-contacts-count"] });
            queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            
            // Trigger visual notification
            setHasNewMessage(true);
            
            // Show toast notification
            toast.info("Nouveau message de contact reçu !", {
              description: `De ${payload.new.first_name || ""} ${payload.new.last_name || ""}`.trim() || "Un visiteur",
              action: {
                label: "Voir",
                onClick: () => {
                  window.location.href = `/admin/contacts`;
                },
              },
            });

            // Reset the animation flag after 3 seconds
            setTimeout(() => setHasNewMessage(false), 3000);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contact_submissions",
        },
        () => {
          // Contact status updated - refetch count
          queryClient.invalidateQueries({ queryKey: ["unread-contacts-count"] });
          queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "contact_submissions",
        },
        () => {
          // Contact deleted - refetch count
          queryClient.invalidateQueries({ queryKey: ["unread-contacts-count"] });
          queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { count, isLoading, hasNewMessage };
}
