import { createClient } from "@/lib/supabase/server";
import { ProductsAdmin } from "@/components/admin/ProductsAdmin";

export default async function CosmetiquesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];
  let total = 0;

  try {
    const supabase = await createClient();
    const { data, count, error } = await supabase
      .from("cosmetique_fr")
      .select("*", { count: "exact" })
      .order("nom_commercial", { ascending: true })
      .range(0, 19);

    if (error) {
      console.error("Failed to fetch cosmetics:", error.message);
    } else {
      products = data ?? [];
      total = count ?? 0;
    }
  } catch (error) {
    console.error("Failed to fetch cosmetics:", error);
  }

  return (
    <ProductsAdmin
      tableName="cosmetique_fr"
      title="Cosmétiques"
      editBasePath={`/${locale}/admin/cosmetiques`}
      initialProducts={products}
      initialTotal={total}
    />
  );
}
