import { createClient } from "@/lib/supabase/server";
import { TeamAdmin } from "@/components/admin/TeamAdmin";

export default async function EquipePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: rawMembers } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members = (rawMembers || []) as any[];

  return <TeamAdmin initialMembers={members} locale={locale} />;
}
