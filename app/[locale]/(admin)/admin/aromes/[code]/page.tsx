import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "@/components/admin/ProductEditForm";

export default async function AromeEditPage({
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
      .from("aromes_fr")
      .select("*")
      .eq("code", decodeURIComponent(code))
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product = data as Record<string, any> | null;
  }

  return (
    <ProductEditForm
      tableName="aromes_fr"
      product={product}
      backPath={`/${locale}/admin/aromes`}
      isNew={isNew}
    />
  );
}
