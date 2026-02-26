import { getTranslations } from "next-intl/server";
import { Headphones, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = locale === "fr"
    ? "Écoutez notre podcast À Fleur De Nez : interviews et découvertes de l'univers de la parfumerie et des ingrédients naturels."
    : "Listen to our podcast À Fleur De Nez: interviews and discoveries from the world of perfumery and natural ingredients.";

  return {
    title: t("podcastTitle"),
    description,
    alternates: {
      canonical: `/${locale}/podcast`,
      languages: { fr: "/fr/podcast", en: "/en/podcast" },
    },
    openGraph: {
      title: t("podcastTitle"),
      description,
      url: `https://ies-ingredients.com/${locale}/podcast`,
      type: "website",
    },
  };
}

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const t = await getTranslations({ locale, namespace: "podcast" });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: "Podcast", url: `https://ies-ingredients.com/${locale}/podcast` },
        ]}
      />

      {/* Hero */}
      <section className="bg-dark pt-32 sm:pt-36 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-8">
            <Headphones className="w-3.5 h-3.5" />
            Podcast
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
            {t("title")}
          </h1>
          <p className="text-cream-light/50 text-lg max-w-2xl mx-auto mb-10">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-peach hover:bg-peach-dark text-dark rounded-full px-8 font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              {t("listenOn")} Spotify
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cream-light/20 text-cream-light hover:bg-cream-light/10 rounded-full px-8"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Apple Podcasts
            </Button>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="w-20 h-20 rounded-full bg-cream dark:bg-dark-card flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-10 h-10 text-brown dark:text-peach" />
          </div>
          <h2 className="font-semibold text-3xl md:text-4xl text-dark dark:text-cream-light mb-4">
            {isFr ? "Épisodes à venir" : "Episodes coming soon"}
          </h2>
          <p className="text-dark/60 dark:text-cream-light/50 text-lg leading-relaxed">
            {isFr
              ? "Notre podcast \"À Fleur De Nez\" explore l'univers de la parfumerie à travers des interviews passionnantes avec les acteurs de l'industrie. Les épisodes seront bientôt disponibles."
              : "Our podcast \"À Fleur De Nez\" explores the world of perfumery through exciting interviews with industry professionals. Episodes will be available soon."}
          </p>
        </div>
      </section>
    </>
  );
}
