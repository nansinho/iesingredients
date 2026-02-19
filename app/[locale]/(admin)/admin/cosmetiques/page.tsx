import { createClient } from "@/lib/supabase/server";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";

export default async function CosmetiquesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data, count } = await supabase
    .from("cosmetique_fr")
    .select("*", { count: "exact" })
    .order("nom_commercial", { ascending: true })
    .range(0, 19);

  return (
    <ProductsAdmin
      tableName="cosmetique_fr"
      title="Cosmétiques"
      editBasePath={`/${locale}/admin/cosmetiques`}
      initialProducts={data || []}
      initialTotal={count || 0}
    />
  );
}
