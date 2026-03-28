import { CategoryManager } from "@/components/admin/CategoryManager";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "lucide-react";

export default async function SettingsCategoriesPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categories } = await (supabase.from("blog_categories") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-brand-primary mb-1 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Catégories d&apos;articles
        </h2>
        <p className="text-sm text-brand-secondary/50 mb-4">
          Gérez les catégories et leurs couleurs pour le blog.
        </p>
      </div>

      <CategoryManager initialCategories={categories || []} />
    </div>
  );
}
