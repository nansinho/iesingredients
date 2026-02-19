import { createClient } from "@/lib/supabase/server";
import { TeamEditForm } from "@/components/admin/TeamEditForm";

export default async function TeamEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isNew = id === "new";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let member: Record<string, any> | null = null;

  if (!isNew) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch team member:", error.message);
      } else {
        member = data;
      }
    } catch (error) {
      console.error("Failed to fetch team member:", error);
    }
  }

  return (
    <TeamEditForm
      member={member}
      backPath={`/${locale}/admin/equipe`}
      isNew={isNew}
    />
  );
}
