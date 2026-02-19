import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("newsTitle"),
    alternates: {
      canonical: `/${locale}/actualites`,
      languages: { fr: "/fr/actualites", en: "/en/news" },
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
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-16">
        <div className="container-luxe">
          <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
            Blog
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {isFr ? "Actualités" : "News"}
          </h1>
          <p className="text-cream-200 text-lg max-w-2xl">
            {isFr
              ? "Dernières nouvelles et articles sur les ingrédients naturels, tendances et innovations."
              : "Latest news and articles about natural ingredients, trends and innovations."}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any) => (
                <Link
                  key={article.id}
                  href={{
                    pathname: "/actualites/[slug]",
                    params: { slug: article.slug },
                  }}
                  className="group block"
                >
                  <article className="rounded-2xl overflow-hidden border border-forest-100 hover:shadow-xl transition-shadow">
                    <div className="relative aspect-[16/10] bg-forest-50">
                      {article.cover_image_url ? (
                        <Image
                          src={article.cover_image_url}
                          alt={isFr ? article.title_fr : article.title_en || article.title_fr}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forest-100 to-forest-200" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-forest-900 text-gold-400">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <time className="text-xs text-forest-500">
                        {new Date(article.published_at || article.created_at).toLocaleDateString(
                          locale,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </time>
                      <h3 className="font-serif text-xl text-forest-900 mt-2 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                        {isFr ? article.title_fr : article.title_en || article.title_fr}
                      </h3>
                      <p className="text-forest-600 text-sm line-clamp-3">
                        {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-forest-600">
                {isFr ? "Aucun article pour le moment." : "No articles yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
