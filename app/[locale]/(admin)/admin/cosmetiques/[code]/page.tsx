import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "@/components/admin/ProductEditForm";

export default async function CosmetiqueEditPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const isNew = code === "new";
  let product = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cosmetique_fr")
      .select("*")
      .eq("code", decodeURIComponent(code))
      .maybeSingle();
    product = data as Record<string, any> | null;
  }

  return (
    <ProductEditForm
      tableName="cosmetique_fr"
      product={product}
      backPath={`/${locale}/admin/cosmetiques`}
      isNew={isNew}
    />
  );
}
