import { createClient } from "@/lib/supabase/server";
import { BlogAdmin } from "@/components/admin/BlogAdmin";

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let articles: any[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch blog articles:", error.message);
    } else {
      articles = data ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch blog articles:", error);
  }

  return <BlogAdmin initialArticles={articles} locale={locale} />;
}
