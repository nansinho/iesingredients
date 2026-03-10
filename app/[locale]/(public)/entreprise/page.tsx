import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Shield,
  Award,
  Globe,
  Users,
  Leaf,
  Heart,
  Building2,
  ArrowRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Mail,
  Zap,
  Ear,
  HandHeart,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem, HoverLift } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { MinimalCTA } from "@/components/home/MinimalCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = locale === "fr"
    ? "Découvrez IES Ingredients : depuis 1993, expert en distribution d'ingrédients naturels pour la cosmétique, la parfumerie et l'agroalimentaire."
    : "Discover IES Ingredients: since 1993, experts in distributing natural ingredients for cosmetics, perfumery and food industry.";

  return {
    title: t("companyTitle"),
    description,
    alternates: {
      canonical: `/${locale}/entreprise`,
      languages: { fr: "/fr/entreprise", en: "/en/company" },
    },
    openGraph: {
      title: t("companyTitle"),
      description,
      url: `https://ies-ingredients.com/${locale}/${locale === "fr" ? "entreprise" : "company"}`,
      type: "website",
    },
  };
}

const timeline = [
  {
    year: "1993",
    titleFr: "Création d'IES",
    titleEn: "IES Founded",
    descFr: "Distribution des Ingrédients de Parfumerie Givaudan",
    descEn: "Distribution of Givaudan Perfumery Ingredients",
  },
  {
    year: "1994",
    titleFr: "Arômes Givaudan",
    titleEn: "Givaudan Aromas",
    descFr: "Distribution ingrédients arômes de Givaudan",
    descEn: "Distribution of Givaudan aroma ingredients",
  },
  {
    year: "2004",
    titleFr: "DSM Personal Care",
    titleEn: "DSM Personal Care",
    descFr: "Distribution de DSM Personal Care & Aroma Ingredients (PCA)",
    descEn: "Distribution of DSM Personal Care & Aroma Ingredients (PCA)",
  },
  {
    year: "2015",
    titleFr: "Xinrui Aromatics",
    titleEn: "Xinrui Aromatics",
    descFr: "Distribution Jiangsu Xinrui Aromatics (ex fournisseur Givaudan)",
    descEn: "Distribution of Jiangsu Xinrui Aromatics (former Givaudan supplier)",
  },
  {
    year: "2018",
    titleFr: "Extension zone EMEA",
    titleEn: "EMEA Zone Extension",
    descFr: "Extension de la zone de distribution Givaudan Parfumerie sur la zone EMEA",
    descEn: "Extension of Givaudan Perfumery distribution zone to EMEA",
  },
  {
    year: "2020",
    titleFr: "Vitalflower",
    titleEn: "Vitalflower",
    descFr: "Distribution extraits végétaux Vitalflower",
    descEn: "Distribution of Vitalflower plant extracts",
  },
  {
    year: "2021",
    titleFr: "House of Naturals & Jargent",
    titleEn: "House of Naturals & Jargent",
    descFr: "Distribution House of Naturals P&F et Cosmétiques, Distribution Jargent & Company",
    descEn: "Distribution of House of Naturals P&F and Cosmetics, Distribution of Jargent & Company",
  },
  {
    year: "2023",
    titleFr: "Givaudan Flavour",
    titleEn: "Givaudan Flavour",
    descFr: "Distribution de toute la gamme Givaudan Flavour Ingredients",
    descEn: "Distribution of the full Givaudan Flavour Ingredients range",
  },
];

const values = [
  { icon: Shield, titleFr: "Qualité", titleEn: "Quality", descFr: "Sélection rigoureuse de chaque ingrédient pour garantir l'excellence.", descEn: "Rigorous selection of each ingredient to guarantee excellence." },
  { icon: Globe, titleFr: "International", titleEn: "International", descFr: "Un réseau mondial de fournisseurs partenaires depuis 30 ans.", descEn: "A worldwide network of partner suppliers for 30 years." },
  { icon: Heart, titleFr: "Passion", titleEn: "Passion", descFr: "L'amour des ingrédients naturels est au cœur de notre métier.", descEn: "Love for natural ingredients is at the heart of our business." },
  { icon: Leaf, titleFr: "Durabilité", titleEn: "Sustainability", descFr: "Engagement envers un sourcing responsable et éthique.", descEn: "Commitment to responsible and ethical sourcing." },
  { icon: Award, titleFr: "Certifications", titleEn: "Certifications", descFr: "COSMOS, ECOCERT, BIO, ISO 9001 pour une qualité vérifiable.", descEn: "COSMOS, ECOCERT, BIO, ISO 9001 for verifiable quality." },
  { icon: Users, titleFr: "Proximité", titleEn: "Proximity", descFr: "Un accompagnement personnalisé pour chaque client.", descEn: "Personalized support for each client." },
];

const partners = [
  {
    nameFr: "DSM Personal Care",
    nameEn: "DSM Personal Care",
    zoneFr: "France, Belgique, Luxembourg & Monaco",
    zoneEn: "France, Belgium, Luxembourg & Monaco",
  },
  {
    nameFr: "DSM Aroma Ingredients",
    nameEn: "DSM Aroma Ingredients",
    zoneFr: "France, Belgique, Italie, Allemagne, Suisse, Belgique, Pays-Bas, Luxembourg, Danemark, Lettonie, Lituanie, Grèce, Croatie, Ukraine, Russie, Turquie, Égypte",
    zoneEn: "France, Belgium, Italy, Germany, Switzerland, Belgium, Netherlands, Luxembourg, Denmark, Latvia, Lithuania, Greece, Croatia, Ukraine, Russia, Turkey, Egypt",
  },
  {
    nameFr: "Givaudan Fragrances Ingredients",
    nameEn: "Givaudan Fragrances Ingredients",
    zoneFr: "Zone EMEA (Europe, Moyen-Orient & Afrique)",
    zoneEn: "EMEA zone (Europe, Middle East & Africa)",
  },
  {
    nameFr: "Givaudan Flavour Ingredients",
    nameEn: "Givaudan Flavour Ingredients",
    zoneFr: "France, Italie, Espagne, Suisse, Portugal, Turquie & Grèce et autres pays",
    zoneEn: "France, Italy, Spain, Switzerland, Portugal, Turkey & Greece and other countries",
  },
  {
    nameFr: "House of Naturals",
    nameEn: "House of Naturals",
    zoneFr: "Zone EMEA (Europe, Moyen-Orient & Afrique)",
    zoneEn: "EMEA zone (Europe, Middle East & Africa)",
  },
  {
    nameFr: "May Flower",
    nameEn: "May Flower",
    zoneFr: "France, Belgique, Luxembourg & Monaco",
    zoneEn: "France, Belgium, Luxembourg & Monaco",
  },
];

const locations = [
  {
    city: "Paris",
    labelFr: "Bureau commercial",
    labelEn: "Commercial office",
    top: "28%",
    left: "38%",
  },
  {
    city: "Marseille",
    labelFr: "Siège social & centre de distribution",
    labelEn: "Headquarters & distribution center",
    top: "42%",
    left: "40%",
  },
  {
    city: "Dubaï",
    labelFr: "Bureau commercial",
    labelEn: "Commercial office",
    top: "58%",
    left: "82%",
  },
];

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Entreprise" : "Company", url: `https://ies-ingredients.com/${locale}/${isFr ? "entreprise" : "company"}` },
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <Image
            src="/images/leaves-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary)] via-[var(--brand-primary)]/70 to-[var(--brand-primary)]/40" />
        </ParallaxBackground>

        <div className="relative z-10 w-[94%] mx-auto pb-20 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-5 backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5" />
              {isFr ? "Notre histoire" : "Our story"}
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              IES <span className="font-playfair italic text-[var(--brand-accent-light)]">Ingredients</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {isFr
                ? "International Express Service — Expert en distribution de matières premières pour l'industrie du parfum, de la cosmétique et des arômes depuis 1993."
                : "International Express Service — Experts in raw material distribution for the perfume, cosmetics and flavor industries since 1993."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Introduction & Présentation */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/3 rounded-full blur-[150px]" />
        <div className="w-[94%] max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <AnimateIn y={30}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-brown/8">
              <Image
                src="/images/botanicals-flat.jpg"
                alt={isFr ? "Ingrédients botaniques" : "Botanical ingredients"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-6 left-6 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg">
                <p className="text-[var(--brand-primary)] font-bold text-2xl">1993</p>
                <p className="text-[var(--brand-primary)]/60 text-xs font-semibold uppercase tracking-wider">
                  {isFr ? "Année de création" : "Year founded"}
                </p>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.15} y={30}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brown/8 border border-brown/12 text-brown text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              {isFr ? "Notre mission" : "Our mission"}
            </span>
            <h2 className="text-dark tracking-tight mt-4 mb-6">
              {isFr ? "L'Excellence au Service de la" : "Excellence in Service of"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Nature" : "Nature"}</span>.
            </h2>
            <div className="space-y-4 text-dark/60 text-lg leading-relaxed">
              <p>
                {isFr
                  ? "La société IES a été créée en 1993 par François-Patrick SABATER, PDG, sur le site provençal de Marseille. IES est expert dans la distribution de matières premières au service de professionnels de l'industrie du parfum, de la cosmétique et des arômes."
                  : "IES was founded in 1993 by François-Patrick SABATER, CEO, in Marseille, Provence. IES is an expert in distributing raw materials for professionals in the perfume, cosmetics and flavor industries."}
              </p>
              <p>
                {isFr
                  ? "Le siège social est situé dans la région de Marseille, sur la commune d'Allauch. Nous retrouvons sur ce site le centre de distribution ainsi que les bureaux administratifs. Un site de 3600 m² est également présent aux Émirats Arabes Unis à Dubaï."
                  : "Our headquarters are located in the Marseille region, in the municipality of Allauch. This site houses our distribution center and administrative offices. A 3,600 m² facility is also present in the United Arab Emirates in Dubai."}
              </p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-all duration-300 shadow-lg"
            >
              {isFr ? "Voir le catalogue" : "View catalog"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Carte des implantations */}
      <section className="py-20 md:py-28 bg-cream-light relative overflow-hidden">
        <div className="w-[94%] max-w-7xl mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <MapPin className="w-3.5 h-3.5" />
              {isFr ? "Nos implantations" : "Our locations"}
            </span>
            <h2 className="text-dark tracking-tight">
              {isFr ? "Une Présence" : "A Presence"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Internationale" : "Worldwide"}</span>.
            </h2>
          </AnimateIn>

          {/* Map — Stylized static representation */}
          <AnimateIn delay={0.1}>
            <div className="relative max-w-4xl mx-auto bg-white rounded-3xl border border-brown/8 p-8 md:p-12 shadow-[0_8px_40px_rgba(200,168,168,0.06)]">
              {/* Simplified map background */}
              <div className="relative aspect-[16/9] bg-gradient-to-br from-cream to-cream-light rounded-2xl overflow-hidden">
                {/* Abstract map shapes */}
                <div className="absolute inset-0 opacity-[0.07]">
                  {/* Europe shape approximation */}
                  <div className="absolute top-[15%] left-[25%] w-[35%] h-[50%] bg-[var(--brand-primary)] rounded-[40%_60%_50%_40%]" />
                  {/* Africa shape approximation */}
                  <div className="absolute top-[55%] left-[30%] w-[20%] h-[35%] bg-[var(--brand-primary)] rounded-[30%_40%_50%_35%]" />
                  {/* Middle East shape approximation */}
                  <div className="absolute top-[35%] left-[60%] w-[25%] h-[30%] bg-[var(--brand-primary)] rounded-[50%_30%_40%_60%]" />
                </div>

                {/* Location points */}
                {locations.map((loc) => (
                  <div
                    key={loc.city}
                    className="absolute group"
                    style={{ top: loc.top, left: loc.left }}
                  >
                    {/* Pulse ring */}
                    <div className="absolute -inset-3 rounded-full bg-[var(--brand-accent)]/20 animate-glow-pulse" />
                    {/* Dot */}
                    <div className="relative w-4 h-4 rounded-full bg-[var(--brand-accent)] border-2 border-white shadow-lg" />
                    {/* Label */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-md border border-brown/8">
                      <p className="font-bold text-dark text-sm">{loc.city}</p>
                      <p className="text-dark/50 text-xs mt-0.5">{isFr ? loc.labelFr : loc.labelEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Timeline / L'Historique */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[var(--brand-accent-light)]/5 rounded-full blur-[150px]" />
        <div className="w-[94%] max-w-4xl mx-auto relative z-10">
          <AnimateIn className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Calendar className="w-3.5 h-3.5" />
              {isFr ? "L'historique" : "Our history"}
            </span>
            <h2 className="text-dark tracking-tight">
              {isFr ? "30 Ans d'" : "30 Years of"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Excellence" : "Excellence"}</span>.
            </h2>
          </AnimateIn>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[23px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--brand-accent)]/30 via-[var(--brand-primary)]/20 to-[var(--brand-accent)]/30" />

            <div className="space-y-8 md:space-y-12">
              {timeline.map((item, index) => (
                <AnimateIn key={item.year} delay={index * 0.08}>
                  <div className={`relative flex items-start gap-6 md:gap-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="bg-white rounded-2xl p-5 border border-brown/8 hover:border-[var(--brand-accent)]/20 hover:shadow-[0_12px_40px_rgba(212,144,126,0.08)] transition-all duration-500">
                        <span className="text-2xl md:text-3xl font-black text-[var(--brand-accent)] leading-none">{item.year}</span>
                        <h3 className="font-bold text-dark text-base mt-2">{isFr ? item.titleFr : item.titleEn}</h3>
                        <p className="text-sm text-dark/50 mt-1 leading-relaxed">{isFr ? item.descFr : item.descEn}</p>
                      </div>
                    </div>

                    {/* Center dot — desktop only */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--brand-accent)] border-[3px] border-white shadow-md z-10 mt-6" />

                    {/* Left dot — mobile */}
                    <div className="md:hidden absolute left-[16px] w-[18px] h-[18px] rounded-full bg-[var(--brand-accent)] border-[3px] border-white shadow-md z-10 mt-5" />

                    {/* Spacer for alternating layout on desktop */}
                    <div className="hidden md:block flex-1 md:w-[calc(50%-2rem)]" />
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 md:py-28 bg-cream-light relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-accent-light)]/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--brand-primary)]/3 rounded-full blur-[120px]" />

        <div className="w-[94%] max-w-7xl mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Award className="w-3.5 h-3.5" />
              {isFr ? "Nos valeurs" : "Our values"}
            </span>
            <h2 className="text-dark tracking-tight">
              {isFr ? "Ce Qui Nous" : "What Drives"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Anime" : "Us"}</span>.
            </h2>
          </AnimateIn>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {values.map((v) => (
              <StaggerItem key={v.titleFr}>
                <HoverLift>
                  <div className="bg-white rounded-2xl p-7 border border-[var(--brand-primary)]/8 hover:border-[var(--brand-accent)]/25 hover:shadow-[0_12px_40px_rgba(212,144,126,0.08)] transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 flex items-center justify-center mb-5 group-hover:bg-[var(--brand-primary)]/15 group-hover:scale-110 transition-all duration-300">
                      <v.icon className="w-5.5 h-5.5 text-[var(--brand-primary)]" />
                    </div>
                    <h3 className="font-bold text-dark mb-2 text-base">
                      {isFr ? v.titleFr : v.titleEn}
                    </h3>
                    <p className="text-sm text-dark/50 leading-relaxed">
                      {isFr ? v.descFr : v.descEn}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Engagements RSE */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="w-[94%] max-w-5xl mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Leaf className="w-3.5 h-3.5" />
              {isFr ? "Nos engagements" : "Our commitments"}
            </span>
            <h2 className="text-dark tracking-tight mb-4">
              {isFr ? "Responsabilité" : "Corporate"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Sociétale" : "Responsibility"}</span>.
            </h2>
            <p className="text-dark/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? "Contribuer à l'excellence de la production de parfums, d'arômes et de cosmétiques. IES Ingredients est engagé volontairement et avec conviction dans une démarche RSE."
                : "Contributing to excellence in perfume, flavor and cosmetics production. IES Ingredients is voluntarily and wholeheartedly committed to a CSR approach."}
            </p>
          </AnimateIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <HoverLift>
                <div className="bg-cream-light rounded-2xl p-8 border border-brown/8 text-center hover:border-[var(--brand-accent)]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/20 flex items-center justify-center mx-auto mb-5">
                    <Zap className="w-6 h-6 text-[var(--brand-accent)]" />
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2">{isFr ? "Dynamique" : "Dynamic"}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">
                    {isFr
                      ? "IES Ingredients est avant tout une équipe de collaborateurs dynamique et motivée pour être de tous les instants au quotidien pour nos clients."
                      : "IES Ingredients is above all a dynamic and motivated team of employees, dedicated to being there for our clients at all times."}
                  </p>
                </div>
              </HoverLift>
            </StaggerItem>
            <StaggerItem>
              <HoverLift>
                <div className="bg-cream-light rounded-2xl p-8 border border-brown/8 text-center hover:border-[var(--brand-accent)]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/20 flex items-center justify-center mx-auto mb-5">
                    <Ear className="w-6 h-6 text-[var(--brand-accent)]" />
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2">{isFr ? "À l'écoute" : "Attentive"}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">
                    {isFr
                      ? "Nous sommes à l'écoute de toutes les parties prenantes pour trouver les solutions en termes d'approvisionnement et de réalisation de produits innovants."
                      : "We listen to all stakeholders to find solutions in terms of sourcing and creating innovative products."}
                  </p>
                </div>
              </HoverLift>
            </StaggerItem>
            <StaggerItem>
              <HoverLift>
                <div className="bg-cream-light rounded-2xl p-8 border border-brown/8 text-center hover:border-[var(--brand-accent)]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--brand-accent)]/10 border border-[var(--brand-accent)]/20 flex items-center justify-center mx-auto mb-5">
                    <HandHeart className="w-6 h-6 text-[var(--brand-accent)]" />
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2">{isFr ? "Engagé" : "Committed"}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">
                    {isFr
                      ? "Notre entreprise inscrit ses relations de longue durée avec ses clients et ses actions à long terme pour l'avenir de notre planète."
                      : "Our company builds long-lasting relationships with clients and takes long-term action for the future of our planet."}
                  </p>
                </div>
              </HoverLift>
            </StaggerItem>
          </StaggerGrid>

          {/* Ethics & Contact */}
          <AnimateIn delay={0.2} className="mt-10 text-center">
            <p className="text-dark/40 text-sm">
              {isFr
                ? "Une adresse mail est à disposition de façon lui aussi permanente pour tout avoir une violation du code de conduite et bons signaler sur notre démarche RSE :"
                : "An email address is permanently available for reporting any violation of the code of conduct or providing feedback on our CSR approach:"}
            </p>
            <a href="mailto:ethique@ies-ingredients.com" className="inline-flex items-center gap-2 text-[var(--brand-primary)] font-semibold text-sm mt-2 hover:text-[var(--brand-accent)] transition-colors">
              <Mail className="w-4 h-4" />
              ethique@ies-ingredients.com
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-20 bg-cream-light">
        <div className="w-[94%] max-w-4xl mx-auto">
          <AnimateIn>
            <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center bg-white rounded-3xl p-8 md:p-10 border border-brown/8 shadow-[0_8px_40px_rgba(200,168,168,0.06)]">
              <div className="w-20 h-20 rounded-2xl bg-[var(--brand-primary)]/8 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                <Shield className="w-10 h-10 text-[var(--brand-primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-dark text-xl mb-2 text-center md:text-left">
                  {isFr ? "Certifié ISO 9001" : "ISO 9001 Certified"}
                </h3>
                <p className="text-dark/50 text-sm leading-relaxed text-center md:text-left">
                  {isFr
                    ? "Nous avons obtenu depuis novembre 2017 la certification ISO 9001 sur le système de management de la qualité de notre site d'Allauch afin d'améliorer en permanence la satisfaction de nos clients et fournir des produits et services conformes."
                    : "We have held ISO 9001 certification since November 2017 for the quality management system at our Allauch site, in order to continuously improve customer satisfaction and deliver compliant products and services."}
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Distribution — Partenaires */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="w-[94%] max-w-7xl mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Globe className="w-3.5 h-3.5" />
              {isFr ? "La distribution" : "Distribution"}
            </span>
            <h2 className="text-dark tracking-tight mb-4">
              {isFr ? "Nos" : "Our"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Partenaires" : "Partners"}</span>.
            </h2>
            <p className="text-dark/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? "IES est le partenaire de fabricants prestigieux leaders sur leur marché. Nous sommes le distributeur exclusif de :"
                : "IES partners with prestigious market-leading manufacturers. We are the exclusive distributor of:"}
            </p>
          </AnimateIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((p) => (
              <StaggerItem key={p.nameFr}>
                <div className="bg-cream-light rounded-2xl p-6 border border-brown/8 hover:border-[var(--brand-accent)]/20 hover:shadow-md transition-all duration-300">
                  <h4 className="font-bold text-dark text-base mb-1">{isFr ? p.nameFr : p.nameEn}</h4>
                  <p className="text-sm text-dark/50 leading-relaxed">
                    <span className="text-[var(--brand-primary)] font-medium">{isFr ? "Zone" : "Zone"} :</span>{" "}
                    {isFr ? p.zoneFr : p.zoneEn}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Logos partenaires */}
      <LogoMarquee />

      {/* Zones de distribution */}
      <section className="py-20 md:py-28 bg-white">
        <div className="w-[94%] max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-14">
            <h2 className="text-dark tracking-tight">
              {isFr ? "Nos Zones de" : "Our Distribution"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Distribution" : "Zones"}</span>.
            </h2>
          </AnimateIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <HoverLift>
                <div className="bg-cream-light rounded-2xl p-8 border border-brown/8 text-center hover:border-[var(--brand-accent)]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-cosmetique/10 border border-cosmetique/20 flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-5 h-5 text-cosmetique" />
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2">{isFr ? "Ingrédients cosmétiques" : "Cosmetic ingredients"}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">France, {isFr ? "Belgique" : "Belgium"}, Luxembourg & Monaco</p>
                </div>
              </HoverLift>
            </StaggerItem>
            <StaggerItem>
              <HoverLift>
                <div className="bg-cream-light rounded-2xl p-8 border border-brown/8 text-center hover:border-[var(--brand-accent)]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-parfum/10 border border-parfum/20 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-5 h-5 text-parfum" />
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2">{isFr ? "Ingrédients parfums" : "Perfume ingredients"}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">Zone EMEA</p>
                </div>
              </HoverLift>
            </StaggerItem>
            <StaggerItem>
              <HoverLift>
                <div className="bg-cream-light rounded-2xl p-8 border border-brown/8 text-center hover:border-[var(--brand-accent)]/20 hover:shadow-lg transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-arome/10 border border-arome/20 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-5 h-5 text-arome" />
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2">{isFr ? "Ingrédients arômes" : "Flavor ingredients"}</h3>
                  <p className="text-sm text-dark/50 leading-relaxed">Zone EMEA</p>
                </div>
              </HoverLift>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28 bg-cream-light">
        <StaggerGrid className="w-[94%] max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "30+", labelFr: "Ans d'expertise", labelEn: "Years of expertise" },
            { value: "5000+", labelFr: "Ingrédients", labelEn: "Ingredients" },
            { value: "50+", labelFr: "Pays livrés", labelEn: "Countries served" },
            { value: "500+", labelFr: "Clients actifs", labelEn: "Active clients" },
          ].map((stat) => (
            <StaggerItem key={stat.value}>
              <p className="text-5xl md:text-6xl font-black text-[var(--brand-accent)] leading-none">{stat.value}</p>
              <p className="text-dark/50 mt-3 text-sm font-medium">
                {isFr ? stat.labelFr : stat.labelEn}
              </p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* CTA */}
      <MinimalCTA />
    </>
  );
}
