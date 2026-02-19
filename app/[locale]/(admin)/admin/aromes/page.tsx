import { createClient } from "@/lib/supabase/server";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";

export default async function AromesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("aromes_fr")
    .select("*", { count: "exact" })
    .order("nom_commercial", { ascending: true })
    .range(0, 19);

  return (
    <ProductsAdmin
      tableName="aromes_fr"
      title="Arômes"
      editBasePath={`/${locale}/admin/aromes`}
      initialProducts={data || []}
      initialTotal={count || 0}
    />
  );
}
