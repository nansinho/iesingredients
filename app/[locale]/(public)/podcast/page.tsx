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
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { BreadcrumbJsonLd, PodcastSeriesJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn } from "@/components/ui/AnimateIn";
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
      color: "#8CB43D",
    },
    en: {
      id: "artisans-parfum",
      title: "The Perfume Artisans",
      description:
        "Meet the noses, perfumers and creators who shape olfactory art. Craftsmanship, inspiration and passion.",
      image: "/images/essential-oil.jpg",
      episodeCount: 2,
      color: "#8CB43D",
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
      color: "#2A4020",
    },
    en: {
      id: "terre-ingredients",
      title: "Land of Ingredients",
      description:
        "From field to lab: discover the origin of natural raw materials and their journey to your products.",
      image: "/images/botanicals-flat.jpg",
      episodeCount: 3,
      color: "#2A4020",
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
      color: "#5A9372",
    },
    en: {
      id: "lab-innovation",
      title: "Lab & Innovation",
      description:
        "How science and technology are transforming the cosmetics industry and creating tomorrow's formulations.",
      image: "/images/cream-bowl.jpg",
      episodeCount: 1,
      color: "#5A9372",
    },
  },
};

/* ─── Episodes ─── */
const episodes: Omit<EpisodeData, "title" | "guest" | "guestRole" | "description">[] = [
  { id: 1, episodeNumber: 1, duration: "32:15", date: "2025-03-15", image: "/images/essential-oil.jpg", audioUrl: "/audio/episode-1.mp3", category: "parfumerie", collection: "artisans-parfum" },
  { id: 2, episodeNumber: 2, duration: "28:40", date: "2025-02-20", image: "/images/botanicals-flat.jpg", audioUrl: "/audio/episode-2.mp3", category: "ingredients", collection: "terre-ingredients" },
  { id: 3, episodeNumber: 3, duration: "35:50", date: "2025-01-18", image: "/images/cream-bowl.jpg", audioUrl: "/audio/episode-3.mp3", category: "innovation", collection: "lab-innovation" },
  { id: 4, episodeNumber: 4, duration: "41:22", date: "2024-12-12", image: "/images/hero-botanical.jpg", audioUrl: "/audio/episode-4.mp3", category: "ingredients", collection: "terre-ingredients" },
  { id: 5, episodeNumber: 5, duration: "26:18", date: "2024-11-08", image: "/images/blueberries-herbs.jpg", audioUrl: "/audio/episode-5.mp3", category: "parfumerie", collection: "artisans-parfum" },
  { id: 6, episodeNumber: 6, duration: "37:05", date: "2024-10-15", image: "/images/leaves-hero.jpg", audioUrl: "/audio/episode-6.mp3", category: "durabilite", collection: "terre-ingredients" },
];

const episodeTranslations = {
  fr: [
    { title: "L'art de la parfumerie naturelle", guest: "Marie Laurent", guestRole: "Nez parfumeur", description: "Découvrez les secrets de la création de parfums à partir d'ingrédients naturels avec l'une des plus grandes parfumeuses de France." },
    { title: "Les huiles essentielles de Madagascar", guest: "Jean-Pierre Rakoto", guestRole: "Producteur", description: "Voyage au cœur de Madagascar pour comprendre la production d'huiles essentielles rares et précieuses." },
    { title: "Innovation et cosmétique bio", guest: "Sophie Delatour", guestRole: "Directrice R&D", description: "Comment l'innovation technologique transforme l'industrie cosmétique bio et les formulations naturelles." },
    { title: "Du champ au flacon", guest: "Pierre Moreau", guestRole: "Agriculteur bio", description: "Le parcours fascinant des ingrédients naturels, de la récolte à la formulation finale." },
    { title: "Les tendances parfumerie 2025", guest: "Camille Duval", guestRole: "Analyste de marché", description: "Quelles sont les grandes tendances qui vont façonner l'industrie de la parfumerie cette année ?" },
    { title: "Durabilité et sourcing éthique", guest: "Amina Benali", guestRole: "Experte RSE", description: "L'importance du sourcing éthique et durable dans l'industrie des ingrédients naturels." },
  ],
  en: [
    { title: "The art of natural perfumery", guest: "Marie Laurent", guestRole: "Perfumer", description: "Discover the secrets of creating perfumes from natural ingredients with one of France's greatest perfumers." },
    { title: "Essential oils from Madagascar", guest: "Jean-Pierre Rakoto", guestRole: "Producer", description: "Journey to the heart of Madagascar to understand the production of rare and precious essential oils." },
    { title: "Innovation and organic cosmetics", guest: "Sophie Delatour", guestRole: "R&D Director", description: "How technological innovation is transforming the organic cosmetics industry and natural formulations." },
    { title: "From field to bottle", guest: "Pierre Moreau", guestRole: "Organic farmer", description: "The fascinating journey of natural ingredients, from harvest to final formulation." },
    { title: "Perfumery trends 2025", guest: "Camille Duval", guestRole: "Market analyst", description: "What are the major trends shaping the perfumery industry this year?" },
    { title: "Sustainability and ethical sourcing", guest: "Amina Benali", guestRole: "CSR Expert", description: "The importance of ethical and sustainable sourcing in the natural ingredients industry." },
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
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: "Podcast", url: `https://ies-ingredients.com/${locale}/podcast` },
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

      {/* ═══ Hero — cinematic ═══ */}
      <section className="relative min-h-[75vh] bg-brand-primary overflow-hidden flex items-center pt-32 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/essential-oil.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/85 to-brand-primary/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/55 via-transparent to-brand-primary" />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 80% 35%, hsl(var(--brand-accent) / 0.2) 0%, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto w-full">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-10">
              <Mic className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                Podcast
              </span>
              <div className="h-px flex-1 max-w-[180px] bg-white/15" />
              <span className="text-[11px] font-mono text-white/30 hidden sm:inline">
                {episodes.length} {isFr ? "épisodes" : "episodes"}
              </span>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} y={30}>
            <h1
              className="text-white font-semibold tracking-[-0.035em] leading-[0.98] mb-6"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 7rem)" }}
            >
              {isFr ? "Les voix" : "The voices"}
              <br />
              <span className="text-brand-accent">{isFr ? "des ingrédients." : "of ingredients."}</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2} y={20} className="max-w-2xl mt-6">
            <p className="text-white/65 text-base sm:text-lg leading-relaxed">
              {isFr
                ? "Interviews, expertises et coulisses — plongez dans l'univers de la parfumerie, de la cosmétique et des ingrédients naturels avec nos invités."
                : "Interviews, expertise and behind-the-scenes — dive into the world of perfumery, cosmetics, and natural ingredients with our guests."}
            </p>
          </AnimateIn>

          <AnimateIn delay={0.3} y={20}>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-full px-7 py-3.5 text-sm font-semibold shadow-lg shadow-brand-accent/20 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t("listenOn")} Spotify</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white rounded-full px-7 py-3.5 text-sm font-semibold transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Apple Podcasts</span>
              </a>
            </div>
          </AnimateIn>

          {/* Stats row */}
          <AnimateIn delay={0.4} className="mt-12 pt-8 border-t border-white/10 max-w-2xl">
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Headphones, value: episodes.length.toString(), label: isFr ? "Épisodes" : "Episodes" },
                { icon: Users, value: "6+", label: isFr ? "Invités" : "Guests" },
                { icon: Timer, value: "3h+", label: isFr ? "De contenu" : "Of content" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
                    <stat.icon className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
                      {stat.label}
                    </div>
                    <div className="text-lg font-semibold text-white leading-tight">
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ Collections + Episodes ═══ */}
      <section className="py-20 md:py-28 bg-cream-light">
        <div className="w-[94%] max-w-7xl mx-auto">
          <AnimateIn className="mb-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/40">
                {isFr ? "Nos collections" : "Our collections"}
              </span>
            </div>
            <h2
              className="text-dark font-semibold tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "Parcourez par" : "Browse by"}{" "}
              <span className="text-brand-accent">{isFr ? "thématique." : "theme."}</span>
            </h2>
            <p className="text-dark/55 text-base leading-relaxed max-w-xl">
              {isFr
                ? "Chaque collection regroupe des épisodes autour d'une thématique — artisans, territoires, innovation."
                : "Each collection groups episodes around a theme — artisans, territories, innovation."}
            </p>
          </AnimateIn>

          <PodcastPageClient
            collections={localizedCollections}
            episodes={localizedEpisodes}
            locale={locale}
          />
        </div>
      </section>

      {/* ═══ Newsletter / Notify ═══ */}
      <section className="py-20 md:py-24 bg-brand-primary border-t border-white/5">
        <div className="w-[94%] max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Mail className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                {isFr ? "Alertes" : "Alerts"}
              </span>
            </div>
            <h2
              className="text-white font-semibold tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              {isFr ? "Ne manquez aucun" : "Don't miss any"}{" "}
              <span className="text-brand-accent">{isFr ? "épisode." : "episode."}</span>
            </h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-md">
              {isFr
                ? "Notification à chaque nouvelle sortie, directement dans votre boîte mail."
                : "Notification for each new release, directly in your inbox."}
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder={isFr ? "Votre adresse email" : "Your email"}
              className="h-12 px-5 rounded-full bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent/40 flex-1 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-semibold transition-colors shrink-0 inline-flex items-center justify-center gap-2"
            >
              {isFr ? "S'inscrire" : "Subscribe"}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
