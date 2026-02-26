import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { Database } from "@/lib/supabase/types";

type BlogArticle = Database["public"]["Tables"]["blog_articles"]["Row"];

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const article = data as BlogArticle | null;
  if (!article) return { title: "Article not found" };

  const isFr = locale === "fr";
  const title = isFr ? article.title_fr : article.title_en || article.title_fr;

  return {
    title: `${title} - IES Ingredients`,
    description: isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr,
    alternates: {
      canonical: `/${locale}/actualites/${slug}`,
      languages: {
        fr: `/fr/actualites/${slug}`,
        en: `/en/news/${slug}`,
      },
    },
    openGraph: {
      title,
      description: isFr ? article.excerpt_fr : article.excerpt_en,
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : undefined,
      type: "article",
      publishedTime: article.published_at,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();

  const { data: articleData } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const article = articleData as BlogArticle | null;
  if (!article) return notFound();

  const title = isFr ? article.title_fr : article.title_en || article.title_fr;
  const content = isFr ? article.content_fr : article.content_en || article.content_fr;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: isFr ? article.excerpt_fr : article.excerpt_en,
    image: article.cover_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author_name || "IES Ingredients" },
    publisher: { "@type": "Organization", name: "IES Ingredients" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Actualités" : "News", url: `https://ies-ingredients.com/${locale}/${isFr ? "actualites" : "news"}` },
          { name: title || slug, url: `https://ies-ingredients.com/${locale}/${isFr ? "actualites" : "news"}/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-dark pt-32 sm:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-peach/5 rounded-full blur-[150px]" />

        <div className="max-w-[900px] w-[90%] mx-auto relative z-10">
          <Link href="/actualites" className="inline-flex items-center gap-2 text-cream-light/60 hover:text-peach transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour aux actualités" : "Back to news"}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-peach/10 border border-peach/20 text-peach">
              {article.category}
            </span>
            <time className="text-xs text-cream-light/50">
              {new Date(article.published_at || article.created_at || "").toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-cream-light leading-tight tracking-[-0.03em]">
            {title}
          </h1>
          {article.author_name && (
            <p className="text-cream-light/60 mt-4">
              {isFr ? "Par" : "By"} {article.author_name}
            </p>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {article.cover_image_url && (
        <div className="max-w-[900px] w-[90%] mx-auto -mt-2 mb-12">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10">
            <Image
              src={article.cover_image_url}
              alt={title || ""}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-[900px] w-[90%] mx-auto pb-24">
        <div
          className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-dark dark:prose-headings:text-cream-light prose-p:text-dark/70 dark:prose-p:text-cream-light/60 prose-a:text-brown dark:prose-a:text-peach prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </article>
    </>
  );
}
