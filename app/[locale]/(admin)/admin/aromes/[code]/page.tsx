import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "@/components/admin/ProductEditForm";

export default async function AromeEditPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const isNew = code === "new";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let product: Record<string, any> | null = null;

  if (!isNew) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("aromes_fr")
        .select("*")
        .eq("code", decodeURIComponent(code))
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch aroma product:", error.message);
      } else {
        product = data;
      }
    } catch (error) {
      console.error("Failed to fetch aroma product:", error);
    }
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
