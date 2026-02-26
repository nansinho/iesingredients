import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Newspaper, ArrowRight } from "lucide-react";
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

  const { data: articles } = await supabase
    .from("blog_articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Actualités" : "News", url: `https://ies-ingredients.com/${locale}/${isFr ? "actualites" : "news"}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-dark pt-32 sm:pt-36 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="w-[94%] mx-auto relative z-10">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Newspaper className="w-3.5 h-3.5" />
              Blog
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Nos" : "Our"}{" "}
              <span className="font-playfair italic text-peach">{isFr ? "Actualités" : "News"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream-light/50 text-lg max-w-2xl">
              {isFr
                ? "Dernières nouvelles et articles sur les ingrédients naturels, tendances et innovations."
                : "Latest news and articles about natural ingredients, trends and innovations."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="w-[94%] mx-auto">
          {articles && articles.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {articles.map((article: any) => (
                <StaggerItem key={article.id}>
                  <HoverLift>
                    <Link
                      href={{
                        pathname: "/actualites/[slug]",
                        params: { slug: article.slug },
                      }}
                      className="group block"
                    >
                      <article className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(216,138,160,0.1)]">
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
                          <p className="text-xs text-olive mb-2 font-semibold uppercase tracking-wider">
                            {new Date(article.published_at || article.created_at).toLocaleDateString(
                              locale,
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </p>
                          <h3 className="text-base font-bold text-dark dark:text-cream-light group-hover:text-brown transition-colors line-clamp-2 mb-2.5 leading-snug">
                            {isFr ? article.title_fr : article.title_en || article.title_fr}
                          </h3>
                          <p className="text-sm text-dark/50 dark:text-cream-light/50 line-clamp-2 leading-relaxed">
                            {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                          </p>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brown mt-4 group-hover:gap-2.5 transition-all duration-300">
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
          ) : (
            <div className="text-center py-20">
              <p className="text-dark/50 dark:text-cream-light/50">
                {isFr ? "Aucun article pour le moment." : "No articles yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
