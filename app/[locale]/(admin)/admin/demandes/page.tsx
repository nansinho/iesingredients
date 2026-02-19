import { createClient } from "@/lib/supabase/server";
import { DemandesAdmin } from "@/components/admin/DemandesAdmin";

export default async function DemandesPage() {
  const supabase = await createClient();

  const { data: rawRequests } = await supabase
    .from("sample_requests")
    .select("*, sample_request_items(*)")
    .order("created_at", { ascending: false });

  const requests = (rawRequests || []) as any[];

  return <DemandesAdmin initialRequests={requests} />;
}
