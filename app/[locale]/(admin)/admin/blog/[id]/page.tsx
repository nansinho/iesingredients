import { createClient } from "@/lib/supabase/server";
import { BlogEditForm } from "@/components/admin/BlogEditForm";
import { notFound } from "next/navigation";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isNew = id === "new";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let article: Record<string, any> | null = null;

  if (!isNew) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch blog article:", error.message);
      } else {
        article = data;
      }
    } catch (error) {
      console.error("Failed to fetch blog article:", error);
    }

    if (!article) notFound();
  }

  return (
    <BlogEditForm
      article={article}
      backPath={`/${locale}/admin/blog`}
      isNew={isNew}
    />
  );
}
