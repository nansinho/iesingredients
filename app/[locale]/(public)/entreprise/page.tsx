import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Shield, Award, Globe, Users, Leaf, Heart, Building2 } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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

      {/* Hero */}
      <section className="bg-dark pt-32 sm:pt-36 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
            <Building2 className="w-3.5 h-3.5" />
            {isFr ? "Notre histoire" : "Our story"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
            IES <span className="font-playfair italic text-peach">Ingredients</span>
          </h1>
          <p className="text-cream-light/50 text-lg max-w-3xl">
            {isFr
              ? "Depuis 1994, nous sélectionnons et distribuons les meilleurs ingrédients naturels pour l'industrie cosmétique, la parfumerie et l'agroalimentaire."
              : "Since 1994, we have been selecting and distributing the finest natural ingredients for the cosmetic industry, perfumery and food industry."}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/3 rounded-full blur-[150px]" />
        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10">
            <Image
              src="/images/botanicals-flat.jpg"
              alt={isFr ? "Ingrédients botaniques" : "Botanical ingredients"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brown/8 border border-brown/12 text-brown text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              {isFr ? "Notre mission" : "Our mission"}
            </span>
            <h2 className="text-dark dark:text-cream-light tracking-tight mt-4 mb-6">
              {isFr ? "L'Excellence au Service de la" : "Excellence in Service of"}{" "}
              <span className="font-playfair italic text-brown">{isFr ? "Nature" : "Nature"}</span>.
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
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-dark relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brown/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-peach/3 rounded-full blur-[120px]" />

        <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <Award className="w-3.5 h-3.5" />
              {isFr ? "Nos valeurs" : "Our values"}
            </span>
            <h2 className="text-cream-light tracking-tight">
              {isFr ? "Ce Qui Nous" : "What Drives"}{" "}
              <span className="font-playfair italic text-peach">{isFr ? "Anime" : "Us"}</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {values.map((v) => (
              <div
                key={v.titleFr}
                className="bg-cream-light/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-cream-light/[0.06] hover:border-brown/30 hover:bg-cream-light/[0.06] transition-all duration-500 group"
              >
                <div className="w-11 h-11 rounded-xl bg-peach/15 border border-peach/25 flex items-center justify-center mb-4 group-hover:bg-peach/25 transition-all duration-300">
                  <v.icon className="w-5 h-5 text-peach" />
                </div>
                <h3 className="font-bold text-cream-light mb-1.5 text-sm">
                  {isFr ? v.titleFr : v.titleEn}
                </h3>
                <p className="text-sm text-cream-light/40 leading-relaxed">
                  {isFr ? v.descFr : v.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <div className="max-w-[1400px] w-[90%] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "30+", labelFr: "Ans d'expertise", labelEn: "Years of expertise" },
            { value: "5000+", labelFr: "Ingrédients", labelEn: "Ingredients" },
            { value: "50+", labelFr: "Pays livrés", labelEn: "Countries served" },
            { value: "500+", labelFr: "Clients actifs", labelEn: "Active clients" },
          ].map((stat) => (
            <div key={stat.value}>
              <p className="text-4xl md:text-5xl font-black text-peach leading-none">{stat.value}</p>
              <p className="text-dark/50 dark:text-cream-light/50 mt-2 text-sm font-medium">
                {isFr ? stat.labelFr : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
