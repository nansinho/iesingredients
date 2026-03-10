import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { Link } from "@/i18n/routing";
import { Newspaper, ArrowRight, Mail } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = locale === "fr"
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

  const { data: articles } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const allArticles = (articles ?? []) as BlogArticle[];
  const featuredArticle = allArticles[0] as BlogArticle | undefined;
  const restArticles = allArticles.slice(1);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Actualités" : "News", url: `https://ies-ingredients.com/${locale}/${isFr ? "actualites" : "news"}` },
        ]}
      />

      {/* Hero — Immersive with background image */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/cream-bowl.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] via-[var(--brand-primary)]/75 to-[var(--brand-primary)]/40" />
        </div>

        <div className="relative z-10 w-[94%] mx-auto pb-20 pt-40">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-5 backdrop-blur-sm">
              <Newspaper className="w-3.5 h-3.5" />
              Blog
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Nos" : "Our"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">{isFr ? "Actualités" : "News"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              {isFr
                ? "Dernières nouvelles et articles sur les ingrédients naturels, tendances et innovations."
                : "Latest news and articles about natural ingredients, trends and innovations."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-20 md:py-28 bg-white dark:bg-dark">
          <div className="w-[94%] mx-auto">
            <AnimateIn>
              <Link
                href={{
                  pathname: "/actualites/[slug]",
                  params: { slug: featuredArticle.slug },
                }}
                className="group block"
              >
                <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-cream-light dark:bg-dark-card rounded-3xl overflow-hidden border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(200,168,168,0.1)]">
                  <div className="relative aspect-[16/10] md:aspect-auto md:h-full min-h-[300px] overflow-hidden">
                    {featuredArticle.cover_image_url ? (
                      <Image
                        src={featuredArticle.cover_image_url}
                        alt={isFr ? featuredArticle.title_fr : featuredArticle.title_en || featuredArticle.title_fr}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent-light)]/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark/10" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full bg-[var(--brand-accent-light)] text-[var(--brand-primary)] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                        {isFr ? "À la une" : "Featured"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-10 md:pr-12">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[var(--brand-primary)]/8 text-[var(--brand-primary)] text-[11px] font-semibold">
                        {featuredArticle.category}
                      </span>
                      <time className="text-xs text-dark/40 dark:text-cream-light/40 font-medium">
                        {new Date(featuredArticle.published_at || featuredArticle.created_at || "").toLocaleDateString(
                          locale,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-cream-light group-hover:text-brown dark:group-hover:text-peach transition-colors leading-tight mb-4">
                      {isFr ? featuredArticle.title_fr : featuredArticle.title_en || featuredArticle.title_fr}
                    </h2>
                    <p className="text-dark/50 dark:text-cream-light/50 text-base leading-relaxed mb-6 line-clamp-3">
                      {isFr ? featuredArticle.excerpt_fr : featuredArticle.excerpt_en || featuredArticle.excerpt_fr}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)] group-hover:gap-3 transition-all duration-300">
                      {isFr ? "Lire l'article" : "Read article"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              </Link>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="pb-24 md:pb-32 pt-8 bg-white dark:bg-dark">
        <div className="w-[94%] mx-auto">
          {restArticles.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {restArticles.map((article) => (
                <StaggerItem key={article.id}>
                  <HoverLift>
                    <Link
                      href={{
                        pathname: "/actualites/[slug]",
                        params: { slug: article.slug },
                      }}
                      className="group block"
                    >
                      <article className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(200,168,168,0.1)]">
                        <div className="p-3 sm:p-4">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-cream dark:bg-dark">
                            {article.cover_image_url ? (
                              <Image
                                src={article.cover_image_url}
                                alt={isFr ? article.title_fr : article.title_en || article.title_fr}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-cream to-cream-light dark:from-dark dark:to-dark-card" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1.5 rounded-full bg-cream-light/95 backdrop-blur-md text-[11px] font-semibold text-dark shadow-sm">
                                {article.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="px-5 sm:px-6 pb-6 pt-1">
                          <p className="text-xs text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)] mb-2 font-semibold uppercase tracking-wider">
                            {new Date(article.published_at || article.created_at || "").toLocaleDateString(
                              locale,
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </p>
                          <h3 className="text-base font-bold text-dark dark:text-cream-light group-hover:text-brown dark:group-hover:text-peach transition-colors line-clamp-2 mb-2.5 leading-snug">
                            {isFr ? article.title_fr : article.title_en || article.title_fr}
                          </h3>
                          <p className="text-sm text-dark/50 dark:text-cream-light/50 line-clamp-2 leading-relaxed">
                            {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brown dark:text-peach mt-4 group-hover:gap-2.5 transition-all duration-300">
                            {isFr ? "Lire la suite" : "Read more"}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : !featuredArticle ? (
            <div className="text-center py-20">
              <p className="text-dark/50 dark:text-cream-light/50">
                {isFr ? "Aucun article pour le moment." : "No articles yet."}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 bg-cream-light dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-accent-light)]/8 rounded-full blur-[180px]" />
        <div className="w-[94%] mx-auto relative z-10 text-center">
          <AnimateIn>
            <Mail className="w-10 h-10 text-[var(--brand-accent)]/40 mx-auto mb-6" />
            <h2 className="text-dark dark:text-cream-light tracking-tight mb-4">
              {isFr ? "Restez" : "Stay"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "informé" : "informed"}</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-dark/50 dark:text-cream-light/50 text-lg max-w-xl mx-auto mb-8">
              {isFr
                ? "Recevez nos dernières actualités et innovations directement dans votre boîte mail."
                : "Receive our latest news and innovations directly in your inbox."}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} y={15}>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={isFr ? "Votre adresse email" : "Your email address"}
                className="h-12 px-5 rounded-full bg-white border border-[var(--brand-primary)]/10 text-sm text-dark dark:text-cream-light placeholder:text-dark/35 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30 flex-1"
              />
              <button className="h-12 px-6 rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-colors duration-300 shrink-0">
                {isFr ? "S'inscrire" : "Subscribe"}
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
