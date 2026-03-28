import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Eye } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";

import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";

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

  // Fetch previous and next articles for navigation
  const { data: prevData } = await supabase
    .from("blog_articles")
    .select("slug, title_fr, title_en")
    .eq("published", true)
    .lt("published_at", article.published_at || article.created_at)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: nextData } = await supabase
    .from("blog_articles")
    .select("slug, title_fr, title_en")
    .eq("published", true)
    .gt("published_at", article.published_at || article.created_at)
    .order("published_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const prevArticle = prevData as { slug: string; title_fr: string; title_en: string | null } | null;
  const nextArticle = nextData as { slug: string; title_fr: string; title_en: string | null } | null;

  const title = isFr ? article.title_fr : article.title_en || article.title_fr;
  const content = isFr ? article.content_fr : article.content_en || article.content_fr;
  const excerpt = isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr;
  const readingTime = estimateReadingTime(content || "");


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

      {/* ── Header section (fond violet) ── */}
      <section className="bg-brand-primary pt-32 pb-12 md:pb-14">
        <div className="max-w-[860px] w-[90%] mx-auto text-center">
          <AnimateIn>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-white/40 hover:text-brand-accent hover:gap-3 transition-all duration-300 mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {isFr ? "Retour aux actualités" : "Back to news"}
            </Link>
          </AnimateIn>

          <AnimateIn delay={0.1} y={20}>
            <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-semibold text-white leading-[1.15] tracking-[-0.02em] max-w-3xl mx-auto">
              {title}
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-brand-accent/15 border border-brand-accent/25 text-brand-accent">
                {getCategoryLabel(article.category || "", locale, dbCategories)}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-brand-accent/70">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              {article.author_name && (
                <span className="flex items-center gap-1.5 text-[13px] text-brand-accent/70">
                  <User className="w-3.5 h-3.5" />
                  {article.author_name}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[13px] text-brand-accent/70">
                <Clock className="w-3.5 h-3.5" />
                {readingTime} min {isFr ? "de lecture" : "read"}
              </span>
            </div>
          </AnimateIn>

        </div>
      </section>

      {/* ── Cover image (chevauche le hero) + excerpt ── */}
      {article.cover_image_url && (
        <section className="relative bg-white dark:bg-dark-card">
          {/* Bande violette qui continue derrière le haut de l'image */}
          <div className="absolute top-0 left-0 right-0 h-20 md:h-28 bg-brand-primary" />
          <div className="w-[92%] max-w-6xl mx-auto relative z-10">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-2 md:p-3">
          <div className="relative aspect-[16/8] md:aspect-[16/7] rounded-xl overflow-hidden">
            <Image
              src={article.cover_image_url}
              alt={title || ""}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 1024px"
            />
          </div>
          </div>
          {excerpt && (
            <div className="max-w-[860px] w-[90%] mx-auto">
              <AnimateIn delay={0.25}>
                <p className="mt-8 text-lg font-bold text-brand-accent leading-relaxed text-justify">
                  {excerpt}
                </p>
              </AnimateIn>
            </div>
          )}
          </div>
        </section>
      )}

      {/* ── Article body ── */}
      <section className="py-8 md:py-10 bg-white dark:bg-dark-card">
        <div className="w-[94%] max-w-[860px] mx-auto">
          {/* Article content */}
          <article className="w-full max-w-[860px] min-w-0">
            <div className="mb-6 border-b border-brand-accent/30" />
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

            {/* ── Prev / Next navigation ── */}
            {(prevArticle || nextArticle) && (
              <div className="mt-10 flex items-center justify-center gap-4">
                {prevArticle ? (
                  <Link
                    href={{ pathname: "/actualites/[slug]", params: { slug: prevArticle.slug } }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-primary/15 text-brand-primary text-sm font-medium hover:bg-brand-primary/5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isFr ? "Précédent" : "Previous"}
                  </Link>
                ) : <div />}
                {nextArticle ? (
                  <Link
                    href={{ pathname: "/actualites/[slug]", params: { slug: nextArticle.slug } }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-colors"
                  >
                    {isFr ? "Suivant" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : <div />}
              </div>
            )}
          </article>

        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden bg-brand-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-accent blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent blur-[100px]" />
        </div>
        <div className="relative z-10 w-[90%] max-w-4xl mx-auto py-20 md:py-24 text-center">
          <AnimateIn>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent mb-4">
              {isFr ? "Notre expertise" : "Our expertise"}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-[1.2] tracking-tight mb-5">
              {isFr
                ? <>Découvrez nos <span className="font-playfair italic text-brand-accent">ingrédients</span></>
                : <>Discover our <span className="font-playfair italic text-brand-accent">ingredients</span></>
              }
            </h2>
            <p className="text-white/45 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
              {isFr
                ? "Parfumerie, cosmétique, arômes alimentaires — explorez notre catalogue de matières premières naturelles et synthétiques."
                : "Perfumery, cosmetics, food flavors — explore our catalog of natural and synthetic raw materials."
              }
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-accent text-white font-medium text-sm hover:bg-brand-accent-hover transition-colors duration-300 shadow-lg shadow-brand-accent/20"
            >
              {isFr ? "Explorer le catalogue" : "Explore the catalog"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
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
