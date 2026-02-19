import { createClient } from "@/lib/supabase/server";
import { TeamAdmin } from "@/components/admin/TeamAdmin";

export default async function EquipePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let members: any[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Failed to fetch team members:", error.message);
    } else {
      members = data ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch team members:", error);
  }

  return <TeamAdmin initialMembers={members} locale={locale} />;
}
