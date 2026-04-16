export const revalidate = 600;

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { Link } from "@/i18n/routing";
import { Newspaper, ArrowUpRight, Mail, Sparkles } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem } from "@/components/ui/AnimateIn";

interface CategoryData {
  slug: string;
  label_fr: string;
  label_en: string;
  color_bg: string;
  color_text: string;
  color_border: string;
}

function getCategoryLabel(category: string, locale: string, dbCategories: CategoryData[]) {
  const cat = dbCategories.find((c) => c.slug === category);
  if (cat) return locale === "fr" ? cat.label_fr : cat.label_en;
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryStyle(category: string, dbCategories: CategoryData[]) {
  const cat = dbCategories.find((c) => c.slug === category);
  if (cat) {
    return {
      style: { backgroundColor: cat.color_bg, color: cat.color_text, borderColor: cat.color_border },
      className: "",
    };
  }
  return { style: undefined, className: "bg-brand-primary/8 text-brand-primary border-brand-primary/12" };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description =
    locale === "fr"
      ? "Actualités et articles sur les ingrédients naturels, tendances cosmétiques et innovations en parfumerie."
      : "News and articles about natural ingredients, cosmetic trends and perfumery innovations.";

  return {
    title: t("newsTitle"),
    description,
    alternates: {
      canonical: `/${locale}/actualites`,
      languages: { fr: "/fr/actualites", en: "/en/news" },
    },
    openGraph: {
      title: t("newsTitle"),
      description,
      url: `https://ies-ingredients.com/${locale}/${locale === "fr" ? "actualites" : "news"}`,
      type: "website",
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();

  type BlogArticle = Database["public"]["Tables"]["blog_articles"]["Row"];

  const [{ data: articles }, { data: categoriesData }] = await Promise.all([
    supabase
      .from("blog_articles")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("blog_categories") as any)
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const dbArticles = (articles ?? []) as BlogArticle[];
  const dbCategories = (categoriesData ?? []) as CategoryData[];

  const featuredArticle = dbArticles[0] || null;
  const restArticles = dbArticles.slice(1);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Actualités" : "News", url: `https://ies-ingredients.com/${locale}/${isFr ? "actualites" : "news"}` },
        ]}
      />

      {/* ═══ Hero — cinematic ═══ */}
      <section className="relative min-h-[70vh] bg-brand-primary overflow-hidden flex items-center pt-32 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/cream-bowl.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/85 to-brand-primary/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/55 via-transparent to-brand-primary" />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 80% 35%, hsl(var(--brand-accent) / 0.18) 0%, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto w-full">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                {isFr ? "Journal" : "Journal"}
              </span>
              <div className="h-px flex-1 max-w-[180px] bg-white/15" />
              <span className="text-[11px] font-mono text-white/30 hidden sm:inline">
                {dbArticles.length} {isFr ? "articles" : "articles"}
              </span>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} y={30}>
            <h1
              className="text-white font-semibold tracking-[-0.035em] leading-[0.98] mb-6"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 7rem)" }}
            >
              {isFr ? "Actualités," : "News,"}
              <br />
              <span className="text-brand-accent">{isFr ? "tendances, innovations." : "trends, innovations."}</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2} y={20}>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-xl">
              {isFr
                ? "Nos regards sur le monde des ingrédients naturels — reportages, interviews et analyses sectorielles."
                : "Our insights into the world of natural ingredients — reports, interviews and sector analyses."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ Featured article ═══ */}
      {featuredArticle && (
        <section className="py-20 md:py-24 bg-cream-light border-b border-dark/5">
          <div className="w-[94%] max-w-7xl mx-auto">
            <AnimateIn>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/40">
                  {isFr ? "À la une" : "Featured"}
                </span>
                <div className="h-px flex-1 bg-dark/8" />
              </div>

              <Link
                href={{
                  pathname: "/actualites/[slug]",
                  params: { slug: (featuredArticle as BlogArticle).slug },
                }}
                className="group block"
              >
                <article className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden border border-dark/5 hover:border-brand-accent/20 transition-all duration-500">
                  <div className="relative aspect-[16/10] md:aspect-auto md:h-full min-h-[320px] overflow-hidden">
                    {(featuredArticle as BlogArticle).cover_image_url ? (
                      <Image
                        src={(featuredArticle as BlogArticle).cover_image_url!}
                        alt={isFr ? featuredArticle.title_fr : featuredArticle.title_en || featuredArticle.title_fr}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-accent-light/20" />
                    )}
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] border ${getCategoryStyle(featuredArticle.category || "", dbCategories).className}`}
                        style={getCategoryStyle(featuredArticle.category || "", dbCategories).style}
                      >
                        {getCategoryLabel(featuredArticle.category || "", locale, dbCategories)}
                      </span>
                      <time className="text-xs text-dark/40 font-mono">
                        {new Date(featuredArticle.published_at || featuredArticle.created_at || "").toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <h2
                      className="font-semibold text-dark leading-[1.1] tracking-[-0.02em] mb-4 group-hover:text-brand-accent transition-colors"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
                    >
                      {isFr ? featuredArticle.title_fr : featuredArticle.title_en || featuredArticle.title_fr}
                    </h2>
                    <p className="text-dark/55 text-base leading-relaxed mb-6 line-clamp-3">
                      {isFr ? featuredArticle.excerpt_fr : featuredArticle.excerpt_en || featuredArticle.excerpt_fr}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent">
                      {isFr ? "Lire l'article" : "Read article"}
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </Link>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* ═══ All articles grid ═══ */}
      {restArticles.length > 0 && (
        <section className="py-20 md:py-28 bg-cream-light">
          <div className="w-[94%] max-w-7xl mx-auto">
            <AnimateIn className="mb-10">
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/40">
                  {isFr ? "Tous les articles" : "All articles"}
                </span>
                <div className="flex-1 h-px bg-dark/8" />
                <span className="text-[11px] font-mono text-dark/40">
                  {restArticles.length.toString().padStart(2, "0")}
                </span>
              </div>
            </AnimateIn>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {restArticles.map((article) => (
                <StaggerItem key={article.id}>
                  <Link
                    href={{
                      pathname: "/actualites/[slug]",
                      params: { slug: article.slug },
                    }}
                    className="group block h-full"
                  >
                    <article className="relative h-full rounded-2xl overflow-hidden bg-white border border-dark/5 hover:border-brand-accent/20 hover:-translate-y-1 transition-all duration-500 flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={isFr ? article.title_fr : article.title_en || article.title_fr}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cream-light to-cream" />
                        )}
                        <div className="absolute top-3 left-3">
                          <span
                            className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full backdrop-blur-md border border-white/20 text-white"
                            style={getCategoryStyle(article.category || "", dbCategories).style}
                          >
                            {getCategoryLabel(article.category || "", locale, dbCategories)}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
                        <time className="text-[10px] text-dark/35 font-mono uppercase tracking-[0.15em] mb-3">
                          {new Date(article.published_at || article.created_at || "").toLocaleDateString(locale, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                        <h3 className="text-lg font-semibold text-dark leading-snug tracking-[-0.01em] mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors">
                          {isFr ? article.title_fr : article.title_en || article.title_fr}
                        </h3>
                        <p className="text-sm leading-relaxed text-dark/55 line-clamp-2 mb-5">
                          {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent mt-auto">
                          {isFr ? "Lire" : "Read"}
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* ═══ Newsletter ═══ */}
      <section className="py-20 md:py-24 bg-brand-primary border-t border-white/5">
        <div className="w-[94%] max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Mail className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                {isFr ? "Newsletter" : "Newsletter"}
              </span>
            </div>
            <h2
              className="text-white font-semibold tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              {isFr ? "Restez informé" : "Stay informed"}{" "}
              <span className="text-brand-accent">{isFr ? "chaque mois." : "every month."}</span>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-md">
              {isFr
                ? "Nos meilleurs articles, interviews et nouveautés ingrédients — sans spam, sans fréquence abusive."
                : "Our best articles, interviews and ingredient news — no spam, no excess frequency."}
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder={isFr ? "Votre adresse email" : "Your email"}
              className="h-12 px-5 rounded-full bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent/40 flex-1 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-semibold transition-colors shrink-0 inline-flex items-center justify-center gap-2"
            >
              {isFr ? "S'inscrire" : "Subscribe"}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
