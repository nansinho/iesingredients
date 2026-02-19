import { createClient } from "@/lib/supabase/server";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";

export default async function ParfumsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("parfum_fr")
    .select("*", { count: "exact" })
    .order("nom_commercial", { ascending: true })
    .range(0, 19);

  return (
    <ProductsAdmin
      tableName="parfum_fr"
      title="Parfums"
      editBasePath={`/${locale}/admin/parfums`}
      initialProducts={data || []}
      initialTotal={count || 0}
    />
  );
}
