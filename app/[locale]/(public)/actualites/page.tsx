import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { Link } from "@/i18n/routing";
import { Newspaper, ArrowRight, Mail, Clock, Tag } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";

// Fake articles for demo when DB is empty
const fakeArticles = [
  {
    id: "fake-1",
    slug: "tendances-cosmetiques-naturelles-2024",
    title_fr: "Les tendances cosmétiques naturelles en 2024",
    title_en: "Natural Cosmetic Trends in 2024",
    excerpt_fr: "Découvrez les ingrédients stars de cette année : bakuchiol, niacinamide naturelle, et extraits de champignons adaptogènes. Le marché de la beauté naturelle n'a jamais été aussi innovant.",
    excerpt_en: "Discover this year's star ingredients: bakuchiol, natural niacinamide, and adaptogenic mushroom extracts. The natural beauty market has never been more innovative.",
    content_fr: "",
    content_en: "",
    cover_image_url: null,
    category: "Cosmétique",
    published_at: "2024-11-15T10:00:00Z",
    created_at: "2024-11-15T10:00:00Z",
    published: true,
    author: null,
    reading_time: 5,
    gradient: "from-cosmetique/20 to-cosmetique-light/30",
  },
  {
    id: "fake-2",
    slug: "art-parfumerie-tradition-innovation",
    title_fr: "L'art de la parfumerie : entre tradition et innovation",
    title_en: "The Art of Perfumery: Between Tradition and Innovation",
    excerpt_fr: "Comment les maisons de parfumerie allient savoir-faire ancestral et technologies de pointe pour créer les fragrances de demain. Un voyage au cœur de la création olfactive.",
    excerpt_en: "How perfume houses combine ancestral expertise with cutting-edge technologies to create tomorrow's fragrances. A journey into the heart of olfactory creation.",
    content_fr: "",
    content_en: "",
    cover_image_url: null,
    category: "Parfumerie",
    published_at: "2024-10-28T10:00:00Z",
    created_at: "2024-10-28T10:00:00Z",
    published: true,
    author: null,
    reading_time: 7,
    gradient: "from-parfum/20 to-parfum-light/30",
  },
  {
    id: "fake-3",
    slug: "certification-cosmos-importance",
    title_fr: "Ingrédients bio : pourquoi la certification COSMOS compte",
    title_en: "Organic Ingredients: Why COSMOS Certification Matters",
    excerpt_fr: "La certification COSMOS est devenue un standard incontournable dans l'industrie cosmétique. Décryptage des critères et de son importance pour la confiance des consommateurs.",
    excerpt_en: "COSMOS certification has become an essential standard in the cosmetics industry. Decoding the criteria and its importance for consumer trust.",
    content_fr: "",
    content_en: "",
    cover_image_url: null,
    category: "Certifications",
    published_at: "2024-10-10T10:00:00Z",
    created_at: "2024-10-10T10:00:00Z",
    published: true,
    author: null,
    reading_time: 4,
    gradient: "from-brand-primary/15 to-brand-accent-light/25",
  },
  {
    id: "fake-4",
    slug: "givaudan-ies-partenariat-30-ans",
    title_fr: "Givaudan et IES : un partenariat de 30 ans",
    title_en: "Givaudan and IES: A 30-Year Partnership",
    excerpt_fr: "Retour sur trois décennies de collaboration entre Givaudan et IES Ingredients. De la distribution locale à une présence internationale, l'histoire d'un partenariat durable.",
    excerpt_en: "Looking back at three decades of collaboration between Givaudan and IES Ingredients. From local distribution to an international presence, the story of a lasting partnership.",
    content_fr: "",
    content_en: "",
    cover_image_url: null,
    category: "Partenariat",
    published_at: "2024-09-20T10:00:00Z",
    created_at: "2024-09-20T10:00:00Z",
    published: true,
    author: null,
    reading_time: 6,
    gradient: "from-arome/20 to-arome-light/30",
  },
  {
    id: "fake-5",
    slug: "extraits-vegetaux-cosmetique-moderne",
    title_fr: "Les extraits végétaux dans la cosmétique moderne",
    title_en: "Plant Extracts in Modern Cosmetics",
    excerpt_fr: "Des huiles essentielles aux actifs biotechnologiques, les extraits végétaux sont au cœur de la formulation cosmétique contemporaine. Tour d'horizon des dernières innovations.",
    excerpt_en: "From essential oils to biotechnological actives, plant extracts are at the heart of contemporary cosmetic formulation. An overview of the latest innovations.",
    content_fr: "",
    content_en: "",
    cover_image_url: null,
    category: "Innovation",
    published_at: "2024-09-05T10:00:00Z",
    created_at: "2024-09-05T10:00:00Z",
    published: true,
    author: null,
    reading_time: 5,
    gradient: "from-cosmetique/15 to-cosmetique-light/25",
  },
  {
    id: "fake-6",
    slug: "distribution-ingredients-emea",
    title_fr: "Distribution d'ingrédients en zone EMEA : défis et opportunités",
    title_en: "Ingredient Distribution in the EMEA Zone: Challenges and Opportunities",
    excerpt_fr: "Le marché de la distribution d'ingrédients en Europe, Moyen-Orient et Afrique est en pleine mutation. Analyse des tendances et des opportunités pour les acteurs du secteur.",
    excerpt_en: "The ingredient distribution market in Europe, Middle East and Africa is undergoing major changes. Analysis of trends and opportunities for industry players.",
    content_fr: "",
    content_en: "",
    cover_image_url: null,
    category: "Distribution",
    published_at: "2024-08-18T10:00:00Z",
    created_at: "2024-08-18T10:00:00Z",
    published: true,
    author: null,
    reading_time: 8,
    gradient: "from-parfum/15 to-parfum-light/25",
  },
];

// Fallback colors for fake articles
const fallbackCategoryColors: Record<string, string> = {
  "Cosmétique": "bg-cosmetique/10 text-cosmetique-dark border-cosmetique/20",
  "Parfumerie": "bg-parfum/10 text-parfum-dark border-parfum/20",
  "Certifications": "bg-brand-primary/10 text-brand-primary border-brand-primary/15",
  "Partenariat": "bg-arome/10 text-arome-dark border-arome/20",
  "Innovation": "bg-cosmetique/10 text-cosmetique-dark border-cosmetique/20",
  "Distribution": "bg-parfum/10 text-parfum-dark border-parfum/20",
};

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
  // Fallback for fake article categories
  const fallback = fallbackCategoryColors[category];
  if (fallback) {
    return { style: undefined, className: fallback };
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

  // Use DB articles if available, otherwise fall back to fake articles
  const allArticles = dbArticles.length > 0 ? dbArticles : fakeArticles;
  const featuredArticle = allArticles[0];
  const restArticles = allArticles.slice(1);
  const isFakeData = dbArticles.length === 0;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Actualités" : "News", url: `https://ies-ingredients.com/${locale}/${isFr ? "actualites" : "news"}` },
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <Image
            src="/images/cream-bowl.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/75 to-brand-primary/40" />
        </ParallaxBackground>

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto pb-20 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-[0.15em] mb-5 backdrop-blur-sm">
              <Newspaper className="w-3.5 h-3.5" />
              Blog
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Nos" : "Our"}{" "}
              <span className="font-playfair italic text-white">{isFr ? "Actualités" : "News"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? "Dernières nouvelles et articles sur les ingrédients naturels, tendances et innovations."
                : "Latest news and articles about natural ingredients, trends and innovations."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-20 md:py-28 bg-white">
          <div className="w-[94%] max-w-7xl mx-auto">
            <AnimateIn>
              {isFakeData ? (
                <article className="group block">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-[var(--color-cream-light)] rounded-3xl overflow-hidden border border-[var(--color-cream)] hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
                    <div className="relative aspect-[16/10] md:aspect-auto md:h-full min-h-[300px] overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-br ${(featuredArticle as (typeof fakeArticles)[0]).gradient || "from-cream to-cream-light"}`} />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-brand-accent text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          {isFr ? "À la une" : "Featured"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-10 md:pr-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getCategoryStyle(featuredArticle.category || "", dbCategories).className}`} style={getCategoryStyle(featuredArticle.category || "", dbCategories).style}>
                          {getCategoryLabel(featuredArticle.category || "", locale, dbCategories)}
                        </span>
                        <time className="text-xs text-dark/40 font-medium">
                          {new Date(featuredArticle.published_at || featuredArticle.created_at || "").toLocaleDateString(
                            locale,
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </time>
                        <span className="flex items-center gap-1 text-xs text-dark/40">
                          <Clock className="w-3 h-3" />
                          {(featuredArticle as (typeof fakeArticles)[0]).reading_time || 5} min
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-dark group-hover:text-brand-accent transition-colors leading-tight mb-4">
                        {isFr ? featuredArticle.title_fr : featuredArticle.title_en || featuredArticle.title_fr}
                      </h2>
                      <p className="text-dark/50 text-base leading-relaxed mb-6 line-clamp-3">
                        {isFr ? featuredArticle.excerpt_fr : featuredArticle.excerpt_en || featuredArticle.excerpt_fr}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
                        {isFr ? "Lire l'article" : "Read article"}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ) : (
                <Link
                  href={{
                    pathname: "/actualites/[slug]",
                    params: { slug: (featuredArticle as BlogArticle).slug },
                  }}
                  className="group block"
                >
                  <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-[var(--color-cream-light)] rounded-3xl overflow-hidden border border-[var(--color-cream)] hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
                    <div className="relative aspect-[16/10] md:aspect-auto md:h-full min-h-[300px] overflow-hidden">
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
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark/10" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-brand-accent text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                          {isFr ? "À la une" : "Featured"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-10 md:pr-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getCategoryStyle(featuredArticle.category || "", dbCategories).className}`} style={getCategoryStyle(featuredArticle.category || "", dbCategories).style}>
                          {getCategoryLabel(featuredArticle.category || "", locale, dbCategories)}
                        </span>
                        <time className="text-xs text-dark/40 font-medium">
                          {new Date(featuredArticle.published_at || featuredArticle.created_at || "").toLocaleDateString(
                            locale,
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </time>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-dark group-hover:text-brand-accent transition-colors leading-tight mb-4">
                        {isFr ? featuredArticle.title_fr : featuredArticle.title_en || featuredArticle.title_fr}
                      </h2>
                      <p className="text-dark/50 text-base leading-relaxed mb-6 line-clamp-3">
                        {isFr ? featuredArticle.excerpt_fr : featuredArticle.excerpt_en || featuredArticle.excerpt_fr}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary group-hover:gap-3 transition-all duration-300">
                        {isFr ? "Lire l'article" : "Read article"}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              )}
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      {restArticles.length > 0 && (
        <section className="pb-24 md:pb-32 pt-8 bg-white">
          <div className="w-[94%] max-w-7xl mx-auto">
            {/* Section header */}
            <AnimateIn className="mb-10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-dark tracking-tight">
                  {isFr ? "Tous les articles" : "All articles"}
                </h2>
                <div className="flex-1 h-px bg-dark/6" />
                <span className="text-sm text-dark/40 font-medium">
                  {restArticles.length} {isFr ? "articles" : "articles"}
                </span>
              </div>
            </AnimateIn>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {restArticles.map((article) => {
                const fakeData = article as (typeof fakeArticles)[0];
                const dbData = article as BlogArticle;
                const isCurrentFake = isFakeData;

                return (
                  <StaggerItem key={article.id}>
                    <HoverLift>
                      {isCurrentFake ? (
                        <article className="group block bg-white rounded-2xl overflow-hidden border border-[var(--color-cream)] hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                          <div className="p-3 sm:p-4">
                            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--color-cream-light)]">
                              <div className={`w-full h-full bg-gradient-to-br ${fakeData.gradient || "from-cream to-cream-light"}`} />
                              <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${getCategoryStyle(article.category || "", dbCategories).className}`} style={getCategoryStyle(article.category || "", dbCategories).style}>
                                  {getCategoryLabel(article.category || "", locale, dbCategories)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="px-5 sm:px-6 pb-6 pt-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-xs text-brand-accent font-semibold uppercase tracking-wider">
                                {new Date(article.published_at || article.created_at || "").toLocaleDateString(
                                  locale,
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </p>
                              <span className="flex items-center gap-1 text-xs text-dark/35">
                                <Clock className="w-3 h-3" />
                                {fakeData.reading_time || 5} min
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-dark group-hover:text-brand-accent transition-colors line-clamp-2 mb-2.5 leading-snug">
                              {isFr ? article.title_fr : article.title_en || article.title_fr}
                            </h3>
                            <p className="text-sm text-dark/50 line-clamp-2 leading-relaxed">
                              {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-charcoal)] mt-4 group-hover:gap-2.5 transition-all duration-300">
                              {isFr ? "Lire la suite" : "Read more"}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </article>
                      ) : (
                        <Link
                          href={{
                            pathname: "/actualites/[slug]",
                            params: { slug: (dbData).slug },
                          }}
                          className="group block"
                        >
                          <article className="bg-white rounded-2xl overflow-hidden border border-[var(--color-cream)] hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                            <div className="p-3 sm:p-4">
                              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--color-cream-light)]">
                                {dbData.cover_image_url ? (
                                  <Image
                                    src={dbData.cover_image_url}
                                    alt={isFr ? article.title_fr : article.title_en || article.title_fr}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-cream-light)] to-[var(--color-cream)]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                                <div className="absolute top-3 left-3">
                                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${getCategoryStyle(article.category || "", dbCategories).className}`} style={getCategoryStyle(article.category || "", dbCategories).style}>
                                    {getCategoryLabel(article.category || "", locale, dbCategories)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="px-5 sm:px-6 pb-6 pt-1">
                              <p className="text-xs text-brand-accent mb-2 font-semibold uppercase tracking-wider">
                                {new Date(article.published_at || article.created_at || "").toLocaleDateString(
                                  locale,
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </p>
                              <h3 className="text-base font-bold text-dark group-hover:text-brand-accent transition-colors line-clamp-2 mb-2.5 leading-snug">
                                {isFr ? article.title_fr : article.title_en || article.title_fr}
                              </h3>
                              <p className="text-sm text-dark/50 line-clamp-2 leading-relaxed">
                                {isFr ? article.excerpt_fr : article.excerpt_en || article.excerpt_fr}
                              </p>
                              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-charcoal)] mt-4 group-hover:gap-2.5 transition-all duration-300">
                                {isFr ? "Lire la suite" : "Read more"}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </article>
                        </Link>
                      )}
                    </HoverLift>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 bg-[var(--color-cream-light)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[180px]" />
        <div className="w-[94%] max-w-7xl mx-auto relative z-10 text-center">
          <AnimateIn>
            <Mail className="w-10 h-10 text-brand-accent/40 mx-auto mb-6" />
            <h2 className="text-dark tracking-tight mb-4">
              {isFr ? "Restez" : "Stay"}{" "}
              <span className="font-playfair italic text-brand-accent">{isFr ? "informé" : "informed"}</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-dark/50 text-lg max-w-xl mx-auto mb-8">
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
                className="h-12 px-5 rounded-full bg-white border border-brand-primary/10 text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 flex-1"
              />
              <button className="h-12 px-6 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-[var(--color-charcoal)] transition-colors duration-300 shrink-0">
                {isFr ? "S'inscrire" : "Subscribe"}
              </button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
