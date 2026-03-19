import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Headphones,
  Play,
  ExternalLink,
  Mail,
  Mic,
  Users,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd, PodcastSeriesJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { PodcastPageClient } from "@/components/podcast/PodcastPageClient";
import type { EpisodeData } from "@/components/podcast/EpisodeCard";
import type { CollectionData } from "@/components/podcast/CollectionCard";

/* ─── Collections ─── */
const collectionsData: Record<string, { fr: CollectionData; en: CollectionData }> = {
  "artisans-parfum": {
    fr: {
      id: "artisans-parfum",
      title: "Les Artisans du Parfum",
      description:
        "Rencontrez les nez, parfumeurs et créateurs qui façonnent l'art olfactif. Savoir-faire, inspiration et passion.",
      image: "/images/essential-oil.jpg",
      episodeCount: 2,
      color: "#8B6A80",
    },
    en: {
      id: "artisans-parfum",
      title: "The Perfume Artisans",
      description:
        "Meet the noses, perfumers and creators who shape olfactory art. Craftsmanship, inspiration and passion.",
      image: "/images/essential-oil.jpg",
      episodeCount: 2,
      color: "#8B6A80",
    },
  },
  "terre-ingredients": {
    fr: {
      id: "terre-ingredients",
      title: "Terre d'Ingrédients",
      description:
        "Du champ au laboratoire : découvrez l'origine des matières premières naturelles et leur parcours jusqu'à vos produits.",
      image: "/images/botanicals-flat.jpg",
      episodeCount: 3,
      color: "#5B7B6B",
    },
    en: {
      id: "terre-ingredients",
      title: "Land of Ingredients",
      description:
        "From field to lab: discover the origin of natural raw materials and their journey to your products.",
      image: "/images/botanicals-flat.jpg",
      episodeCount: 3,
      color: "#5B7B6B",
    },
  },
  "lab-innovation": {
    fr: {
      id: "lab-innovation",
      title: "Lab & Innovation",
      description:
        "Comment la science et la technologie transforment l'industrie cosmétique et créent les formulations de demain.",
      image: "/images/cream-bowl.jpg",
      episodeCount: 1,
      color: "#4A7FB5",
    },
    en: {
      id: "lab-innovation",
      title: "Lab & Innovation",
      description:
        "How science and technology are transforming the cosmetics industry and creating tomorrow's formulations.",
      image: "/images/cream-bowl.jpg",
      episodeCount: 1,
      color: "#4A7FB5",
    },
  },
};

/* ─── Episodes ─── */
const episodes: Omit<
  EpisodeData,
  "title" | "guest" | "guestRole" | "description"
>[] = [
  {
    id: 1,
    episodeNumber: 1,
    duration: "32:15",
    date: "2025-03-15",
    image: "/images/essential-oil.jpg",
    audioUrl: "/audio/episode-1.mp3",
    category: "parfumerie",
    collection: "artisans-parfum",
  },
  {
    id: 2,
    episodeNumber: 2,
    duration: "28:40",
    date: "2025-02-20",
    image: "/images/botanicals-flat.jpg",
    audioUrl: "/audio/episode-2.mp3",
    category: "ingredients",
    collection: "terre-ingredients",
  },
  {
    id: 3,
    episodeNumber: 3,
    duration: "35:50",
    date: "2025-01-18",
    image: "/images/cream-bowl.jpg",
    audioUrl: "/audio/episode-3.mp3",
    category: "innovation",
    collection: "lab-innovation",
  },
  {
    id: 4,
    episodeNumber: 4,
    duration: "41:22",
    date: "2024-12-12",
    image: "/images/hero-botanical.jpg",
    audioUrl: "/audio/episode-4.mp3",
    category: "ingredients",
    collection: "terre-ingredients",
  },
  {
    id: 5,
    episodeNumber: 5,
    duration: "26:18",
    date: "2024-11-08",
    image: "/images/blueberries-herbs.jpg",
    audioUrl: "/audio/episode-5.mp3",
    category: "parfumerie",
    collection: "artisans-parfum",
  },
  {
    id: 6,
    episodeNumber: 6,
    duration: "37:05",
    date: "2024-10-15",
    image: "/images/leaves-hero.jpg",
    audioUrl: "/audio/episode-6.mp3",
    category: "durabilite",
    collection: "terre-ingredients",
  },
];

const episodeTranslations = {
  fr: [
    {
      title: "L'art de la parfumerie naturelle",
      guest: "Marie Laurent",
      guestRole: "Nez parfumeur",
      description:
        "Découvrez les secrets de la création de parfums à partir d'ingrédients naturels avec l'une des plus grandes parfumeuses de France.",
    },
    {
      title: "Les huiles essentielles de Madagascar",
      guest: "Jean-Pierre Rakoto",
      guestRole: "Producteur",
      description:
        "Voyage au cœur de Madagascar pour comprendre la production d'huiles essentielles rares et précieuses.",
    },
    {
      title: "Innovation et cosmétique bio",
      guest: "Sophie Delatour",
      guestRole: "Directrice R&D",
      description:
        "Comment l'innovation technologique transforme l'industrie cosmétique bio et les formulations naturelles.",
    },
    {
      title: "Du champ au flacon",
      guest: "Pierre Moreau",
      guestRole: "Agriculteur bio",
      description:
        "Le parcours fascinant des ingrédients naturels, de la récolte à la formulation finale.",
    },
    {
      title: "Les tendances parfumerie 2025",
      guest: "Camille Duval",
      guestRole: "Analyste de marché",
      description:
        "Quelles sont les grandes tendances qui vont façonner l'industrie de la parfumerie cette année ?",
    },
    {
      title: "Durabilité et sourcing éthique",
      guest: "Amina Benali",
      guestRole: "Experte RSE",
      description:
        "L'importance du sourcing éthique et durable dans l'industrie des ingrédients naturels.",
    },
  ],
  en: [
    {
      title: "The art of natural perfumery",
      guest: "Marie Laurent",
      guestRole: "Perfumer",
      description:
        "Discover the secrets of creating perfumes from natural ingredients with one of France's greatest perfumers.",
    },
    {
      title: "Essential oils from Madagascar",
      guest: "Jean-Pierre Rakoto",
      guestRole: "Producer",
      description:
        "Journey to the heart of Madagascar to understand the production of rare and precious essential oils.",
    },
    {
      title: "Innovation and organic cosmetics",
      guest: "Sophie Delatour",
      guestRole: "R&D Director",
      description:
        "How technological innovation is transforming the organic cosmetics industry and natural formulations.",
    },
    {
      title: "From field to bottle",
      guest: "Pierre Moreau",
      guestRole: "Organic farmer",
      description:
        "The fascinating journey of natural ingredients, from harvest to final formulation.",
    },
    {
      title: "Perfumery trends 2025",
      guest: "Camille Duval",
      guestRole: "Market analyst",
      description:
        "What are the major trends shaping the perfumery industry this year?",
    },
    {
      title: "Sustainability and ethical sourcing",
      guest: "Amina Benali",
      guestRole: "CSR Expert",
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
      ? "Écoutez le podcast IES Ingredients : interviews et découvertes de l'univers de la parfumerie et des ingrédients naturels."
      : "Listen to the IES Ingredients podcast: interviews and discoveries from the world of perfumery and natural ingredients.";

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
    guest: `${translations[i].guest}, ${translations[i].guestRole}`,
    guestRole: translations[i].guestRole,
    description: translations[i].description,
  }));

  const localizedCollections: CollectionData[] = Object.values(collectionsData).map(
    (c) => (isFr ? c.fr : c.en)
  );

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
      <PodcastSeriesJsonLd
        name="IES Ingredients Podcast"
        description={
          isFr
            ? "Explorez l'univers de la parfumerie et des ingrédients naturels à travers des interviews et des histoires captivantes."
            : "Explore the world of perfumery and natural ingredients through captivating interviews and stories."
        }
        url={`https://ies-ingredients.com/${locale}/podcast`}
        episodes={localizedEpisodes.map((ep) => ({
          title: ep.title,
          description: ep.description,
          url: `https://ies-ingredients.com/${locale}/podcast#episode-${ep.episodeNumber}`,
          duration: ep.duration,
          published: ep.date,
          episodeNumber: ep.episodeNumber,
        }))}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E1F3D]/95 via-[#2E1F3D]/80 to-[#2E1F3D]/50" />
        </ParallaxBackground>

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto py-32 md:py-40">
          <div className="max-w-2xl">
            <AnimateIn>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-6 backdrop-blur-sm">
                <Mic className="w-3.5 h-3.5" />
                Podcast IES Ingredients
              </span>
            </AnimateIn>

            <AnimateIn delay={0.1} y={30}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-[-0.03em] leading-[1.08] mb-6">
                {isFr
                  ? "Les voix de l'industrie des "
                  : "Voices from the "}
                <span className="font-playfair italic text-[var(--brand-accent-light)]">
                  {isFr ? "ingrédients naturels" : "natural ingredients industry"}
                </span>
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p className="text-white/55 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
                {isFr
                  ? "Interviews, expertises et coulisses : plongez dans l'univers de la parfumerie, de la cosmétique et des ingrédients naturels avec nos invités."
                  : "Interviews, expertise and behind-the-scenes: dive into the world of perfumery, cosmetics, and natural ingredients with our guests."}
              </p>
            </AnimateIn>

            <AnimateIn delay={0.3} y={15}>
              <div className="flex flex-wrap gap-3">
                <Button variant="peach" size="lg" className="rounded-full">
                  <Play className="w-5 h-5 mr-2" />
                  {t("listenOn")} Spotify
                </Button>
                <Button
                  size="lg"
                  className="rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/15 hover:bg-white/20 hover:border-white/25 transition-all duration-300"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Apple Podcasts
                </Button>
              </div>
            </AnimateIn>

            {/* Quick Stats */}
            <AnimateIn delay={0.4}>
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-[var(--brand-accent-light)]" />
                  </div>
                  <div>
                    <p className="text-white text-xl font-bold leading-none">
                      {episodes.length}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {isFr ? "Épisodes" : "Episodes"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--brand-accent-light)]" />
                  </div>
                  <div>
                    <p className="text-white text-xl font-bold leading-none">
                      6+
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {isFr ? "Invités" : "Guests"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Timer className="w-5 h-5 text-[var(--brand-accent-light)]" />
                  </div>
                  <div>
                    <p className="text-white text-xl font-bold leading-none">
                      3h+
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {isFr ? "De contenu" : "Of content"}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ─── Collections + Episodes Section ─── */}
      <section className="py-16 md:py-24 bg-cream-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-accent-light)]/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[var(--brand-primary)]/3 rounded-full blur-[200px]" />

        <div className="w-[94%] max-w-7xl mx-auto relative z-10">
          {/* Collections Header */}
          <AnimateIn className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/6 border border-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              {isFr ? "Nos collections" : "Our collections"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark tracking-tight">
              {isFr ? "Parcourez par" : "Browse by"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">
                {isFr ? "série" : "series"}
              </span>
            </h2>
            <p className="text-dark/45 text-lg mt-3 max-w-2xl">
              {isFr
                ? "Chaque collection regroupe des épisodes autour d'une thématique."
                : "Each collection groups episodes around a theme."}
            </p>
          </AnimateIn>

          {/* Client-side interactive part */}
          <PodcastPageClient
            collections={localizedCollections}
            episodes={localizedEpisodes}
            locale={locale}
          />
        </div>
      </section>

      {/* ─── Newsletter / Notify Section ─── */}
      <section className="py-20 md:py-28 bg-[var(--brand-primary)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[var(--brand-accent)]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-peach/5 rounded-full blur-[100px]" />

        <div className="w-[94%] max-w-xl mx-auto text-center relative z-10">
          <AnimateIn>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-[var(--brand-accent-light)]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
              {isFr ? "Ne manquez" : "Never miss"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">
                {isFr ? "rien" : "an episode"}
              </span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
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
                className="h-12 px-5 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent-light)]/40 focus:border-transparent flex-1 backdrop-blur-sm transition-all duration-300"
              />
              <Button
                variant="peach"
                size="lg"
                className="rounded-full shrink-0"
              >
                {isFr ? "S'inscrire" : "Subscribe"}
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
