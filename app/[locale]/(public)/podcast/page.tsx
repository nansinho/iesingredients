import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Headphones, Play, ExternalLink, Mail, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd, PodcastSeriesJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { PodcastEpisodesSection } from "@/components/podcast/PodcastEpisodesSection";
import type { EpisodeData } from "@/components/podcast/EpisodeCard";

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
  },
  {
    id: 2,
    episodeNumber: 2,
    duration: "28:40",
    date: "2025-02-20",
    image: "/images/botanicals-flat.jpg",
    audioUrl: "/audio/episode-2.mp3",
    category: "ingredients",
  },
  {
    id: 3,
    episodeNumber: 3,
    duration: "35:50",
    date: "2025-01-18",
    image: "/images/cream-bowl.jpg",
    audioUrl: "/audio/episode-3.mp3",
    category: "innovation",
  },
  {
    id: 4,
    episodeNumber: 4,
    duration: "41:22",
    date: "2024-12-12",
    image: "/images/hero-botanical.jpg",
    audioUrl: "/audio/episode-4.mp3",
    category: "ingredients",
  },
  {
    id: 5,
    episodeNumber: 5,
    duration: "26:18",
    date: "2024-11-08",
    image: "/images/blueberries-herbs.jpg",
    audioUrl: "/audio/episode-5.mp3",
    category: "parfumerie",
  },
  {
    id: 6,
    episodeNumber: 6,
    duration: "37:05",
    date: "2024-10-15",
    image: "/images/leaves-hero.jpg",
    audioUrl: "/audio/episode-6.mp3",
    category: "durabilite",
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
    guest: `${translations[i].guest}, ${translations[i].guestRole}`,
    guestRole: translations[i].guestRole,
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
      <PodcastSeriesJsonLd
        name="À Fleur De Nez"
        description={
          isFr
            ? "Explorez l'univers de la parfumerie à travers des interviews et des histoires captivantes."
            : "Explore the world of perfumery through captivating interviews and stories."
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
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
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
          {/* Lavande gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F3D] via-[#2E1F3D]/70 to-[#2E1F3D]/30" />
        </ParallaxBackground>

        {/* Subtle wave SVG at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              fill="#FAF8F6"
            />
          </svg>
        </div>

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto pb-28 pt-44 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-8 backdrop-blur-sm">
              <Mic className="w-3.5 h-3.5" />
              Podcast
            </span>
          </AnimateIn>

          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-4">
              {isFr ? "Notre" : "Our"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">
                Podcast
              </span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <p className="text-xl sm:text-2xl font-playfair italic text-peach-light/90 mb-2">
              À Fleur De Nez
            </p>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("subtitle")}
            </p>
          </AnimateIn>

          <AnimateIn delay={0.3} y={15}>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="peach" size="lg" className="rounded-full">
                <Play className="w-5 h-5 mr-2" />
                {t("listenOn")} Spotify
              </Button>
              <Button
                size="lg"
                className="rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30 transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Apple Podcasts
              </Button>
            </div>
          </AnimateIn>

          {/* Subtle audio waveform SVG decoration */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
            <svg
              width="400"
              height="40"
              viewBox="0 0 400 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {[...Array(40)].map((_, i) => {
                const height = 8 + Math.sin(i * 0.5) * 12 + Math.random() * 8;
                return (
                  <rect
                    key={i}
                    x={i * 10}
                    y={20 - height / 2}
                    width="4"
                    height={height}
                    rx="2"
                    fill="white"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ─── About Section ─── */}
      <section className="py-20 md:py-28 bg-cream-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px]" />
        <div className="w-[94%] max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Cover Art */}
          <AnimateIn y={30}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--brand-accent-light)]/40 to-[var(--brand-accent)]/20 p-[2px]">
                <div className="w-full h-full rounded-3xl bg-white flex flex-col items-center justify-center relative overflow-hidden shadow-[0_20px_60px_rgba(212,144,126,0.15)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-cream-light to-peach-light/20" />
                  <div className="relative z-10 text-center px-8">
                    <div className="w-20 h-20 rounded-full bg-[var(--brand-primary)]/8 flex items-center justify-center mx-auto mb-5">
                      <Headphones className="w-10 h-10 text-[var(--brand-primary)]" />
                    </div>
                    <p className="text-3xl font-bold text-[var(--brand-primary)] mb-1 tracking-tight">
                      À Fleur De Nez
                    </p>
                    <p className="text-[var(--brand-accent)] text-sm uppercase tracking-[0.2em] font-medium">
                      Podcast
                    </p>
                    <div className="mt-6 flex justify-center gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-[var(--brand-accent)]/30"
                          style={{
                            height: `${12 + Math.sin(i * 0.6) * 10}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Text Content */}
          <AnimateIn delay={0.15} y={30}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/6 border border-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              {isFr ? "À propos" : "About"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark tracking-tight mt-4 mb-6 leading-tight">
              {isFr ? "Explorez l'univers de la" : "Explore the world of"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">
                {isFr ? "Parfumerie" : "Perfumery"}
              </span>
            </h2>
            <div className="space-y-4 text-dark/60 text-lg leading-relaxed">
              <p>
                {isFr
                  ? 'Notre podcast "À Fleur De Nez" explore l\'univers de la parfumerie à travers des interviews passionnantes avec les acteurs de l\'industrie.'
                  : 'Our podcast "À Fleur De Nez" explores the world of perfumery through exciting interviews with industry professionals.'}
              </p>
              <p>
                {isFr
                  ? "De la sélection des matières premières à la création de compositions uniques, découvrez les secrets des maîtres parfumeurs et des experts en ingrédients naturels."
                  : "From raw material selection to creating unique compositions, discover the secrets of master perfumers and natural ingredient experts."}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-brown/10">
              <div>
                <p className="text-2xl font-bold text-[var(--brand-primary)]">
                  {episodes.length}
                </p>
                <p className="text-sm text-dark/40 mt-1">
                  {isFr ? "Épisodes" : "Episodes"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--brand-primary)]">
                  6+
                </p>
                <p className="text-sm text-dark/40 mt-1">
                  {isFr ? "Invités experts" : "Expert guests"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--brand-primary)]">
                  3h+
                </p>
                <p className="text-sm text-dark/40 mt-1">
                  {isFr ? "De contenu" : "Of content"}
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ─── Episodes Section ─── */}
      <section className="py-20 md:py-28 bg-cream-light relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-accent-light)]/8 rounded-full blur-[180px]" />
        <div className="w-[94%] max-w-7xl mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/6 border border-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              {isFr ? "Tous les épisodes" : "All episodes"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-dark tracking-tight">
              {isFr ? "Derniers" : "Latest"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">
                {isFr ? "Épisodes" : "Episodes"}
              </span>
            </h2>
          </AnimateIn>

          <PodcastEpisodesSection
            episodes={localizedEpisodes}
            locale={locale}
          />
        </div>
      </section>

      {/* ─── Newsletter / Notify Section ─── */}
      <section className="py-20 md:py-28 bg-[var(--brand-primary)] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[var(--brand-accent)]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-peach/5 rounded-full blur-[100px]" />

        <div className="w-[94%] max-w-xl mx-auto text-center relative z-10">
          <AnimateIn>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-[var(--brand-accent-light)]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
              {isFr ? "Soyez" : "Get"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent-light)]">
                {isFr ? "notifié" : "notified"}
              </span>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              {isFr
                ? "Recevez une notification dès la sortie d'un nouvel épisode de notre podcast."
                : "Get notified as soon as a new episode of our podcast is released."}
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
