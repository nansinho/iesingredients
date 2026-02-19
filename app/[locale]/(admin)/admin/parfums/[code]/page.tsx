import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "@/components/admin/ProductEditForm";

export default async function ParfumEditPage({
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
      .from("parfum_fr")
      .select("*")
      .eq("code", decodeURIComponent(code))
      .maybeSingle();
    product = data as Record<string, any> | null;
  }

  return (
    <ProductEditForm
      tableName="parfum_fr"
      product={product}
      backPath={`/${locale}/admin/parfums`}
      isNew={isNew}
    />
  );
}
