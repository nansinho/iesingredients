import { createClient } from "@/lib/supabase/server";
import { TeamEditForm } from "@/components/admin/TeamEditForm";

export default async function TeamEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isNew = id === "new";
  let member = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    member = data as Record<string, any> | null;
  }

  return (
    <TeamEditForm
      member={member}
      backPath={`/${locale}/admin/equipe`}
      isNew={isNew}
    />
  );
}
