import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Shield, Award, Globe, Users, Leaf, Heart, Building2, ArrowRight } from "lucide-react";
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
    ? "Découvrez IES Ingredients : 30 ans d'expertise en distribution d'ingrédients naturels pour la cosmétique, la parfumerie et l'agroalimentaire."
    : "Discover IES Ingredients: 30 years of expertise in distributing natural ingredients for cosmetics, perfumery and food industry.";

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

const values = [
  { icon: Shield, titleFr: "Qualité", titleEn: "Quality", descFr: "Sélection rigoureuse de chaque ingrédient pour garantir l'excellence.", descEn: "Rigorous selection of each ingredient to guarantee excellence." },
  { icon: Globe, titleFr: "International", titleEn: "International", descFr: "Un réseau mondial de fournisseurs partenaires depuis 30 ans.", descEn: "A worldwide network of partner suppliers for 30 years." },
  { icon: Heart, titleFr: "Passion", titleEn: "Passion", descFr: "L'amour des ingrédients naturels est au cœur de notre métier.", descEn: "Love for natural ingredients is at the heart of our business." },
  { icon: Leaf, titleFr: "Durabilité", titleEn: "Sustainability", descFr: "Engagement envers un sourcing responsable et éthique.", descEn: "Commitment to responsible and ethical sourcing." },
  { icon: Award, titleFr: "Certifications", titleEn: "Certifications", descFr: "COSMOS, ECOCERT, BIO, ISO 9001 pour une qualité vérifiable.", descEn: "COSMOS, ECOCERT, BIO, ISO 9001 for verifiable quality." },
  { icon: Users, titleFr: "Proximité", titleEn: "Proximity", descFr: "Un accompagnement personnalisé pour chaque client.", descEn: "Personalized support for each client." },
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

      {/* Hero — Immersive with background image */}
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
                ? "Depuis 1994, nous sélectionnons et distribuons les meilleurs ingrédients naturels pour l'industrie cosmétique, la parfumerie et l'agroalimentaire."
                : "Since 1994, we have been selecting and distributing the finest natural ingredients for the cosmetic industry, perfumery and food industry."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/3 rounded-full blur-[150px]" />
        <div className="w-[94%] mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <AnimateIn y={30}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10">
              <Image
                src="/images/botanicals-flat.jpg"
                alt={isFr ? "Ingrédients botaniques" : "Botanical ingredients"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Glass badge on image */}
              <div className="absolute bottom-6 left-6 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg">
                <p className="text-[var(--brand-primary)] font-bold text-2xl">1994</p>
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
            <h2 className="text-dark dark:text-cream-light tracking-tight mt-4 mb-6">
              {isFr ? "L'Excellence au Service de la" : "Excellence in Service of"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Nature" : "Nature"}</span>.
            </h2>
            <div className="space-y-4 text-dark/60 dark:text-cream-light/50 text-lg leading-relaxed">
              <p>
                {isFr
                  ? "IES Ingredients est un distributeur B2B spécialisé dans les ingrédients naturels de haute qualité. Notre expertise couvre trois domaines clés : la cosmétique, la parfumerie et les arômes alimentaires."
                  : "IES Ingredients is a B2B distributor specializing in high-quality natural ingredients. Our expertise covers three key areas: cosmetics, perfumery and food flavors."}
              </p>
              <p>
                {isFr
                  ? "Basés à Nice, au cœur de la Côte d'Azur, nous bénéficions d'une position géographique idéale pour servir les industries de la beauté et des arômes à l'échelle internationale."
                  : "Based in Nice, in the heart of the French Riviera, we benefit from an ideal geographic position to serve the beauty and flavor industries internationally."}
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

      {/* Values */}
      <section className="py-20 md:py-28 bg-cream-light dark:bg-dark relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-accent-light)]/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--brand-primary)]/3 rounded-full blur-[120px]" />

        <div className="w-[94%] mx-auto relative z-10">
          <AnimateIn className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 text-[var(--brand-primary)] dark:text-[var(--brand-accent-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Award className="w-3.5 h-3.5" />
              {isFr ? "Nos valeurs" : "Our values"}
            </span>
            <h2 className="text-dark dark:text-cream-light tracking-tight">
              {isFr ? "Ce Qui Nous" : "What Drives"}{" "}
              <span className="font-playfair italic text-[var(--brand-accent)]">{isFr ? "Anime" : "Us"}</span>.
            </h2>
          </AnimateIn>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {values.map((v) => (
              <StaggerItem key={v.titleFr}>
                <HoverLift>
                  <div className="bg-white dark:bg-dark-card rounded-2xl p-7 border border-[var(--brand-primary)]/8 hover:border-[var(--brand-accent)]/25 hover:shadow-[0_12px_40px_rgba(212,144,126,0.08)] transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)]/8 border border-[var(--brand-primary)]/12 flex items-center justify-center mb-5 group-hover:bg-[var(--brand-primary)]/15 group-hover:scale-110 transition-all duration-300">
                      <v.icon className="w-5.5 h-5.5 text-[var(--brand-primary)]" />
                    </div>
                    <h3 className="font-bold text-dark dark:text-cream-light mb-2 text-base">
                      {isFr ? v.titleFr : v.titleEn}
                    </h3>
                    <p className="text-sm text-dark/50 dark:text-cream-light/50 leading-relaxed">
                      {isFr ? v.descFr : v.descEn}
                    </p>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28 bg-white dark:bg-dark">
        <StaggerGrid className="w-[94%] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "30+", labelFr: "Ans d'expertise", labelEn: "Years of expertise" },
            { value: "5000+", labelFr: "Ingrédients", labelEn: "Ingredients" },
            { value: "50+", labelFr: "Pays livrés", labelEn: "Countries served" },
            { value: "500+", labelFr: "Clients actifs", labelEn: "Active clients" },
          ].map((stat) => (
            <StaggerItem key={stat.value}>
              <p className="text-5xl md:text-6xl font-black text-[var(--brand-accent)] leading-none">{stat.value}</p>
              <p className="text-dark/50 dark:text-cream-light/50 mt-3 text-sm font-medium">
                {isFr ? stat.labelFr : stat.labelEn}
              </p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Partners */}
      <LogoMarquee />

      {/* CTA */}
      <MinimalCTA />
    </>
  );
}
