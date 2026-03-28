import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Eye } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ShareButtons } from "@/components/article/ShareButtons";
import { BackToTop } from "@/components/article/BackToTop";
import { ArticleContent } from "@/components/article/ArticleContent";
import { isAdmin } from "@/lib/auth";
import type { Database } from "@/lib/supabase/types";

type BlogArticle = Database["public"]["Tables"]["blog_articles"]["Row"];

export const revalidate = 300;

interface CategoryData {
  slug: string;
  label_fr: string;
  label_en: string;
  color_bg: string;
  color_text: string;
  color_border: string;
}

function getCategoryLabel(category: string, loc: string, dbCategories: CategoryData[]) {
  const cat = dbCategories.find((c) => c.slug === category);
  if (cat) return loc === "fr" ? cat.label_fr : cat.label_en;
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// --- Helpers ---

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  let i = 0;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    if (text) {
      headings.push({ id: `heading-${i}`, text, level: parseInt(match[1]) });
      i++;
    }
  }
  return headings;
}

// --- Metadata ---

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale, slug } = await params;
  const { preview } = await searchParams;
  const supabase = await createClient();

  const isPreview = preview === "true" && await isAdmin();

  let query = supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug);

  if (!isPreview) {
    query = query.eq("published", true);
  }

  const { data } = await query.maybeSingle();

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

// --- Page ---

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale, slug } = await params;
  const { preview } = await searchParams;
  const isFr = locale === "fr";
  const supabase = await createClient();

  const isPreview = preview === "true" && await isAdmin();

  let query = supabase
    .from("blog_articles")
    .select("*")
    .eq("slug", slug);

  if (!isPreview) {
    query = query.eq("published", true);
  }

  const { data: articleData } = await query.maybeSingle();

  const article = articleData as BlogArticle | null;
  if (!article) return notFound();

  // Fetch categories
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categoriesData } = await (supabase.from("blog_categories") as any)
    .select("*")
    .order("sort_order", { ascending: true });
  const dbCategories = (categoriesData ?? []) as CategoryData[];

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
  const excerpt = isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr;
  const readingTime = estimateReadingTime(content || "");
  const headings = extractHeadings(content || "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: article.cover_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author_name || "IES Ingredients" },
    publisher: { "@type": "Organization", name: "IES Ingredients" },
  };

  const formattedDate = new Date(
    article.published_at || article.created_at || ""
  ).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ReadingProgressBar />
      <BackToTop />

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

      {/* ── Preview banner ── */}
      {isPreview && (
        <div className="bg-amber-500 text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 relative z-50">
          <Eye className="w-4 h-4" />
          {isFr ? "Mode aperçu — Cet article n'est pas encore publié" : "Preview mode — This article is not published yet"}
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
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
            <div className="w-full h-full bg-brand-primary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/70 to-brand-primary/20" />
        </ParallaxBackground>

        <div className="relative z-10 max-w-[860px] w-[90%] mx-auto pb-20 pt-40">
          <AnimateIn>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-white/50 hover:text-brand-accent hover:gap-3 transition-all duration-300 mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {isFr ? "Retour aux actualités" : "Back to news"}
            </Link>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 border border-white/20 text-white backdrop-blur-sm">
                {getCategoryLabel(article.category || "", locale, dbCategories)}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-white/45">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              {article.author_name && (
                <span className="flex items-center gap-1.5 text-[13px] text-white/45">
                  <User className="w-3.5 h-3.5" />
                  {article.author_name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[13px] text-white/45">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} min {isFr ? "de lecture" : "read"}
              </span>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.15} y={30}>
            <h1 className="text-3xl md:text-4xl lg:text-[3.25rem] font-semibold text-white leading-[1.1] tracking-[-0.03em]">
              {title}
            </h1>
          </AnimateIn>

          {excerpt && (
            <AnimateIn delay={0.2}>
              <p className="mt-6 text-lg text-white/55 leading-relaxed max-w-[640px]">
                {excerpt}
              </p>
            </AnimateIn>
          )}
        </div>
      </section>

      {/* ── Article body ── */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-card">
        <div className="w-[94%] max-w-7xl mx-auto flex justify-center gap-10 xl:gap-16">
          {/* Article content */}
          <article className="w-full max-w-[860px] min-w-0">
            <AnimateIn y={20}>
              <ArticleContent html={content || ""} />
            </AnimateIn>

            {/* ── Author + Share footer ── */}
            <div className="mt-16 pt-10 border-t border-brand-primary/8 dark:border-cream-light/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl bg-brand-primary/[0.03] dark:bg-cream-light/[0.04] px-6 py-5">
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-brand-accent/10 flex items-center justify-center text-sm font-bold text-brand-accent tracking-wide">
                    {(article.author_name || "I").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-dark dark:text-cream-light text-sm">
                      {article.author_name || "IES Ingredients"}
                    </p>
                    <p className="text-xs text-dark/40 dark:text-cream-light/30 mt-0.5">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Share */}
                <ShareButtons
                  title={title || ""}
                  copiedLabel={isFr ? "Copié !" : "Copied!"}
                />
              </div>
            </div>
          </article>

          {/* Right: Table of contents */}
          <TableOfContents
            headings={headings}
            title={isFr ? "Sommaire" : "Contents"}
          />
        </div>
      </section>

      {/* ── You might also like ── */}
      {relatedArticles.length > 0 && (
        <section className="py-20 md:py-28 bg-[var(--color-cream-light)] dark:bg-dark border-t border-[var(--color-cream)] dark:border-brown/10">
          <div className="w-[94%] max-w-7xl mx-auto">
            <AnimateIn className="mb-12 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-accent mb-3">
                {isFr ? "Continuer la lecture" : "Continue reading"}
              </p>
              <h2 className="text-dark dark:text-cream-light tracking-tight">
                {isFr ? "Vous aimerez" : "You might"}{" "}
                <span className="font-playfair italic text-brand-accent">
                  {isFr ? "aussi" : "also like"}
                </span>
              </h2>
            </AnimateIn>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedArticles.map((related) => {
                const relTitle = isFr ? related.title_fr : related.title_en || related.title_fr;
                return (
                  <StaggerItem key={related.id}>
                    <HoverLift>
                      <Link
                        href={{
                          pathname: "/actualites/[slug]",
                          params: { slug: related.slug },
                        }}
                        className="group block"
                      >
                        <article className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-[var(--color-cream)] dark:border-brown/10 hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                          <div className="p-3">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--color-cream-light)] dark:bg-dark">
                              {related.cover_image_url ? (
                                <Image
                                  src={related.cover_image_url}
                                  alt={relTitle || ""}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[var(--color-cream-light)] to-[var(--color-cream)] dark:from-dark dark:to-dark-card" />
                              )}
                            </div>
                          </div>
                          <div className="px-5 pb-5 pt-2">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-accent">
                                {getCategoryLabel(related.category || "", locale, dbCategories)}
                              </span>
                              <span className="text-dark/15 dark:text-cream-light/15">·</span>
                              <span className="text-[11px] text-dark/35 dark:text-cream-light/30">
                                {new Date(related.published_at || related.created_at || "").toLocaleDateString(
                                  locale,
                                  { year: "numeric", month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-dark dark:text-cream-light group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
                              {relTitle}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary/50 dark:text-cream-light/40 mt-4 group-hover:text-brand-accent group-hover:gap-2.5 transition-all duration-300">
                              {isFr ? "Lire l'article" : "Read article"}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    </HoverLift>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </div>
        </section>
      )}
    </>
  );
}
