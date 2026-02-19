import { createClient } from "@/lib/supabase/server";
import { BlogAdmin } from "@/components/admin/BlogAdmin";

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: rawArticles } = await supabase
    .from("blog_articles")
    .select("*")
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articles = (rawArticles || []) as any[];

  return <BlogAdmin initialArticles={articles} locale={locale} />;
}
