import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  Shield,
  Award,
  Globe,
  Users,
  Leaf,
  Heart,
  ArrowUpRight,
  MapPin,
  Calendar,
  Mail,
  Zap,
  Ear,
  HandHeart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AnimateIn, StaggerGrid, StaggerItem } from "@/components/ui/AnimateIn";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { MinimalCTA } from "@/components/home/MinimalCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description =
    locale === "fr"
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
  { year: "1993", titleFr: "Création d'IES", titleEn: "IES Founded", descFr: "Distribution des Ingrédients de Parfumerie Givaudan", descEn: "Distribution of Givaudan Perfumery Ingredients" },
  { year: "1994", titleFr: "Arômes Givaudan", titleEn: "Givaudan Aromas", descFr: "Distribution ingrédients arômes de Givaudan", descEn: "Distribution of Givaudan aroma ingredients" },
  { year: "2004", titleFr: "DSM Personal Care", titleEn: "DSM Personal Care", descFr: "Distribution de DSM Personal Care & Aroma Ingredients (PCA)", descEn: "Distribution of DSM Personal Care & Aroma Ingredients (PCA)" },
  { year: "2015", titleFr: "Xinrui Aromatics", titleEn: "Xinrui Aromatics", descFr: "Distribution Jiangsu Xinrui Aromatics (ex fournisseur Givaudan)", descEn: "Distribution of Jiangsu Xinrui Aromatics (former Givaudan supplier)" },
  { year: "2018", titleFr: "Extension zone EMEA", titleEn: "EMEA Zone Extension", descFr: "Extension de la zone de distribution Givaudan Parfumerie sur la zone EMEA", descEn: "Extension of Givaudan Perfumery distribution zone to EMEA" },
  { year: "2020", titleFr: "Vitalflower", titleEn: "Vitalflower", descFr: "Distribution extraits végétaux Vitalflower", descEn: "Distribution of Vitalflower plant extracts" },
  { year: "2021", titleFr: "House of Naturals & Jargent", titleEn: "House of Naturals & Jargent", descFr: "Distribution House of Naturals P&F et Cosmétiques, Distribution Jargent & Company", descEn: "Distribution of House of Naturals P&F and Cosmetics, Distribution of Jargent & Company" },
  { year: "2023", titleFr: "Givaudan Flavour", titleEn: "Givaudan Flavour", descFr: "Distribution de toute la gamme Givaudan Flavour Ingredients", descEn: "Distribution of the full Givaudan Flavour Ingredients range" },
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
  { nameFr: "DSM Personal Care", nameEn: "DSM Personal Care", zoneFr: "France, Belgique, Luxembourg & Monaco", zoneEn: "France, Belgium, Luxembourg & Monaco" },
  { nameFr: "DSM Aroma Ingredients", nameEn: "DSM Aroma Ingredients", zoneFr: "France, Belgique, Italie, Allemagne, Suisse, Pays-Bas, Luxembourg, Danemark, Lettonie, Lituanie, Grèce, Croatie, Ukraine, Russie, Turquie, Égypte", zoneEn: "France, Belgium, Italy, Germany, Switzerland, Netherlands, Luxembourg, Denmark, Latvia, Lithuania, Greece, Croatia, Ukraine, Russia, Turkey, Egypt" },
  { nameFr: "Givaudan Fragrances Ingredients", nameEn: "Givaudan Fragrances Ingredients", zoneFr: "Zone EMEA (Europe, Moyen-Orient & Afrique)", zoneEn: "EMEA zone (Europe, Middle East & Africa)" },
  { nameFr: "Givaudan Flavour Ingredients", nameEn: "Givaudan Flavour Ingredients", zoneFr: "France, Italie, Espagne, Suisse, Portugal, Turquie & Grèce et autres pays", zoneEn: "France, Italy, Spain, Switzerland, Portugal, Turkey & Greece and other countries" },
  { nameFr: "House of Naturals", nameEn: "House of Naturals", zoneFr: "Zone EMEA (Europe, Moyen-Orient & Afrique)", zoneEn: "EMEA zone (Europe, Middle East & Africa)" },
  { nameFr: "May Flower", nameEn: "May Flower", zoneFr: "France, Belgique, Luxembourg & Monaco", zoneEn: "France, Belgium, Luxembourg & Monaco" },
];

const locations = [
  { city: "Paris", labelFr: "Bureau commercial", labelEn: "Commercial office" },
  { city: "Allauch", labelFr: "Siège social & centre de distribution", labelEn: "Headquarters & distribution center" },
  { city: "Dubaï", labelFr: "Bureau commercial", labelEn: "Commercial office" },
];

const commitments = [
  { icon: Zap, titleFr: "Dynamique", titleEn: "Dynamic", descFr: "Une équipe motivée, présente au quotidien pour nos clients.", descEn: "A motivated team, present daily for our clients." },
  { icon: Ear, titleFr: "À l'écoute", titleEn: "Attentive", descFr: "Des solutions d'approvisionnement co-construites avec nos parties prenantes.", descEn: "Sourcing solutions co-built with our stakeholders." },
  { icon: HandHeart, titleFr: "Engagé", titleEn: "Committed", descFr: "Relations de long terme avec nos clients, engagement pour la planète.", descEn: "Long-term relationships with clients, commitment to the planet." },
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

      {/* ═══ Hero — cinematic ═══ */}
      <section className="relative min-h-[75vh] bg-brand-primary overflow-hidden flex items-center pt-32 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/botanicals-flat.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/85 to-brand-primary/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/60 via-transparent to-brand-primary" />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 80% 35%, hsl(var(--brand-accent) / 0.18) 0%, transparent 55%)" }}
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
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                {isFr ? "L'entreprise" : "The company"}
              </span>
              <div className="h-px flex-1 max-w-[180px] bg-white/15" />
              <span className="text-[11px] font-mono text-white/30 hidden sm:inline">Depuis 1993</span>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} y={30}>
            <h1
              className="text-white font-semibold tracking-[-0.035em] leading-[0.98] mb-6"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 7rem)" }}
            >
              {isFr ? "Distributeur" : "Distributor"}
              <br />
              <span className="text-brand-accent">{isFr ? "depuis 1993." : "since 1993."}</span>
            </h1>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-8">
            <AnimateIn delay={0.2} y={20} className="lg:col-span-6">
              <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-xl">
                {isFr
                  ? "International Express Service — expert en distribution de matières premières pour l'industrie du parfum, de la cosmétique et des arômes depuis 1993."
                  : "International Express Service — expert in raw material distribution for the perfume, cosmetics and flavor industries since 1993."}
              </p>
            </AnimateIn>

            <AnimateIn delay={0.3} y={20} className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-6 lg:justify-end">
                {[
                  { value: "30+", label: isFr ? "Années" : "Years" },
                  { value: "5000+", label: isFr ? "Ingrédients" : "Ingredients" },
                  { value: "50+", label: isFr ? "Pays" : "Countries" },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-white">{s.value}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">{s.label}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══ Introduction ═══ */}
      <section className="py-20 md:py-28 bg-cream-light">
        <div className="w-[94%] max-w-7xl mx-auto grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
          <AnimateIn y={30} className="md:col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/images/botanicals-flat.jpg"
                alt={isFr ? "Ingrédients botaniques" : "Botanical ingredients"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-4">
                <div className="text-3xl font-semibold text-brand-primary tracking-tight">1993</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-brand-primary/50 font-semibold mt-1">
                  {isFr ? "Année de création" : "Year founded"}
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.15} y={30} className="md:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-dark/40 block mb-4">
              {isFr ? "Notre mission" : "Our mission"}
            </span>
            <h2
              className="text-dark tracking-[-0.03em] font-semibold leading-[1.05] mb-6"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "L'excellence au service" : "Excellence in service"}
              <br />
              <span className="text-brand-accent">{isFr ? "de la nature." : "of nature."}</span>
            </h2>
            <div className="space-y-4 text-dark/60 text-base leading-relaxed max-w-xl">
              <p>
                {isFr
                  ? "La société IES a été créée en 1993 par François-Patrick SABATER, PDG, sur le site provençal de Marseille. IES est expert dans la distribution de matières premières au service des professionnels de l'industrie du parfum, de la cosmétique et des arômes."
                  : "IES was founded in 1993 by François-Patrick SABATER, CEO, in Marseille, Provence. IES is an expert in distributing raw materials for professionals in the perfume, cosmetics and flavor industries."}
              </p>
              <p>
                {isFr
                  ? "Le siège social est situé dans la région de Marseille, sur la commune d'Allauch. Un site de 3600 m² est également présent aux Émirats Arabes Unis à Dubaï."
                  : "Our headquarters are located in the Marseille region, in the municipality of Allauch. A 3,600 m² facility is also present in Dubai, United Arab Emirates."}
              </p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white text-sm font-semibold shadow-lg shadow-brand-accent/20 transition-all"
            >
              {isFr ? "Voir le catalogue" : "View catalog"}
              <ArrowUpRight className="w-4 h-4 transition-transform hover:-translate-y-0.5 hover:translate-x-0.5" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ Implantations — minimal row ═══ */}
      <section className="py-20 md:py-24 bg-brand-primary border-y border-white/5">
        <div className="w-[94%] max-w-7xl mx-auto">
          <AnimateIn className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                {isFr ? "Implantations" : "Locations"}
              </span>
            </div>
            <h2
              className="text-white font-semibold tracking-[-0.03em] max-w-2xl"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "Une présence internationale." : "An international presence."}
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {locations.map((loc, idx) => (
              <AnimateIn key={loc.city} delay={idx * 0.1} className="p-6 md:p-8 first:pl-0 last:pr-0">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">0{idx + 1}</span>
                  <MapPin className="w-4 h-4 text-brand-accent" />
                </div>
                <div className="text-3xl font-semibold text-white tracking-tight mb-2">{loc.city}</div>
                <div className="text-sm text-white/50 leading-relaxed">{isFr ? loc.labelFr : loc.labelEn}</div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Timeline ═══ */}
      <section className="py-20 md:py-28 bg-cream-light">
        <div className="w-[94%] max-w-4xl mx-auto">
          <AnimateIn className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <Calendar className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/40">
                {isFr ? "Historique" : "History"}
              </span>
            </div>
            <h2
              className="text-dark font-semibold tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "30 ans de" : "30 years of"}{" "}
              <span className="text-brand-accent">{isFr ? "partenariats." : "partnerships."}</span>
            </h2>
          </AnimateIn>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-dark/10" />
            <div className="space-y-10">
              {timeline.map((item, index) => (
                <AnimateIn key={item.year} delay={index * 0.05}>
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-brand-accent ring-4 ring-cream-light" />
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-xs font-mono text-brand-accent font-semibold tracking-[0.15em]">{item.year}</span>
                      <div className="h-px flex-1 bg-dark/10" />
                    </div>
                    <h3 className="font-semibold text-dark text-lg tracking-tight mb-1">
                      {isFr ? item.titleFr : item.titleEn}
                    </h3>
                    <p className="text-sm text-dark/55 leading-relaxed">
                      {isFr ? item.descFr : item.descEn}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Valeurs — dark minimal grid ═══ */}
      <section className="py-20 md:py-28 bg-brand-primary">
        <div className="w-[94%] max-w-7xl mx-auto">
          <AnimateIn className="mb-14 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Award className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                {isFr ? "Nos valeurs" : "Our values"}
              </span>
            </div>
            <h2
              className="text-white font-semibold tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "Ce qui nous" : "What drives"}{" "}
              <span className="text-brand-accent">{isFr ? "anime." : "us."}</span>
            </h2>
          </AnimateIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-x md:divide-y-0 divide-white/8 border-y md:border md:border-white/8 rounded-none md:rounded-2xl overflow-hidden">
            {values.map((v) => (
              <StaggerItem key={v.titleFr}>
                <div className="p-8 md:p-10 h-full hover:bg-white/[0.03] transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/15 flex items-center justify-center mb-5 group-hover:bg-brand-accent/25 transition-colors">
                    <v.icon className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="font-semibold text-white text-lg tracking-tight mb-2">
                    {isFr ? v.titleFr : v.titleEn}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {isFr ? v.descFr : v.descEn}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══ Engagements RSE ═══ */}
      <section className="py-20 md:py-28 bg-cream-light">
        <div className="w-[94%] max-w-6xl mx-auto">
          <AnimateIn className="mb-14 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Leaf className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/40">
                {isFr ? "Engagements" : "Commitments"}
              </span>
            </div>
            <h2
              className="text-dark font-semibold tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "Une démarche" : "A genuine"}{" "}
              <span className="text-brand-accent">{isFr ? "RSE engagée." : "CSR commitment."}</span>
            </h2>
            <p className="text-dark/55 text-base leading-relaxed max-w-xl">
              {isFr
                ? "Contribuer à l'excellence de la production de parfums, d'arômes et de cosmétiques par une démarche responsable."
                : "Contributing to excellence in perfume, flavor and cosmetics production through a responsible approach."}
            </p>
          </AnimateIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-dark/8 border-y md:border md:border-dark/8 rounded-none md:rounded-2xl overflow-hidden bg-white">
            {commitments.map((c) => (
              <StaggerItem key={c.titleFr}>
                <div className="p-8 md:p-10 h-full hover:bg-cream-light/50 transition-colors">
                  <c.icon className="w-5 h-5 text-brand-accent mb-5" />
                  <h3 className="font-semibold text-dark text-lg tracking-tight mb-2">
                    {isFr ? c.titleFr : c.titleEn}
                  </h3>
                  <p className="text-sm text-dark/55 leading-relaxed">
                    {isFr ? c.descFr : c.descEn}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* ISO cert + ethics */}
          <AnimateIn delay={0.2} className="mt-10 grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-8 border border-dark/8 flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-dark text-base mb-1.5">
                  {isFr ? "Certifié ISO 9001" : "ISO 9001 Certified"}
                </h3>
                <p className="text-sm text-dark/55 leading-relaxed">
                  {isFr
                    ? "Certification depuis novembre 2017 sur notre site d'Allauch pour l'amélioration continue de la satisfaction client."
                    : "Certified since November 2017 at our Allauch site, for continuous customer satisfaction improvement."}
                </p>
              </div>
            </div>
            <a
              href="mailto:ethique@ies-ingredients.com"
              className="group bg-white rounded-2xl p-8 border border-dark/8 hover:border-brand-accent/30 hover:bg-cream-light/30 flex items-start gap-5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-dark text-base mb-1.5">
                  {isFr ? "Contact éthique" : "Ethics contact"}
                </h3>
                <p className="text-sm text-dark/55 leading-relaxed mb-2">
                  {isFr
                    ? "Adresse dédiée pour signaler toute violation du code de conduite."
                    : "Dedicated address to report any code of conduct violation."}
                </p>
                <div className="text-sm font-semibold text-brand-accent inline-flex items-center gap-1.5">
                  ethique@ies-ingredients.com
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
                </div>
              </div>
            </a>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ Partenaires — Pennylane rows ═══ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="w-[94%] max-w-7xl mx-auto">
          <AnimateIn className="mb-14 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Globe className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-dark/40">
                {isFr ? "Distribution" : "Distribution"}
              </span>
            </div>
            <h2
              className="text-dark font-semibold tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "Distributeur exclusif de" : "Exclusive distributor of"}{" "}
              <span className="text-brand-accent">{isFr ? "marques prestigieuses." : "prestigious brands."}</span>
            </h2>
            <p className="text-dark/55 text-base leading-relaxed max-w-xl">
              {isFr
                ? "Un réseau de partenaires leaders sur leur marché, construit sur 30 années de relations de confiance."
                : "A network of market-leading partners, built on 30 years of trusted relationships."}
            </p>
          </AnimateIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-dark/8 border-y md:border md:border-dark/8 rounded-none md:rounded-2xl overflow-hidden md:[&>*:nth-child(odd)]:border-r md:[&>*:nth-child(odd)]:border-dark/8">
            {partners.map((p) => (
              <StaggerItem key={p.nameFr}>
                <div className="p-6 md:p-8 hover:bg-cream-light/40 transition-colors h-full">
                  <h4 className="font-semibold text-dark text-base tracking-tight mb-2">
                    {isFr ? p.nameFr : p.nameEn}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-dark/40 font-semibold shrink-0">
                      {isFr ? "Zone" : "Zone"}
                    </span>
                    <span className="text-sm text-dark/60 leading-relaxed">
                      {isFr ? p.zoneFr : p.zoneEn}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══ Logos partenaires ═══ */}
      <LogoMarquee />

      {/* ═══ Zones distribution — dark minimal ═══ */}
      <section className="py-20 md:py-28 bg-brand-primary">
        <div className="w-[94%] max-w-7xl mx-auto">
          <AnimateIn className="mb-14 max-w-3xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 block mb-5">
              {isFr ? "Nos zones" : "Our zones"}
            </span>
            <h2
              className="text-white font-semibold tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              {isFr ? "Trois gammes," : "Three ranges,"}{" "}
              <span className="text-brand-accent">{isFr ? "une expertise." : "one expertise."}</span>
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-y md:border md:border-white/10 rounded-none md:rounded-2xl overflow-hidden">
            {[
              { icon: Leaf, titleFr: "Ingrédients cosmétiques", titleEn: "Cosmetic ingredients", zoneFr: "France, Belgique, Luxembourg & Monaco", zoneEn: "France, Belgium, Luxembourg & Monaco", accent: "#5B7B6B" },
              { icon: Heart, titleFr: "Ingrédients parfums", titleEn: "Perfume ingredients", zoneFr: "Zone EMEA", zoneEn: "EMEA zone", accent: "#8B6A80" },
              { icon: Award, titleFr: "Ingrédients arômes", titleEn: "Flavor ingredients", zoneFr: "Zone EMEA", zoneEn: "EMEA zone", accent: "#D4907E" },
            ].map((z, i) => (
              <AnimateIn key={z.titleFr} delay={i * 0.1}>
                <div className="p-8 md:p-10 h-full hover:bg-white/[0.03] transition-colors">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                    style={{ background: `${z.accent}25` }}
                  >
                    <z.icon className="w-4 h-4" style={{ color: z.accent }} />
                  </div>
                  <h3 className="font-semibold text-white text-lg tracking-tight mb-2">
                    {isFr ? z.titleFr : z.titleEn}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {isFr ? z.zoneFr : z.zoneEn}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <MinimalCTA />
    </>
  );
}
