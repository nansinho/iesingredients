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
  return {
    title: t("podcastTitle"),
    alternates: {
      canonical: `/${locale}/podcast`,
      languages: { fr: "/fr/podcast", en: "/en/podcast" },
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
      <section className="bg-gradient-to-b from-forest-950 to-forest-900 pt-28 sm:pt-32 pb-20">
        <div className="container-luxe text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 mb-8">
            <Headphones className="w-4 h-4" />
            <span className="text-sm font-medium">Podcast</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-cream-200 text-lg max-w-2xl mx-auto mb-10">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gold-500 hover:bg-gold-400 text-forest-900 rounded-full px-8 font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              {t("listenOn")} Spotify
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Apple Podcasts
            </Button>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-10 h-10 text-forest-400" />
          </div>
          <h2 className="font-serif text-3xl text-forest-900 mb-4">
            {isFr ? "Épisodes à venir" : "Episodes coming soon"}
          </h2>
          <p className="text-forest-600 text-lg leading-relaxed">
            {isFr
              ? "Notre podcast \"À Fleur De Nez\" explore l'univers de la parfumerie à travers des interviews passionnantes avec les acteurs de l'industrie. Les épisodes seront bientôt disponibles."
              : "Our podcast \"À Fleur De Nez\" explores the world of perfumery through exciting interviews with industry professionals. Episodes will be available soon."}
          </p>
        </div>
      </section>
    </>
  );
}
