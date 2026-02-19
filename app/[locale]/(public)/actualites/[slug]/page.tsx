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
  if (!article) notFound();

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
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-12">
        <div className="container-luxe max-w-4xl">
          <Link href="/actualites" className="inline-flex items-center gap-2 text-cream-300 hover:text-gold-400 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour aux actualités" : "Back to news"}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold-500/20 text-gold-400">
              {article.category}
            </span>
            <time className="text-xs text-cream-400">
              {new Date(article.published_at || article.created_at || "").toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            {title}
          </h1>
          {article.author_name && (
            <p className="text-cream-300 mt-4">
              {isFr ? "Par" : "By"} {article.author_name}
            </p>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {article.cover_image_url && (
        <div className="container-luxe max-w-4xl -mt-2 mb-12">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
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
      <article className="container-luxe max-w-4xl pb-24">
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-forest-900 prose-p:text-forest-700 prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </article>
    </>
  );
}
