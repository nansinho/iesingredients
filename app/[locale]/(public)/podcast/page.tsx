import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Headphones, Play, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import type { EpisodeData } from "@/components/podcast/EpisodeCard";

const episodes: Omit<EpisodeData, "title" | "guest" | "description">[] = [
  {
    id: 1,
    episodeNumber: 1,
    duration: "32:15",
    date: "2025-03-15",
    image: "/images/essential-oil.jpg",
    audioUrl: "/audio/episode-1.mp3",
  },
  {
    id: 2,
    episodeNumber: 2,
    duration: "28:40",
    date: "2025-02-20",
    image: "/images/botanicals-flat.jpg",
    audioUrl: "/audio/episode-2.mp3",
  },
  {
    id: 3,
    episodeNumber: 3,
    duration: "35:50",
    date: "2025-01-18",
    image: "/images/cream-bowl.jpg",
    audioUrl: "/audio/episode-3.mp3",
  },
  {
    id: 4,
    episodeNumber: 4,
    duration: "41:22",
    date: "2024-12-12",
    image: "/images/hero-botanical.jpg",
    audioUrl: "/audio/episode-4.mp3",
  },
  {
    id: 5,
    episodeNumber: 5,
    duration: "26:18",
    date: "2024-11-08",
    image: "/images/blueberries-herbs.jpg",
    audioUrl: "/audio/episode-5.mp3",
  },
  {
    id: 6,
    episodeNumber: 6,
    duration: "37:05",
    date: "2024-10-15",
    image: "/images/leaves-hero.jpg",
    audioUrl: "/audio/episode-6.mp3",
  },
];

const episodeTranslations = {
  fr: [
    {
      title: "L'art de la parfumerie naturelle",
      guest: "Marie Laurent, Nez parfumeur",
      description:
        "Découvrez les secrets de la création de parfums à partir d'ingrédients naturels avec l'une des plus grandes parfumeuses de France.",
    },
    {
      title: "Les huiles essentielles de Madagascar",
      guest: "Jean-Pierre Rakoto, Producteur",
      description:
        "Voyage au cœur de Madagascar pour comprendre la production d'huiles essentielles rares et précieuses.",
    },
    {
      title: "Innovation et cosmétique bio",
      guest: "Sophie Delatour, Directrice R&D",
      description:
        "Comment l'innovation technologique transforme l'industrie cosmétique bio et les formulations naturelles.",
    },
    {
      title: "Du champ au flacon",
      guest: "Pierre Moreau, Agriculteur bio",
      description:
        "Le parcours fascinant des ingrédients naturels, de la récolte à la formulation finale.",
    },
    {
      title: "Les tendances parfumerie 2025",
      guest: "Camille Duval, Analyste de marché",
      description:
        "Quelles sont les grandes tendances qui vont façonner l'industrie de la parfumerie cette année ?",
    },
    {
      title: "Durabilité et sourcing éthique",
      guest: "Amina Benali, Experte RSE",
      description:
        "L'importance du sourcing éthique et durable dans l'industrie des ingrédients naturels.",
    },
  ],
  en: [
    {
      title: "The art of natural perfumery",
      guest: "Marie Laurent, Perfumer",
      description:
        "Discover the secrets of creating perfumes from natural ingredients with one of France's greatest perfumers.",
    },
    {
      title: "Essential oils from Madagascar",
      guest: "Jean-Pierre Rakoto, Producer",
      description:
        "Journey to the heart of Madagascar to understand the production of rare and precious essential oils.",
    },
    {
      title: "Innovation and organic cosmetics",
      guest: "Sophie Delatour, R&D Director",
      description:
        "How technological innovation is transforming the organic cosmetics industry and natural formulations.",
    },
    {
      title: "From field to bottle",
      guest: "Pierre Moreau, Organic farmer",
      description:
        "The fascinating journey of natural ingredients, from harvest to final formulation.",
    },
    {
      title: "Perfumery trends 2025",
      guest: "Camille Duval, Market analyst",
      description:
        "What are the major trends shaping the perfumery industry this year?",
    },
    {
      title: "Sustainability and ethical sourcing",
      guest: "Amina Benali, CSR Expert",
      description:
        "The importance of ethical and sustainable sourcing in the natural ingredients industry.",
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description =
    locale === "fr"
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
  const translations = isFr ? episodeTranslations.fr : episodeTranslations.en;

  const localizedEpisodes: EpisodeData[] = episodes.map((ep, i) => ({
    ...ep,
    title: translations[i].title,
    guest: translations[i].guest,
    description: translations[i].description,
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          {
            name: "IES Ingredients",
            url: `https://ies-ingredients.com/${locale}`,
          },
          {
            name: "Podcast",
            url: `https://ies-ingredients.com/${locale}/podcast`,
          },
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
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
        </ParallaxBackground>

        <div className="relative z-10 w-[94%] mx-auto pb-20 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-8 backdrop-blur-sm">
              <Headphones className="w-3.5 h-3.5" />
              Podcast
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Notre" : "Our"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">
                Podcast
              </span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("subtitle")}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3} y={15}>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="peach" size="lg">
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

      {/* About the Podcast */}
      <section className="py-20 md:py-28 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/3 rounded-full blur-[150px]" />
        <div className="w-[94%] mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <AnimateIn y={30}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--brand-accent-light)] to-[var(--brand-accent)] p-1">
                <div className="w-full h-full rounded-3xl bg-white dark:bg-cream-light flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-accent-light)]/20 to-[var(--brand-primary)]/5" />
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center mx-auto mb-6">
                      <Headphones className="w-12 h-12 text-[var(--brand-primary)]" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--brand-primary)] mb-1">
                      À Fleur De Nez
                    </p>
                    <p className="text-[var(--brand-primary)]/40 text-sm uppercase tracking-widest">
                      Podcast
                    </p>
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
              <span className="font-playfair italic text-[var(--brand-accent)]">
                {isFr ? "Parfumerie" : "Perfumery"}
              </span>
            </h2>
            <div className="space-y-4 text-dark/60 dark:text-cream-light/50 text-lg leading-relaxed">
              <p>
                {isFr
                  ? "Notre podcast \"À Fleur De Nez\" explore l'univers de la parfumerie à travers des interviews passionnantes avec les acteurs de l'industrie."
                  : 'Our podcast "À Fleur De Nez" explores the world of perfumery through exciting interviews with industry professionals.'}
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

      {/* Episodes */}
      <section className="py-20 md:py-28 bg-cream-light dark:bg-dark relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-accent-light)]/8 rounded-full blur-[180px]" />
        <div className="w-[94%] mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              {isFr ? "Tous les épisodes" : "All episodes"}
            </span>
            <h2 className="text-dark dark:text-cream-light tracking-tight">
              {isFr ? "Derniers" : "Latest"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">
                {isFr ? "Épisodes" : "Episodes"}
              </span>
            </h2>
          </AnimateIn>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {localizedEpisodes.map((episode) => (
              <StaggerItem key={episode.id}>
                <EpisodeCard episode={episode} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-20 md:py-28 bg-white dark:bg-dark">
        <div className="max-w-xl mx-auto text-center px-4">
          <AnimateIn>
            <Mail className="w-10 h-10 text-[var(--brand-accent)]/40 mx-auto mb-6" />
            <h2 className="text-dark dark:text-cream-light tracking-tight mb-4">
              {isFr ? "Soyez" : "Get"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">
                {isFr ? "notifié" : "notified"}
              </span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-dark/50 dark:text-cream-light/50 text-lg mb-8">
              {isFr
                ? "Recevez une notification dès la sortie d'un nouvel épisode."
                : "Get notified as soon as a new episode is released."}
            </p>
          </AnimateIn>
          <AnimateIn delay={0.2} y={15}>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder={
                  isFr ? "Votre adresse email" : "Your email address"
                }
                className="h-12 px-5 rounded-full bg-cream-light dark:bg-dark-card border border-brown/10 dark:border-brown/15 text-sm text-dark dark:text-cream-light placeholder:text-dark/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30 flex-1"
              />
              <Button
                variant="peach"
                size="lg"
                className="rounded-full shrink-0"
              >
                {isFr ? "M'inscrire" : "Subscribe"}
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
