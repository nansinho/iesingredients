import { createClient } from "@/lib/supabase/server";
import { BlogEditForm } from "@/components/admin/BlogEditForm";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const isNew = id === "new";
  let article = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    article = data as Record<string, any> | null;
  }

  return (
    <BlogEditForm
      article={article}
      backPath={`/${locale}/admin/blog`}
      isNew={isNew}
    />
  );
}
