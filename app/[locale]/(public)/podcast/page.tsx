import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Headphones, Play, ExternalLink, Mic, TrendingUp, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const features = [
  {
    icon: Mic,
    titleFr: "Interviews exclusives",
    titleEn: "Exclusive interviews",
    descFr: "Rencontrez les acteurs clés de l'industrie de la parfumerie et des ingrédients naturels.",
    descEn: "Meet the key players in the perfumery and natural ingredients industry.",
  },
  {
    icon: TrendingUp,
    titleFr: "Tendances du marché",
    titleEn: "Market trends",
    descFr: "Découvrez les dernières innovations et tendances qui façonnent notre industrie.",
    descEn: "Discover the latest innovations and trends shaping our industry.",
  },
  {
    icon: Sparkles,
    titleFr: "Coulisses du métier",
    titleEn: "Behind the scenes",
    descFr: "Plongez dans les coulisses de la création d'ingrédients et de parfums d'exception.",
    descEn: "Dive behind the scenes of creating exceptional ingredients and perfumes.",
  },
];

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

      {/* Hero — Immersive with background image */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/essential-oil.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] via-[var(--brand-primary)]/75 to-[var(--brand-primary)]/40" />
        </div>

        <div className="relative z-10 w-[94%] mx-auto pb-20 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-8 backdrop-blur-sm">
              <Headphones className="w-3.5 h-3.5" />
              Podcast
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {t("title")}
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("subtitle")}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3} y={15}>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="peach"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {t("listenOn")} Spotify
              </Button>
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30 transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Apple Podcasts
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Podcast Info — 2 columns */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/3 rounded-full blur-[150px]" />
        <div className="w-[94%] mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <AnimateIn y={30}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] p-1">
                <div className="w-full h-full rounded-3xl bg-[var(--brand-primary)] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-accent-light)]/10 to-transparent" />
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 rounded-full bg-[var(--brand-accent-light)]/15 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
                      <Headphones className="w-12 h-12 text-[var(--brand-accent-light)]" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">À Fleur De Nez</p>
                    <p className="text-white/40 text-sm uppercase tracking-widest">Podcast</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.15} y={30}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brown/8 border border-brown/12 text-brown text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              {isFr ? "À propos" : "About"}
            </span>
            <h2 className="text-dark dark:text-cream-light tracking-tight mt-4 mb-6">
              {isFr ? "Explorez l'univers de la" : "Explore the world of"}{" "}
              <span className="font-playfair italic text-brown dark:text-peach">{isFr ? "Parfumerie" : "Perfumery"}</span>
            </h2>
            <div className="space-y-4 text-dark/60 dark:text-cream-light/50 text-lg leading-relaxed">
              <p>
                {isFr
                  ? "Notre podcast \"À Fleur De Nez\" explore l'univers de la parfumerie à travers des interviews passionnantes avec les acteurs de l'industrie."
                  : "Our podcast \"À Fleur De Nez\" explores the world of perfumery through exciting interviews with industry professionals."}
              </p>
              <p>
                {isFr
                  ? "De la sélection des matières premières à la création de compositions uniques, découvrez les secrets des maîtres parfumeurs et des experts en ingrédients naturels."
                  : "From raw material selection to creating unique compositions, discover the secrets of master perfumers and natural ingredient experts."}
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Features — Why Listen */}
      <section className="py-24 md:py-32 bg-[var(--brand-primary)] relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-secondary)]/20 rounded-full blur-[180px]" />
        <div className="w-[94%] mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-5 backdrop-blur-sm">
              {isFr ? "Pourquoi écouter" : "Why listen"}
            </span>
            <h2 className="text-cream-light tracking-tight">
              {isFr ? "Ce que vous" : "What you'll"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">{isFr ? "découvrirez" : "discover"}</span>
            </h2>
          </AnimateIn>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {features.map((feature) => (
              <StaggerItem key={feature.titleFr}>
                <HoverLift>
                  <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-7 border border-white/[0.08] hover:border-[var(--brand-accent-light)]/30 hover:bg-white/[0.10] transition-all duration-500 text-center group">
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-accent-light)]/15 border border-[var(--brand-accent-light)]/25 flex items-center justify-center mx-auto mb-5 group-hover:bg-[var(--brand-accent-light)]/25 group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-5 h-5 text-[var(--brand-accent-light)]" />
                    </div>
                    <h3 className="font-bold text-cream-light mb-2 text-base">
                      {isFr ? feature.titleFr : feature.titleEn}
                    </h3>
                    <p className="text-sm text-cream-light/40 leading-relaxed">
                      {isFr ? feature.descFr : feature.descEn}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="max-w-xl mx-auto text-center px-4">
          <AnimateIn>
            <Mail className="w-10 h-10 text-[var(--brand-accent)]/40 mx-auto mb-6" />
            <h2 className="text-dark dark:text-cream-light tracking-tight mb-4">
              {isFr ? "Soyez" : "Get"}{" "}
              <span className="font-playfair italic text-brown dark:text-peach">{isFr ? "notifié" : "notified"}</span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-dark/50 dark:text-cream-light/50 text-lg mb-8">
              {isFr
                ? "Recevez une notification dès la sortie du premier épisode."
                : "Get notified as soon as the first episode is released."}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} y={15}>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder={isFr ? "Votre adresse email" : "Your email address"}
                className="h-12 px-5 rounded-full bg-cream-light dark:bg-dark-card border border-brown/10 dark:border-brown/15 text-sm text-dark dark:text-cream-light placeholder:text-dark/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30 flex-1"
              />
              <Button variant="peach" size="lg" className="rounded-full shrink-0">
                {isFr ? "M'inscrire" : "Subscribe"}
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
