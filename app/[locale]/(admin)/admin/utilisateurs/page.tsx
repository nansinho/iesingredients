import { createClient } from "@/lib/supabase/server";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export default async function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any[] = [];

  try {
    const supabase = await createClient();

    // Fetch profiles, roles, and team members in parallel
    const [profilesRes, rolesRes, teamRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("team_members").select("*"),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profiles = (profilesRes.data ?? []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roles = (rolesRes.data ?? []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamMembers = (teamRes.data ?? []) as any[];

    // Build email-to-team lookup
    const teamByEmail: Record<string, any> = {};
    teamMembers.forEach((tm: any) => {
      if (tm.email) teamByEmail[tm.email.toLowerCase()] = tm;
    });

    // Merge all data
    users = profiles.map((profile: Record<string, unknown>) => {
      const userRoles = roles.filter((r: any) => r.user_id === profile.id);
      const isAdmin = userRoles.some((r: any) => r.role === "admin");
      const email = (profile.email as string) || "";
      const team = teamByEmail[email.toLowerCase()] || null;

      return {
        ...profile,
        role: isAdmin ? "admin" : "user",
        // Enrich with team data if available
        team_role_fr: team?.role_fr || null,
        team_role_en: team?.role_en || null,
        team_department: team?.department || null,
        team_photo_url: team?.photo_url || null,
        team_bio_fr: team?.bio_fr || null,
        team_linkedin: team?.linkedin_url || null,
        team_phone: team?.phone || null,
        team_member_id: team?.id || null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return <UsersAdmin initialUsers={users} />;
}
