import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Newspaper } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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
      <section className="bg-dark pt-28 sm:pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <Newspaper className="w-3.5 h-3.5" />
            Blog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
            {isFr ? "Nos" : "Our"}{" "}
            <span className="font-playfair italic text-peach">{isFr ? "Actualités" : "News"}</span>
          </h1>
          <p className="text-cream-light/50 text-lg max-w-2xl">
            {isFr
              ? "Dernières nouvelles et articles sur les ingrédients naturels, tendances et innovations."
              : "Latest news and articles about natural ingredients, trends and innovations."}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="max-w-[1400px] w-[90%] mx-auto">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={{
                    pathname: "/actualites/[slug]",
                    params: { slug: article.slug },
                  }}
                  className="group block"
                >
                  <article className="rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10 hover:shadow-xl transition-all duration-500 bg-cream-light dark:bg-dark-card">
                    <div className="relative aspect-[16/10] bg-cream dark:bg-dark">
                      {article.cover_image_url ? (
                        <Image
                          src={article.cover_image_url}
                          alt={isFr ? article.title_fr : article.title_en || article.title_fr}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cream to-cream-light dark:from-dark dark:to-dark-card" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-dark text-peach">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <time className="text-xs text-dark/40 dark:text-cream-light/40">
                        {new Date(article.published_at || article.created_at).toLocaleDateString(
                          locale,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                      <h3 className="font-semibold text-xl text-dark dark:text-cream-light mt-2 mb-3 group-hover:text-brown dark:group-hover:text-peach transition-colors line-clamp-2">
                        {isFr ? article.title_fr : article.title_en || article.title_fr}
                      </h3>
                      <p className="text-dark/50 dark:text-cream-light/50 text-sm line-clamp-3">
                        {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
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
