import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
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

  // Fetch related articles
  const { data: relatedData } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  const relatedArticles = (relatedData || []) as BlogArticle[];

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

      {/* Hero — Immersive with cover image */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
              aria-hidden="true"
            />
          ) : (
            <div className="w-full h-full bg-[var(--brand-primary)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] via-[var(--brand-primary)]/60 to-[var(--brand-primary)]/30" />
        </ParallaxBackground>

        <div className="relative z-10 max-w-[900px] w-[90%] mx-auto pb-16 pt-36">
          <AnimateIn>
            <Link href="/actualites" className="inline-flex items-center gap-2 text-white/60 hover:text-[var(--brand-accent-light)] hover:gap-3 transition-all duration-300 mb-6">
              <ArrowLeft className="w-4 h-4" />
              {isFr ? "Retour aux actualités" : "Back to news"}
            </Link>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white backdrop-blur-sm">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.published_at || article.created_at || "").toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {article.author_name && (
                <span className="flex items-center gap-1.5 text-xs text-white/50">
                  <User className="w-3.5 h-3.5" />
                  {article.author_name}
                </span>
              )}
            </div>
          </AnimateIn>
          <AnimateIn delay={0.15} y={30}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-[-0.03em]">
              {title}
            </h1>
          </AnimateIn>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-[900px] w-[90%] mx-auto py-20 md:py-28">
        <AnimateIn y={20}>
          <div
            className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-dark dark:prose-headings:text-cream-light prose-p:text-dark/70 dark:prose-p:text-cream-light/60 prose-a:text-brown dark:prose-a:text-peach prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[var(--brand-accent-light)] prose-blockquote:text-dark/60 dark:prose-blockquote:text-cream-light/50 prose-img:rounded-2xl prose-strong:text-dark dark:prose-strong:text-cream-light"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        </AnimateIn>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-20 md:py-28 bg-cream-light dark:bg-dark border-t border-brown/8 dark:border-brown/10">
          <div className="w-[94%] mx-auto">
            <AnimateIn className="mb-12">
              <h2 className="text-dark dark:text-cream-light tracking-tight">
                {isFr ? "Articles" : "Related"}{" "}
                <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "associés" : "articles"}</span>
              </h2>
            </AnimateIn>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedArticles.map((related) => (
                <StaggerItem key={related.id}>
                  <HoverLift>
                    <Link
                      href={{
                        pathname: "/actualites/[slug]",
                        params: { slug: related.slug },
                      }}
                      className="group block"
                    >
                      <article className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(200,168,168,0.1)]">
                        <div className="p-3">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-cream dark:bg-dark">
                            {related.cover_image_url ? (
                              <Image
                                src={related.cover_image_url}
                                alt={isFr ? related.title_fr || "" : related.title_en || related.title_fr || ""}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-cream to-cream-light dark:from-dark dark:to-dark-card" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                          </div>
                        </div>
                        <div className="px-5 pb-5 pt-1">
                          <p className="text-xs text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)] mb-2 font-semibold uppercase tracking-wider">
                            {new Date(related.published_at || related.created_at || "").toLocaleDateString(
                              locale,
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </p>
                          <h3 className="text-base font-bold text-dark dark:text-cream-light group-hover:text-brown dark:group-hover:text-peach transition-colors line-clamp-2 leading-snug">
                            {isFr ? related.title_fr : related.title_en || related.title_fr}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brown dark:text-peach mt-3 group-hover:gap-2.5 transition-all duration-300">
                            {isFr ? "Lire" : "Read"}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}
    </>
  );
}
