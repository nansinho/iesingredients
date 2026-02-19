import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export default async function UsersPage() {
  const supabase = await createClient();

  // Get all profiles with their roles
  const { data: rawProfiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const profiles = (rawProfiles || []) as any[];

  // Get all user roles
  const { data: rawRoles } = await supabase
    .from("user_roles")
    .select("*");

  const roles = (rawRoles || []) as any[];

  // Merge roles into profiles
  const users = profiles.map((profile) => {
    const userRole = roles.find((r: any) => r.user_id === profile.id);
    return {
      ...profile,
      role: userRole?.role || "user",
    };
  });

  return <UsersAdmin initialUsers={users} />;
}
