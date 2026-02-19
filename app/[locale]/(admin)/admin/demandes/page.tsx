import { createClient } from "@/lib/supabase/server";
import { DemandesAdmin } from "@/components/admin/DemandesAdmin";

export default async function DemandesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let requests: any[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sample_requests")
      .select("*, sample_request_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch sample requests:", error.message);
    } else {
      requests = data ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch sample requests:", error);
  }

  return <DemandesAdmin initialRequests={requests} />;
}
