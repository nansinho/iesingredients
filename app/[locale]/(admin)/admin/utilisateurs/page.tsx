import { createClient } from "@/lib/supabase/server";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export default async function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any[] = [];

  try {
    const supabase = await createClient();

    // Get all profiles with their roles
    const { data: rawProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Failed to fetch profiles:", profilesError.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles = (rawProfiles ?? []) as any[];

    // Get all user roles
    const { data: rawRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");

    if (rolesError) {
      console.error("Failed to fetch user roles:", rolesError.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roles = (rawRoles ?? []) as any[];

    // Merge roles into profiles (prefer admin if user has multiple roles)
    users = profiles.map((profile: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRoles = roles.filter((r: any) => r.user_id === profile.id);
      const isAdmin = userRoles.some((r: any) => r.role === "admin");
      return {
        ...profile,
        role: isAdmin ? "admin" : "user",
      };
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return <UsersAdmin initialUsers={users} />;
}
